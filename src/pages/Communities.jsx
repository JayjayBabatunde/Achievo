export default function Communities() {

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
        <div>
            <div className="flex justify-between items-center border p-3 rounded-md mb-3 h-max">
                <h1 className="font-bold text-xl">Join a Commmunity</h1>

                <input className="rounded-md text-black border w-[450px] p-2" type="search" placeholder="search community" />
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 mt-4 gap-4">
                {communities.map((community, index) => (
                    <div key={index}>
                        <div className="border rounded-md">
                            <img className="w-full h-40 object-cover rounded-md" src={community.image} alt="image" />
                            <div className="p-3 flex flex-col gap-2">
                                <h3 className="font-bold text-[17px]">{community.name}</h3>
                                <p className="text-[14px]">{community.description}</p>
                                <div className="flex justify-between my-2 items-center">
                                    <span className="text-[14px] text-gray-600 font-semibold">{community.members}</span>
                                    <button className="bg-blue-500 rounded-md w-[140px] px-3 py-1 text-white">Join</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
