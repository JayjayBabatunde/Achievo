import { Plus } from "lucide-react";
import Modal from "../components/goalsComponent/Modal";
import OverviewGoals from "../components/overviewComponents/OverviewGoals";
import { useEffect, useState } from "react";

export default function Goals() {
  const [isModalOpen, SetModalOpen] = useState(false);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    setGoals(savedGoals ? JSON.parse(savedGoals) : []);
  }, []);

  const openModal = () => SetModalOpen(true);
  const closeModal = () => SetModalOpen(false);

  const handleAddGoal = (e) => {
    e.preventDefault();
    const form = e.target;
    const newGoal = {
      priority: form.priority.value,
      title: form.title.value,
      description: form.description.value,
      deadline: form.deadline.value,
      completed: false,
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
    closeModal();
  }




  return (
    <div className="">
      <div className="flex items-center justify-between px-5">
        <h1
          className="font-bold text-2xl cursor-pointer"
        >
          Add New Goal
        </h1>

        <button
          onClick={openModal}
          className="bg-blue-500 p-2 flex items-center justify-center gap-1 text-white rounded-sm font-semibold"
        >
          <Plus size={20} /> Add Goal
        </button>
      </div>

      <div>
        <Modal isOpen={isModalOpen} onclose={closeModal}>
          <form onSubmit={handleAddGoal}>
            <h1 className="font-bold text-black text-xl py-2">Add New Goal</h1>

            <label className="text-black text-sm py-2" htmlFor="title">Goal Title:</label>
            <input className="border text-black border-black w-full p-1.5 rounded-md my-2"
              name='title'
              required
              type="text" />

            <div className="flex items-baseline gap-4">
              <div className="flex flex-col">
                <label className="text-black text-sm py-2" htmlFor="title">Description:</label>
                <input className="border text-start text-black border-black w-[260px] p-1.5 h-32 rounded-md my-2"
                  name="description"
                  type="text" required />
              </div>

              <div className="flex flex-col">
                <label className="text-black text-sm py-1" htmlFor="title">Priority:</label>
                <select name="priority" id="priority" className="border text-black border-black w-[130px] p-1 rounded-md my-1">
                  <option value="High">HIGH</option>
                  <option value="Mid">MID</option>
                  <option value="Low">LOW</option>
                </select>

                <label className="text-black text-sm py-1" htmlFor="title">Deadline:</label>
                <input className="border border-black w-[130px] p-1.5 text-black rounded-md my-1"
                  name="deadline"
                  type="date" required />
              </div>
            </div>



            <div className="flex items-center gap-3">
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Add
              </button>

              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Exit
              </button>
            </div>
          </form>
        </Modal>
      </div>

      <div>
        <OverviewGoals goals={goals} setGoals={setGoals} />
      </div>

    </div>
  );
}
