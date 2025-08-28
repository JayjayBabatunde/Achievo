import { useState } from "react";
import { Dot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
    const slides = [
        {
            id: 1,
            image: "/logo.png",
            title: "Welcome to Achievo",
            subtitle: "Your Journey to Achievement Starts Here",
            description: "Transform your goals into achievements with our comprehensive goal-tracking platform designed for success."
        },
        {
            id: 2,
            image: "/goal.jpg",
            title: "Set Goals",
            subtitle: "Turn Dreams into Actionable Plans",
            description: "Create SMART goals, break them into manageable tasks, and track your progress effortlessly."
        },
        {
            id: 3,
            image: "/reminders.jpg",
            title: "Get Reminders",
            subtitle: "Stay Consistent",
            description: "Receive timely notifications and reminders to keep you on track with your goals."
        },
        {
            id: 4,
            image: "/communities.jpg",
            title: "Join Communities",
            subtitle: "Achieve More Together",
            description: "Connect with like-minded people, share your progress, and get motivated."
        },
        {
            id: 5,
            image: "/Robot.jpg",
            title: "AI Assistant",
            subtitle: "Your Personal Goal Coach",
            description: "Get AI-powered insights, suggestions, and support to achieve your goals faster."
        },
        {
            id: 6,
            image: "/insight.jpg",
            title: "Daily Streaks & Rewards",
            subtitle: "Celebrate Consistency",
            description: "Earn rewards, track streaks, and stay motivated as you hit milestones."
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const skip = () => {
        navigate('/dashboard')
    };

    const current = slides[currentSlide];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:w-[80%] h-[100vh] w-[95%] mx-auto items-center">
            {/* Left Image */}
            <div className="flex justify-center md:me-4 me-">
                <img
                    src={current.image}
                    alt={current.title}
                    className="w-[500px] md:h-[500px] h-[300px] object-contain"
                />
            </div>

            {/* Right Content */}
            <div className="md:text-left text-center">
                <div className="flex flex-col md:gap-7 gap-4">
                    <h3 className="text-3xl font-semibold">{current.title}</h3>
                    <h1 className="md:text-5xl text-3xl font-bold">{current.subtitle}</h1>
                    <p className="text-lg">{current.description}</p>
                </div>

                {/* Dots Indicator */}
                <div className="flex gap-1 items-center justify-center pt-6">
                    {slides.map((_, index) => (
                        <Dot
                            key={index}
                            size={30}
                            className={index === currentSlide ? "text-[#fc4c00]" : "text-gray-400"}
                        />
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between py-6 ">
                    <div className="flex gap-3">
                        <button
                            onClick={prevSlide}
                            className="border-2 border-[#fc4c00] text-black px-3 py-1 rounded-md"
                        >
                            Prev
                        </button>
                        {currentSlide === slides.length - 1 ? (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="bg-[#fc4c00] text-white px-3 py-1 rounded-md"
                            >
                                Get Started
                            </button>
                        ) : (
                            <button
                                onClick={nextSlide}
                                className="bg-[#fc4c00] text-white px-3 py-1 rounded-md"
                            >
                                Next
                            </button>
                        )}
                    </div>
                    <button
                        onClick={skip}
                        className="bg-gray-300 text-black px-3 py-1 rounded-md"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
}


// the sliders should be welcome, set goals, get reminders, join communities, ai assistant  and daily streaks and rewards 