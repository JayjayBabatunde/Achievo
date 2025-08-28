import { useState } from "react"
import { CATEGORY_MAP } from "../CategoryList"
import { Plus, Users } from "lucide-react";

export default function Communities() {
    const [active, setActive] = useState('All');

    const communities = [
        {
            id: 1,
            image: '/image.jpg',
            name: 'Jumpstart Resolutions',
            description: 'Join fellow Goal setters',
            members: '80+ members',
        },
        {
            id: 2,
            image: '/mindful-morning.jpg',
            name: 'Mindful Mornings',
            description: 'Daily meditation & habit tracking',
            members: '120+ members',
        },
        {
            id: 3,
            image: '/fitness.jpg',
            name: 'FitLife Warriors',
            description: '30-day fitness challenges & accountability',
            members: '250+ members',
        },
        {
            id: 4,
            image: '/gdsc.png',
            name: 'Google Developers Student Club LCU',
            description: 'Join a community of fellow developers',
            members: '200+ members',
        },
        {
            id: 5,
            image: '/savings.jpg',
            name: 'Savings Squad',
            description: 'Financial goals & budgeting support',
            members: '90+ members',
        },
        {
            id: 6,
            image: '/cofee.jpg',
            name: 'Code & Coffee',
            description: 'Learn coding together: 100 days of code',
            members: '300+ members',
        }
    ]

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-[95%] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-6 sm:gap-8 justify-between items-center w-full text-center p-3 rounded-md mb-6 sm:mb-8 mt-10 sm:mt-16 lg:mt-20">
                <div className="flex flex-col items-center w-full gap-3 sm:gap-4">
                    <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl px-2">Community Hub</h1>
                    <p className="text-sm sm:text-base lg:text-lg px-4 sm:px-8 lg:px-16 max-w-4xl">
                        Discover and join communities that align with your goals and interests. Connect with like-minded individuals and grow together.
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:gap-5 w-full justify-center items-center">
                    {/* Search Input */}
                    <input
                        className="rounded-md text-black border w-full sm:w-[80%] lg:w-[60%] xl:w-[50%] p-2 sm:p-3 text-sm sm:text-base"
                        type="search"
                        placeholder="Search community..."
                    />

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center max-w-full">
                        <button
                            className={`border border-gray-200 rounded-md px-3 py-2 hover:bg-blue-500 hover:text-white transition-all duration-150 whitespace-nowrap text-sm sm:text-base ${active === 'All' ? 'bg-blue-500 text-white' : ''}`}
                            onClick={() => setActive('All')}
                        >
                            All
                        </button>
                        {Object.keys(CATEGORY_MAP).map((category) => (
                            <button
                                key={category}
                                value={category}
                                className={`border border-gray-200 rounded-md px-3 py-2 hover:bg-blue-500 hover:text-white transition-all duration-150 whitespace-nowrap text-sm sm:text-base max-w-[140px] overflow-hidden text-ellipsis ${active === category ? 'bg-blue-500 text-white' : ''}`}
                                onClick={() => setActive(category)}
                                title={category}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pb-8 sm:pb-12">
                {communities.map((community, index) => (
                    <div key={index} className="w-full">
                        <div className="border rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                            <img
                                className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-t-lg sm:rounded-t-xl"
                                src={community.image}
                                alt={community.name}
                            />
                            <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-grow">
                                <h3 className="font-bold text-base sm:text-lg line-clamp-2">{community.name}</h3>
                                <span className="text-sm sm:text-[16px] text-gray-500 font-semibold flex items-center gap-1">
                                    <Users size={14} className="sm:w-4 sm:h-4" />
                                    {community.members}
                                </span>
                                <p className="text-sm sm:text-[16px] text-gray-500 line-clamp-2 flex-grow">{community.description}</p>
                                <button className="bg-purple-700 hover:bg-purple-600 transition-all duration-150 rounded-md w-full p-2 sm:p-3 text-white flex items-center justify-center gap-2 mt-2 text-sm sm:text-base font-medium">
                                    <Plus size={16} className="sm:w-5 sm:h-5" />
                                    Join Community
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}