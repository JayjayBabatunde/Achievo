import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Overview() {
  const [completedGoals, setCompletedGoals] = useState(0);
  const [incompleteGoals, setIncompleteGoals] = useState(0);
  const [deletedGoals, setDeletedGoals] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userGoalsRef = collection(db, "users", currentUser.uid, "goals");
        const q = query(userGoalsRef);

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const goalsData = snapshot.docs.map((doc) => doc.data());

          const completed = goalsData.filter((goal) => goal.completed && !goal.deleted).length;
          const incomplete = goalsData.filter((goal) => !goal.completed && !goal.deleted).length;
          const deleted = goalsData.filter((goal) => goal.deleted).length;

          setCompletedGoals(completed);
          setIncompleteGoals(incomplete);
          setDeletedGoals(deleted);
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-2xl">Overview</h1>
      <div className="pt-3 sm:pl-5 sm:pr-2 py-4 grid sm:grid-cols-4 grid-cols-2 items-center sm:gap-7 gap-2">
        <div className="bg-blue-200 font-sans p-3.5 rounded-md">
          <p className="text-blue-900 sm:text-[16px] text-sm font-semibold">Total Goals</p>
          <span className="text-blue-900 sm:text-4xl text-[30px] font-bold">
            {completedGoals + incompleteGoals}
          </span>
        </div>
        <div className="bg-green-200 font-sans p-3.5 rounded-md">
          <p className="text-green-900 sm:text-[16px] text-sm font-semibold">Completed Goals</p>
          <span className="text-green-900 sm:text-4xl text-[30px] font-bold">
            {completedGoals}
          </span>
        </div>
        <div className="bg-orange-200 font-sans p-3.5 rounded-md">
          <p className="text-orange-600 sm:text-[16px] text-sm font-semibold">Incomplete Goals</p>
          <span className="text-orange-600 sm:text-4xl text-[30px] font-bold">
            {incompleteGoals}
          </span>
        </div>
        <div className="bg-red-100 font-sans p-3.5 rounded-md">
          <p className="text-red-700 sm:text-[16px] text-sm font-semibold">Deleted Goals</p>
          <span className="text-red-700 sm:text-4xl text-[30px] font-bold">
            {deletedGoals}
          </span>
        </div>
      </div>
    </div>
  );
}
