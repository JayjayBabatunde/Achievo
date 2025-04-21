import { Calendar, Dot, Edit, Trash2 } from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react";
import Modal from "../goalsComponent/Modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleGoalCompletion } from "../../assets/store/goalSlice";

export default function OverviewGoals({ goals = [], setGoals }) {
  const dispatch = useDispatch();
  const CompletedGoals = useSelector((state) => state.goals.goals);
  const completedGoalsCount = CompletedGoals.filter(goal => goal.completed).length;

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [DeleteGoal, setDeleteGoal] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(null);
  const [editGoal, setEditGoal] = useState(null);

  const openEditModal = (goal) => {
    setEditGoal(goal);
    setEditModalOpen(true);
  }

  const closeEditModal = () => {
    setEditGoal(null);
    setEditModalOpen(false);
  }
  const openDeleteModal = (goal) => {
    setDeleteGoal(goal);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteGoal(null);
    setDeleteModalOpen(false);
  }

  const handleEditGoal = (e) => {
    e.preventDefault();
    const form = e.target;
    const updateGoal = {
      ...editGoal,
      priority: form.priority.value,
      title: form.title.value,
      description: form.description.value,
      deadline: form.deadline.value,
    };
    const updateGoals = goals.map((goal) =>
      goal === editGoal ? updateGoal : goal);
    setGoals(updateGoals);
    localStorage.setItem("goals", JSON.stringify(updateGoals));
    closeEditModal();
  }

  const handleDeleteGoal = () => {
    const updateGoals = goals.filter((goal) => goal !== DeleteGoal);
    setGoals(updateGoals);
    localStorage.setItem("goals", JSON.stringify(updateGoals));
    closeDeleteModal();
  }

  const handleCompleteGoal = (goalId) => {
    dispatch(toggleGoalCompletion(goalId));
  }

  return (


    <div className="font-sans m-2 grid grid-cols-4 ps-3 gap-5 w-full justify-start pe-4">
      <h2 className="col-span-4 font-bold text-xl mb-4">Completed Goals: {completedGoalsCount}</h2>
      {goals.map((goal, index) => (

        <div key={index} className={`border  w-full rounded-md p-3 ${goal.completed ? 'opacity-50 line-through' : ''}`}>
          <div className="flex items-center p-0 m-0">
            <span>
              <Dot size={70} className={`${goal.priority === 'High' ? 'text-red-500' : goal.priority === 'MID' ? 'text-green-500' : goal.priority === 'Low' ? 'text-orange-500' : 'text-black'}`} />
            </span>
            <span className={`${goal.priority === 'High' ? 'text-red-500 font-semibold uppercase' : goal.priority === 'MID' ? 'text-green-500 font-semibold uppercase' : goal.priority === 'Low' ? 'text-orange-500 font-semibold uppercase' : 'text-black'}`}
            >{goal.priority}</span>
          </div>

          <div className="ps-4 flex flex-col gap-2">
            <span className="font-semibold text-[18px]">{goal.title}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold"><Calendar size={20} /></span>
              <span className="font-semibold text-gray-500 text-[13px]">Due {new Date(goal.deadline).toDateString()}</span>
            </div>

            <span className="font-normal text-gray-700 text-[14px]">{goal.description}</span>

            <div className="flex justify-between items-center">
              <input type="checkbox" checked={goal.completed}
                onChange={() => handleCompleteGoal(goal.id)}
                className="transform scale-200" />

              <div className="flex items-center gap-2">
                <Edit onClick={() => openEditModal(goal)} style={{ width: '17px' }} />
                <Trash2 className="text-red-500 cursor-pointer" style={{ width: '17px' }} onClick={() => openDeleteModal(goal)} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 py-9 px-5 rounded-md">
            <h2 className="text-xl font-bold text-red-500">Are you sure you want to delete this goal?</h2>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={handleDeleteGoal}
              >
                Yes
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
                  id="priority"
                  className="border text-black border-black w-[130px] p-1 rounded-md my-1"
                  defaultValue={editGoal.priority}
                  required
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MID">MID</option>
                  <option value="LOW">LOW</option>
                </select>

                <label className="text-black text-sm py-1" htmlFor="deadline">
                  Deadline:
                </label>
                <input
                  name="deadline"
                  className="border border-black w-[130px] p-1.5 text-black rounded-md my-1"
                  type="date"
                  defaultValue={editGoal.deadline}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Save Changes
              </button>

              <button
                type="button"
                onClick={closeEditModal}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Exit
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>

  )
}

OverviewGoals.propTypes = {
  goals: PropTypes.array.isRequired,
  setGoals: PropTypes.func.isRequired,
}
