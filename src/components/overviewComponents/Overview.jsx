import PropTypes from "prop-types";

export default function Overview({ goals = [] }) {
  const totalGoals = goals.length;

  return (
    <div>
      <h1 className="font-bold text-2xl">Overview</h1>
      <div className="pt-3 pl-5 pr-2 py-4 flex flex-col md:flex-row items-center gap-7">
        <div className="bg-blue-200 font-sans p-3.5 rounded-md w-full md:w-2/6">
          <p className="text-blue-900 text-[16px] font-semibold">Total Goals</p>
          <span className="text-blue-900 text-4xl font-bold">{totalGoals}</span>
        </div>
        <div className="bg-green-200 font-sans p-3.5 rounded-md w-full md:w-2/6">
          <p className="text-green-900 text-[16px] font-semibold">Completed Goals</p>
          <span className="text-green-900 text-4xl font-bold">0</span>
        </div>
        <div className="bg-red-200 font-sans p-3.5 rounded-md w-full md:w-2/6">
          <p className="text-red-900 text-[16px] font-semibold">Deleted Goals</p>
          <span className="text-red-900 text-4xl font-bold">0</span>
        </div>
      </div>

    </div>
  );
}

Overview.propTypes = {
  goals: PropTypes.array.isRequired,
};