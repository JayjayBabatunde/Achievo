import { useContext, useEffect, useState } from "react";
import GoalHeader from "../components/overviewComponents/GoalHeader";
import Overview from "../components/overviewComponents/Overview";
import OverviewGoals from "../components/overviewComponents/OverviewGoals";
import { Link } from "react-router-dom";
import { ThemeContext } from "../components/overviewComponents/ThemeContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../components/firebase/firebase";

export default function OverviewPage() {
  const [goals, setGoals] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "goals"), (snapshot) => {
      const goalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsData);
    });

    return () => unsubscribe(); // clean up listener on unmount
  }, []);

  return (
    <div className={`${theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"} min-h-screen`}>
      <Overview goals={goals} />
      <GoalHeader />
      <OverviewGoals goals={goals.slice(0, 8)} setGoals={setGoals} />
      <div className="flex justify-center items-center mt-4">
        <button
          className={`hover:bg-blue-600 transition duration-200 px-2.5 py-1.5 rounded-sm text-center ${theme === "light" ? "text-black" : "text-white"}`}
        >
          <Link to="/dashboard/goals">See more...</Link>
        </button>
      </div>
    </div>
  );
}
