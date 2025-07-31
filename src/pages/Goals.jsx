import { Plus, SearchIcon } from "lucide-react";
import Modal from "../components/goalsComponent/Modal";
import OverviewGoals from "../components/overviewComponents/OverviewGoals";
import { useEffect, useState } from "react";
import { db, auth } from "../components/firebase/firebase";
import {
  addDoc,
  collection,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import GoalHeader from "../components/overviewComponents/SearchGoal";

export default function Goals() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoadingGoal, setIsLoadingGoal] = useState(false);

  // Track authentication and listen to user's goals in real-time
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userGoalsRef = collection(db, "users", currentUser.uid, "goals");
        const q = query(userGoalsRef);

        const unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const fetchedGoals = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setGoals(fetchedGoals);
          },
          (error) => {
            console.error("Snapshot error:", error.message);
          }
        );

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    const form = e.target;
    setIsLoadingGoal(true)

    if (!user) {
      alert("You must be logged in to add a goal.");
      return;
    }

    const newGoal = {
      priority: form.priority.value,
      title: form.title.value,
      description: form.description.value,
      deadline: form.deadline.value,
      completed: false,
      createdAt: serverTimestamp(),
    };

    try {
      const userGoalsRef = collection(db, "users", user.uid, "goals");
      const docRef = await addDoc(userGoalsRef, newGoal);
      const addedDoc = await getDoc(docRef);
      setGoals((prev) => [...prev, { id: addedDoc.id, ...addedDoc.data() }]);
      closeModal();
      form.reset();
    } catch (error) {
      console.error("Error adding goal: ", error);
      alert("Failed to save goal.");
    } finally {
      setIsLoadingGoal(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between sm:px-5 px-0">
        <h1 className="font-bold sm:text-2xl text-[16px] cursor-pointer">
          Add New Goal
        </h1>
        <div className="flex gap-6 items-center">

          <span className="hover:bg-teal-500 hover:text-white p-2 rounded-full cursor-pointer"
            onClick={() => setShowSearch((prev) => !prev)}>
            <SearchIcon size={20} />
          </span>

          <button
            onClick={openModal}
            className="bg-teal-500 sm:p-2 p-1.5 text-sm sm:text-[15px] flex items-center justify-center gap-1 text-white rounded-sm font-semibold"
          >
            <Plus size={20} /> Add Goal
          </button>
        </div>

      </div>


      <Modal isOpen={isModalOpen} onclose={closeModal}>
        <form onSubmit={handleAddGoal}>
          <h1 className="font-bold text-black text-xl py-2">Add New Goal</h1>

          <label className="text-black text-sm py-2" htmlFor="title">
            Goal Title:
          </label>
          <input
            className="border text-black border-black w-full p-1.5 rounded-md my-2"
            name="title"
            required
            type="text"
          />

          <div className="flex items-baseline gap-4 sm:flex-row flex-col">
            <div className="flex flex-col">
              <label className="text-black text-sm py-1" htmlFor="description">
                Description:
              </label>
              <input
                className="border text-start text-black border-black w-[260px] p-1.5 h-32 rounded-md my-2"
                name="description"
                type="text"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-black text-sm py-1" htmlFor="priority">
                Priority:
              </label>
              <select
                name="priority"
                className="border text-black border-black sm:w-[130px] w-[260px] p-1 rounded-md my-1"
              >
                <option value="High">HIGH</option>
                <option value="Mid">MID</option>
                <option value="Low">LOW</option>
              </select>

              <label className="text-black text-sm py-1" htmlFor="deadline">
                Deadline:
              </label>
              <input
                className="border border-black sm:w-[130px] w-[260px] p-1.5 text-black rounded-md my-1"
                name="deadline"
                type="date"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button disabled={isLoadingGoal} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-700">
              {isLoadingGoal ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </div>
                </>
              ) : (
                "Add"
              )}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Exit
            </button>
          </div>
        </form>
      </Modal>

      {showSearch &&
        <GoalHeader search={search} setSearch={setSearch} />
      }
      <OverviewGoals
        goals={goals.filter((goal) => {
          const title = goal.title || "";
          const description = goal.description || "";
          return (
            title.toLowerCase().includes(search.toLowerCase()) ||
            description.toLowerCase().includes(search.toLowerCase())
          );
        })}
        setGoals={setGoals}
      />
    </div>
  );
}
