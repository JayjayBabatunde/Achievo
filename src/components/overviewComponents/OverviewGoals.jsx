import { Calendar, Dot, Edit, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "../goalsComponent/Modal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";

export default function OverviewGoals({ goals = [], setGoals }) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteGoal, setDeleteGoal] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [isEditGoalLoading, setIsEditGoalLoading] = useState(false);
  const [isDeleteGoalLoading, setIsDeleteGoalLoading] = useState(false);


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

  const handleToggleCompletion = async (goal) => {
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    const userGoalsRef = doc(db, "users", auth.currentUser.uid, "goals", goal.id);
    const updatedGoal = { ...goal, completed: !goal.completed };

    try {
      await updateDoc(userGoalsRef, { completed: updatedGoal.completed });
      const updatedGoals = goals.map((g) => (g.id === goal.id ? updatedGoal : g));
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating completion status:", error.message);
    }
  };

  const handleDeleteGoal = async () => {
    setIsDeleteGoalLoading(true);
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    try {
      const userGoalsRef = doc(db, "users", auth.currentUser.uid, "goals", deleteGoal.id);
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
      deadline: form.deadline.value,
    };

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid, "goals", editGoal.id), updatedGoal);
      const updatedGoals = goals.map((goal) =>
        goal.id === editGoal.id ? updatedGoal : goal
      );
      setGoals(updatedGoals);
      closeEditModal();
    } catch (error) {
      console.error("Error editing goal:", error.message);
    } finally {
      setIsEditGoalLoading(false);
    }
  };

  const uniqueGoals = goals.filter(
    (goal, index, self) => index === self.findIndex((g) => g.id === goal.id)
  );

  const visibleGoals = uniqueGoals.filter((goal) => !goal.deleted);

  return (
    <div className="font-sans m-2 md:px-5 sm:pe-2 pe-3 grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 mt-6 gap-5 w-full justify-start">
      {visibleGoals.map((goal) => (
        <div
          key={goal.id}
          className={`border w-full rounded-md p-3 ${goal.completed ? "line-through opacity-50" : ""}`}
        >
          <div className="flex items-center p-0 m-0">
            <span>
              <Dot
                size={70}
                className={
                  goal.priority === "High"
                    ? "text-red-500"
                    : goal.priority === "Mid"
                      ? "text-green-500"
                      : goal.priority === "Low"
                        ? "text-orange-500"
                        : "text-black"
                }
              />
            </span>
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

          <div className="ps-4 flex flex-col gap-2">
            <span className="font-semibold text-[18px]">{goal.title}</span>
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span className="font-semibold text-gray-500 text-[13px]">
                Due {new Date(goal.deadline).toDateString()}
              </span>
            </div>
            <span className="text-[14px]">{goal.description}</span>

            <div className="flex justify-between items-center">
              <input
                type="checkbox"
                checked={goal.completed || false}
                onChange={() => handleToggleCompletion(goal)}
                className="transform scale-200"
              />
              <div className="flex items-center gap-2">
                <Edit
                  onClick={() => openEditModal(goal)}
                  style={{ width: "17px" }}
                  className="cursor-pointer"
                />
                <Trash2
                  className="text-red-500 cursor-pointer"
                  style={{ width: "17px" }}
                  onClick={() => openDeleteModal(goal)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* MODAL TO DELETE GOAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 py-9 px-5 rounded-md">
            <h2 className="text-xl font-bold text-red-500">
              Are you sure you want to delete this goal?
            </h2>
            <div className="flex justify-end gap-4 mt-4">
              <button disabled={isDeleteGoalLoading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={handleDeleteGoal}
              >
                {isDeleteGoalLoading ? (
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
                      Deleting...
                    </div>
                  </>
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

      {/* MODAL TO EDIT GOAL */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onclose={closeEditModal}>
          <form onSubmit={handleEditGoal}>
            <h1 className="font-bold text-black text-xl py-2">Edit Goal</h1>

            <label className="text-black text-sm py-2" htmlFor="title">
              Goal Title:
            </label>
            <input
              name="title"
              className="border text-black border-black w-full p-1.5 rounded-md my-2"
              type="text"
              defaultValue={editGoal.title}
              required
            />

            <div className="flex items-baseline gap-4">
              <div className="flex flex-col">
                <label className="text-black text-sm py-2" htmlFor="description">
                  Description:
                </label>
                <input
                  name="description"
                  className="border text-black border-black w-[260px] p-1.5 h-32 rounded-md my-2"
                  type="text"
                  defaultValue={editGoal.description}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black text-sm py-1" htmlFor="priority">
                  Priority:
                </label>
                <select
                  name="priority"
                  className="border text-black border-black w-[130px] p-1 rounded-md my-1"
                  defaultValue={editGoal.priority}
                  required
                >
                  <option value="High">HIGH</option>
                  <option value="Mid">MID</option>
                  <option value="Low">LOW</option>
                </select>
              </div>
            </div>

            <label className="text-black text-sm py-1" htmlFor="deadline">
              Deadline:
            </label>
            <input
              name="deadline"
              className="border text-black border-black w-full p-1.5 rounded-md my-2"
              type="date"
              defaultValue={editGoal.deadline}
              required
            />
            <button disabled={isEditGoalLoading} className="w-full bg-blue-500 text-white rounded-md mt-3 py-2">
              {isEditGoalLoading ? (
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
                    Editting...
                  </div>
                </>
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
