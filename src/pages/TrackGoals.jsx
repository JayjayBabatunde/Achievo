
import { useState } from 'react';
import DonutChart from '../components/goalsComponent/DonutChart';

const data = [
    { id: 'Completed', value: 9 },
    { id: 'Incomplete', value: 5 },
    { id: 'Deleted', value: 3 },

];


export default function TrackGoals() {
    const [activeBtn, setActiveBtn] = useState(null);

    const toggleActive = (index) => {
        setActiveBtn(index);
    }

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className='border rounded-md w-full h-16 flex items-center justify-between px-36'>
                {['Bar chart', 'Pie chart', 'Line chart'].map((item, index) => (
                    <button
                        key={index}
                        onClick={() => toggleActive(index)}
                        className={`border text-black hover:text-white hover:bg-blue-500 hover:border-none rounded-md px-4 py-1.5 ${activeBtn === index ? 'bg-blue-500 text-white' : 'bg-none'}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <DonutChart data={data} />
        </div>
    )
}
