import { Plus } from "lucide-react";
import Modal from "../components/goalsComponent/Modal";
import OverviewGoals from "../components/overviewComponents/OverviewGoals";
import { useEffect, useState } from "react";
import { db, auth } from "../components/firebase/firebase";
import { CATEGORY_MAP } from "../CategoryList";
import {
  addDoc,
  collection,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";


export default function Goals() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoadingGoal, setIsLoadingGoal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("creation");
  const [filterStatus, setFilterStatus] = useState("All");
  const location = useLocation();
  const navigate = useNavigate();


  // Track authentication and listen to user's goals in real-time
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userGoalsRef = collection(db, "users", currentUser.uid, "goals");
        const q = query(userGoalsRef, orderBy("createdAt", "asc")); // store in default order

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
    setIsLoadingGoal(true);

    if (!user) {
      alert("You must be logged in to add a goal.");
      return;
    }

    const newGoal = {
      priority: form.priority.value,
      category: form.category.value,
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

  // ✅ Apply filter + sorting
  const filteredGoals = goals.filter((goal) => {
    let matchesCategory =
      filterCategory === "All" || goal.category === filterCategory;
    let matchesCompletion =
      filterStatus === "All" ||
      (filterStatus === "Completed" && goal.completed) ||
      (filterStatus === "Incomplete" && !goal.completed);

    return matchesCategory && matchesCompletion;
  });

  // ✅ Apply sorting
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      case "creation":
        return (
          new Date(a.createdAt?.toDate?.() || a.createdAt) -
          new Date(b.createdAt?.toDate?.() || b.createdAt)
        );
      default:
        return 0; // keep Firestore order
    }
  });

  useEffect(() => {
    if (location.state?.openModal) {
      setModalOpen(true);
      // Clear the state so it doesn’t reopen accidentally
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div>
      <div className="flex items-center justify-between mt-20">
        <div className="flex sm:flex-row flex-col sm:items-center items-start sm:justify-between justify-start w-full sm:px-6 px-2 py-3">
          <span className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">My Goals</h1>
            <p className="text-lg">Manage and track goals in one place</p>
          </span>

          <span className="sm:my-0 my-3">
            <button
              onClick={openModal}
              className="bg-purple-500 sm:flex hidden sm:px-6 sm:py-3 p-1.5 text-sm sm:text-[15px]  items-center justify-center gap-1 text-white rounded-sm font-semibold"
            >
              <Plus size={20} /> Add New Goal
            </button>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:px-6 px-2">
        {/* Filter Category */}
        <select
          className="w-full sm:w-max p-1 rounded-md border border-black text-black"
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          {Object.keys(CATEGORY_MAP).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Sort Goals */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-max p-1 rounded-md border border-black text-black"
        >
          <option value="creation">Sort by Creation Date</option>
          <option value="deadline">Sort by Deadline</option>
        </select>

        {/* Filter Completion */}
        <select
          className="w-full sm:w-max p-1 rounded-md border border-black text-black"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Goals</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>

      </div>

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onclose={closeModal}>
        <form onSubmit={handleAddGoal}>
          <h1 className="font-bold text-black text-xl py-2">Add New Goal</h1>

          <label className="text-black text-sm py-2" htmlFor="title">
            Goal Title:
          </label>
          <input
            disabled={isLoadingGoal}
            className="border text-black border-black w-full p-1.5 rounded-md my-2"
            name="title"
            required
            type="text"
          />

          <div className="flex flex-col">
            <label className="text-black text-sm py-1" htmlFor="description">
              Description:
            </label>
            <textarea
              disabled={isLoadingGoal}
              className="border text-black border-black w-full p-1.5 h-20 rounded-md my-2 bg-transparent resize-none break-words"
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
              disabled={isLoadingGoal}
              name="priority"
              className="border text-black border-black w-full p-1 rounded-md my-1"
            >
              <option value="High">HIGH</option>
              <option value="Mid">MID</option>
              <option value="Low">LOW</option>
            </select>

            <div className="flex flex-col">
              <label className="text-black text-sm py-1" htmlFor="category">
                Category:
              </label>
              <select
                disabled={isLoadingGoal}
                name="category"
                className="border text-black border-black w-full p-1 rounded-md my-1"
              >
                {Object.keys(CATEGORY_MAP).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <label className="text-black text-sm py-1" htmlFor="deadline">
              Deadline:
            </label>
            <input
              disabled={isLoadingGoal}
              className="border border-black w-full p-1.5 text-black rounded-md my-1"
              name="deadline"
              type="date"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={isLoadingGoal}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-700"
            >
              {isLoadingGoal ? (
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
                </div>
              ) : (
                "Create Goal"
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

      {sortedGoals.length === 0 ? (
        <div className="sm:px-6 px-0 mt-6 text-gray-600 text-lg font-medium">
          No goals found for {filterCategory}
        </div>
      ) : (
        <OverviewGoals goals={sortedGoals} setGoals={setGoals} />
      )}
    </div>
  );
}
