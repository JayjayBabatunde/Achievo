import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Overview() {
  const [completedGoals, setCompletedGoals] = useState(0);
  const [incompleteGoals, setIncompleteGoals] = useState(0);
  const [deletedGoals, setDeletedGoals] = useState(0);

  useEffect(() => {
    const fetchGoals = async () => {
      const goalsCollection = collection(db, "goals");
      const goalsSnapshot = await getDocs(goalsCollection);
      const goalsData = goalsSnapshot.docs.map((doc) => doc.data());

      const completed = goalsData.filter((goal) => goal.completed).length;
      const incomplete = goalsData.filter((goal) => !goal.completed).length;
      const deleted = parseInt(localStorage.getItem("deletedGoals")) || 0;

      setCompletedGoals(completed);
      setIncompleteGoals(incomplete);
      setDeletedGoals(deleted);
    };

    fetchGoals();

    const unsubscribe = onSnapshot(collection(db, "goals"), (snapshot) => {
      const goalsData = snapshot.docs.map((doc) => doc.data());

      const completed = goalsData.filter((goal) => goal.completed).length;
      const incomplete = goalsData.filter((goal) => !goal.completed).length;

      setCompletedGoals(completed);
      setIncompleteGoals(incomplete);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-2xl">Overview</h1>
      <div className="pt-3 sm:pl-5 sm:pr-2 py-4 grid sm:grid-cols-4 grid-cols-2 items-center sm:gap-7 gap-2">
        <div className="bg-blue-200 font-sans p-3.5 rounded-md">
          <p className="text-blue-900 sm:text-[16px] text-sm font-semibold">Total Goals</p>
          <span className="text-blue-900 sm:text-4xl text-[30px] font-bold">{completedGoals + incompleteGoals}</span>
        </div>
        <div className="bg-green-200 font-sans p-3.5 rounded-md">
          <p className="text-green-900 sm:text-[16px] text-sm font-semibold">Completed Goals</p>
          <span className="text-green-900 sm:text-4xl text-[30px] font-bold">{completedGoals}</span>
        </div>
        <div className="bg-red-200 font-sans p-3.5 rounded-md" style={{ background: 'hsl(30, 100%, 90%)' }}>
          <p className="sm:text-[16px] text-sm font-semibold" style={{ color: 'hsl(30, 100%, 50%)' }}>Incomplete Goals</p>
          <span className="sm:text-4xl text-[30px] font-bold" style={{ color: 'hsl(30, 100%, 50%)' }}>{incompleteGoals}</span>
        </div>
        <div className="bg-red-200 font-sans p-3.5 rounded-md">
          <p className="text-red-900 sm:text-[16px] text-sm font-semibold">Deleted Goals</p>
          <span className="text-red-900 sm:text-4xl text-[30px] font-bold">{deletedGoals}</span>
        </div>
      </div>
    </div>
  );
}

Overview.propTypes = {
  goals: PropTypes.array.isRequired,
};