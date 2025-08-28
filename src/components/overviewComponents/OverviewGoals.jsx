import { Edit, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import Modal from "../goalsComponent/Modal";
import { ThemeContext } from "./ThemeContext";
import { doc, updateDoc, serverTimestamp, deleteField } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { GoDependabot } from "react-icons/go";
import { CATEGORY_MAP } from "../../CategoryList";
import DashboardNav from "./DashboardNav";

export default function OverviewGoals({ goals = [], setGoals }) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteGoal, setDeleteGoal] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [isEditGoalLoading, setIsEditGoalLoading] = useState(false);
  const [isDeleteGoalLoading, setIsDeleteGoalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGoals, setFilteredGoals] = useState([]);

  const { theme } = useContext(ThemeContext);

  const textColor = theme === "dark" ? "text-black" : "text-gray-800";
  const subTextColor = theme === "dark" ? "text-black" : "text-gray-500";

  // Filter goals based on search term
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = goals.filter(goal =>
      !goal.deleted && (
        (goal.title || "").toLowerCase().includes(term) ||
        (goal.description || "").toLowerCase().includes(term) ||
        ((goal.category || "") + "").toLowerCase().includes(term)
      )
    );
    setFilteredGoals(filtered);
  }, [goals, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const openEditModal = (goal) => {
    setEditGoal(goal);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditGoal(null);
    setEditModalOpen(false);
  };

  const openDeleteModal = (goal) => {
    setDeleteGoal(goal);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteGoal(null);
    setDeleteModalOpen(false);
  };

  // Toggle completion: write completedAt when setting completed, delete the field when unchecking
  const handleToggleCompletion = async (goal) => {
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    const userGoalRef = doc(db, "users", auth.currentUser.uid, "goals", goal.id);
    const newCompletedStatus = !goal.completed;
    const updates = { completed: newCompletedStatus };

    if (newCompletedStatus) {
      updates.completedAt = serverTimestamp();
    } else {
      updates.completedAt = deleteField();
    }

    try {
      await updateDoc(userGoalRef, updates);

      // Optimistically update local state: set completed and completedAt (use Date for immediate UI)
      const updatedGoals = goals.map((g) =>
        g.id === goal.id
          ? {
            ...g,
            completed: newCompletedStatus,
            completedAt: newCompletedStatus ? new Date() : null,
          }
          : g
      );
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating completion status:", error.message);
    }
  };

  const handleDeleteGoal = async () => {
    if (!deleteGoal) return;
    setIsDeleteGoalLoading(true);

    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      setIsDeleteGoalLoading(false);
      return;
    }

    try {
      const userGoalsRef = doc(db, "users", auth.currentUser.uid, "goals", deleteGoal.id);
      // mark as deleted (soft delete)
      await updateDoc(userGoalsRef, { deleted: true });

      const updatedGoals = goals.map((goal) =>
        goal.id === deleteGoal.id ? { ...goal, deleted: true } : goal
      );
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Error marking goal as deleted:", error.message);
    } finally {
      setIsDeleteGoalLoading(false);
    }
    closeDeleteModal();
  };

  const handleEditGoal = async (e) => {
    e.preventDefault();
    const form = e.target;
    setIsEditGoalLoading(true);

    const updatedGoal = {
      ...editGoal,
      title: form.title.value,
      description: form.description.value,
      priority: form.priority.value,
      category: form.category.value,
      deadline: form.deadline.value,
    };

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid, "goals", editGoal.id), updatedGoal);
      const updatedGoalWithId = { ...updatedGoal, id: editGoal.id };
      const updatedGoals = goals.map((goal) =>
        goal.id === editGoal.id ? updatedGoalWithId : goal
      );
      setGoals(updatedGoals);
      closeEditModal();
    } catch (error) {
      console.error("Error editing goal:", error.message);
    } finally {
      setIsEditGoalLoading(false);
    }
  };

  // Ensure goals are unique
  const uniqueGoals = filteredGoals.filter(
    (goal, index, self) => index === self.findIndex((g) => g.id === goal.id)
  );

  // Filter out deleted and sort by createdAt (older -> newer)
  const visibleGoals = uniqueGoals
    .filter((goal) => !goal.deleted)
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        // handle Firestore Timestamp objects (has toDate())
        const aDate = typeof a.createdAt?.toDate === "function" ? a.createdAt.toDate() : new Date(a.createdAt);
        const bDate = typeof b.createdAt?.toDate === "function" ? b.createdAt.toDate() : new Date(b.createdAt);
        return aDate - bDate;
      }
      return 0;
    });

  return (
    <div className="mb-20">
      <DashboardNav onSearch={handleSearch} />

      <div className="font-sans m-2 md:px-5 sm:pe-2 pe-5 grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 mt-24 gap-5 w-full justify-start">
        {visibleGoals.length === 0 ? (
          <div className={`col-span-full text-center py-10 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {searchTerm ? (
              <p>No goals found matching {searchTerm}</p>
            ) : (
              <p>No goals found</p>
            )}
          </div>
        ) : (
          visibleGoals.map((goal) => {
            const categoryInfo = CATEGORY_MAP[goal.category] || {};
            const CategoryIcon = categoryInfo.icon;

            return (
              <div
                key={goal.id}
                className={`relative border px-5 hover:shadow-md transition duration-200 cursor-pointer w-full h-auto flex flex-col rounded-md p-3 
                  ${goal.priority === "High"
                    ? "bg-red-100"
                    : goal.priority === "Mid"
                      ? "bg-green-100"
                      : goal.priority === "Low"
                        ? "bg-orange-100"
                        : "bg-gray-100"
                  } 
                  ${goal.completed ? "line-through opacity-50" : ""}`}
              >
                {goal.category && (
                  <span
                    className={`absolute top-3 right-3 flex items-center gap-2 text-sm w-max px-3 py-1 rounded-full ${categoryInfo.color || "bg-gray-200 text-gray-700"}`}
                  >
                    {CategoryIcon && <CategoryIcon size={15} />} {goal.category}
                  </span>
                )}

                <div className="flex items-center p-0 m-0">
                  <span
                    className={`${goal.priority === "High"
                      ? "text-red-500"
                      : goal.priority === "Mid"
                        ? "text-green-500"
                        : goal.priority === "Low"
                          ? "text-orange-500"
                          : "text-black"
                      } font-semibold uppercase`}
                  >
                    {goal.priority}
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-5">
                  <span className={`font-semibold text-xl ${goal.completed ? "text-gray-400" : textColor}`}>
                    {goal.title}
                  </span>
                  <span className={`text-lg ${goal.completed ? "text-gray-400" : textColor}`}>
                    {goal.description}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-[15px] ${goal.completed ? "text-gray-400" : subTextColor}`}>
                      Deadline:
                    </span>
                    <span className={`font-semibold text-[15px] ${goal.completed ? "text-gray-400" : subTextColor}`}>
                      {goal.deadline ? new Date(goal.deadline).toDateString() : "No deadline"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!goal.completed}
                        onChange={() => handleToggleCompletion(goal)}
                        className="transform scale-150"
                      />

                      <Trash2
                        className={`text-red-500 cursor-pointer ${goal.completed ? "opacity-50 cursor-not-allowed" : ""}`}
                        style={{ width: "17px" }}
                        onClick={() => !goal.completed && openDeleteModal(goal)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <GoDependabot
                        className={`text-blue-500 cursor-pointer ${goal.completed ? "opacity-50 cursor-not-allowed" : ""}`}
                        size={20}
                      />
                      <Edit
                        onClick={() => !goal.completed && openEditModal(goal)}
                        style={{ width: "17px" }}
                        className={`cursor-pointer text-black ${goal.completed ? "opacity-50 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 py-9 px-5 rounded-md">
            <h2 className="text-xl font-bold text-red-500">
              Are you sure you want to delete this goal?
            </h2>
            <div className="flex justify-end gap-4 mt-4">
              <button
                disabled={isDeleteGoalLoading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={handleDeleteGoal}
              >
                {isDeleteGoalLoading ? (
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
                    Deleting...
                  </div>
                ) : (
                  "Yes"
                )}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editGoal && (
        <Modal isOpen={isEditModalOpen} onclose={closeEditModal}>
          <form onSubmit={handleEditGoal}>
            <h1 className="font-bold text-black text-xl py-2">Edit Goal</h1>

            <label className="text-black text-sm py-2" htmlFor="title">Goal Title:</label>
            <input
              name="title"
              className="border text-black border-black w-full p-1.5 rounded-md my-2"
              type="text"
              defaultValue={editGoal.title}
              required
            />

            <div className="flex flex-col">
              <label className="text-black text-sm py-2" htmlFor="description">Description:</label>
              <textarea
                name="description"
                className="border text-black border-black w-full p-1.5 h-20 rounded-md my-2 bg-transparent resize-none break-words"
                defaultValue={editGoal.description}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-black text-sm py-1" htmlFor="priority">Priority:</label>
              <select
                name="priority"
                className="border text-black border-black w-full p-1 rounded-md my-1"
                defaultValue={editGoal.priority}
                required
              >
                <option value="High">HIGH</option>
                <option value="Mid">MID</option>
                <option value="Low">LOW</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-black text-sm py-1" htmlFor="category">Category:</label>
              <select
                name="category"
                className="border text-black border-black w-full p-1 rounded-md my-1"
                defaultValue={editGoal.category}
                required
              >
                {Object.keys(CATEGORY_MAP).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <label className="text-black text-sm py-1" htmlFor="deadline">Deadline:</label>
            <input
              name="deadline"
              className="border text-black border-black w-full p-1.5 rounded-md my-2"
              type="date"
              defaultValue={editGoal.deadline}
              required
            />

            <button disabled={isEditGoalLoading} className="w-full bg-blue-500 text-white rounded-md mt-3 py-2">
              {isEditGoalLoading ? (
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
                  Editing...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </Modal>
      )}


    </div>
  );
}

OverviewGoals.propTypes = {
  goals: PropTypes.array.isRequired,
  setGoals: PropTypes.func.isRequired,
};
