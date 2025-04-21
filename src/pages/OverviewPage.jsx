import { useContext, useEffect, useState } from "react";
import GoalHeader from "../components/overviewComponents/GoalHeader";
import Overview from "../components/overviewComponents/Overview";
import OverviewGoals from "../components/overviewComponents/OverviewGoals";
import { Link } from "react-router-dom";
import { ThemeContext } from "../components/overviewComponents/ThemeContext";
export default function OverviewPage() {
  const [goals, setGoals] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    setGoals(savedGoals ? JSON.parse(savedGoals) : []);
  }, []);


  return (
    <div>
      <Overview goals={goals} />
      <GoalHeader />
      <OverviewGoals goals={goals.slice(0, 8)} setGoals={setGoals} />
      <div className="flex justify-center items-center mt-4">
        <button
          className={`hover:bg-blue-600 transition duration-200 px-2.5 py-1.5 rounded-sm text-center ${theme === "light" ? "text-black" : "text-white"
            }`}
        >
          <Link to="/dashboard/goals">See more...</Link>
        </button>
      </div>
    </div>


  );
}
