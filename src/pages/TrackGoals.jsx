import { useEffect, useState } from 'react';
import PieChartData from '../components/goalsComponent/Piechart';
import DonughtChart from '../components/goalsComponent/DonughtChart';
import BarChart from '../components/goalsComponent/Barchart';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../components/firebase/firebase";

export default function TrackGoals() {
    const [activeBtn, setActiveBtn] = useState(0);
    const [goals, setGoals] = useState({ completed: 0, incomplete: 0 });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "goals"), (snapshot) => {
            const goalsData = snapshot.docs.map((doc) => doc.data());

            const completed = goalsData.filter((goal) => goal.completed).length;
            const incomplete = goalsData.filter((goal) => !goal.completed).length;

            setGoals({ completed, incomplete });
        });

        return () => unsubscribe();
    }, []);

    const toggleActive = (index) => {
        setActiveBtn(index);
    };
    const deletedGoals = parseInt(localStorage.getItem("deletedGoals")) || 0;

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className="md:border rounded-md w-full h-16 grid sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-2 items-center justify-between md:px-28 sm:px-0 sm:text-[16px] text-[12px]">
                {['Pie chart', 'Donught chart', 'Bar chart'].map((item, index) => (
                    <button
                        key={index}
                        onClick={() => toggleActive(index)}
                        className={`border text-black hover:text-white hover:bg-blue-500 hover:border-none rounded-md px-4 py-1.5 ${activeBtn === index ? 'bg-blue-500 text-white' : 'bg-none'
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
                    deletedGoals={deletedGoals}
                />}

                {activeBtn === 1 && <DonughtChart
                    completedGoals={goals.completed}
                    incompleteGoals={goals.incomplete}
                    deletedGoals={deletedGoals}
                />}
                {activeBtn === 2 && <BarChart
                    completedGoals={goals.completed}
                    incompleteGoals={goals.incomplete}
                    deletedGoals={deletedGoals}
                />}
            </div>
        </div>
    );
}