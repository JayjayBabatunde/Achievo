import { useEffect, useState } from 'react';
import PieChartData from '../components/goalsComponent/Piechart';
import DonughtChart from '../components/goalsComponent/DonughtChart';
import BarChart from '../components/goalsComponent/Barchart';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/firebase/firebase";
import Loader from '../components/goalsComponent/Loader';

export default function TrackGoals() {
    const [activeBtn, setActiveBtn] = useState(0);
    const [goals, setGoals] = useState({ completed: 0, incomplete: 0, deleted: 0 });
    const [isLoading, setIsLoading] = useState(true); // State to track loading

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userGoalsRef = collection(db, "users", currentUser.uid, "goals");
                const unsubscribe = onSnapshot(userGoalsRef, (snapshot) => {
                    const goalsData = snapshot.docs.map((doc) => doc.data());

                    const completed = goalsData.filter((goal) => goal.completed).length;
                    const incomplete = goalsData.filter((goal) => !goal.completed && !goal.deleted).length; // Exclude deleted goals from incomplete count
                    const deleted = goalsData.filter((goal) => goal.deleted).length;

                    setGoals({ completed, incomplete, deleted });
                    setIsLoading(false);
                });

                return () => unsubscribe();
            } else {
                setIsLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const toggleActive = (index) => {
        setActiveBtn(index);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className="md:border rounded-md w-full h-16 grid sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-2 items-center justify-between md:px-28 sm:px-0 sm:text-[16px] text-[12px]">
                {['Pie chart', 'Donught chart', 'Bar chart'].map((item, index) => (
                    <button
                        key={index}
                        onClick={() => toggleActive(index)}
                        className={`border hover:text-white hover:bg-teal-500 hover:border-none rounded-md px-4 py-1.5 ${activeBtn === index ? 'bg-teal-500 text-white' : 'bg-none'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="mt-10 md:w-[80%] lg:w-[80%] w-full h-auto">
                {activeBtn === 0 && <PieChartData
                    completedGoals={goals.completed}
                    incompleteGoals={goals.incomplete}
                    deletedGoals={goals.deleted}
                />}

                {activeBtn === 1 && <DonughtChart
                    completedGoals={goals.completed}
                    incompleteGoals={goals.incomplete}
                    deletedGoals={goals.deleted}
                />}
                {activeBtn === 2 && <BarChart
                    completedGoals={goals.completed}
                    incompleteGoals={goals.incomplete}
                    deletedGoals={goals.deleted}
                />}
            </div>
        </div>
    );
}