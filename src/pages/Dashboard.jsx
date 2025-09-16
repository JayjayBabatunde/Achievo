import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/landingPageComponents/Sidebar";
import DashboardNav from "../components/overviewComponents/DashboardNav";
import { ThemeContext } from "../components/overviewComponents/ThemeContext";
import { Outlet } from "react-router-dom";
import AiBot from "../components/goalsComponent/AiBot";
import { Plus } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const { theme } = useContext(ThemeContext);

    // PROTECTED ROUTE
    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) navigate("/login");
    }, [navigate]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1040) setIsOpen(false);
            else setIsOpen(true);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handlePlusClick = () => {
        // if already on /goals, use state to open modal
        if (location.pathname === "/dashboard/goals") {
            navigate("/dashboard/goals", { state: { openModal: true } });
        } else {
            navigate("/dashboard/goals", { state: { openModal: true } });
        }
    };

    const hideOnAvaAssistant = location.pathname === "/dashboard/Ava-assistant";

    return (
        <div className={` ${theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"} w-full flex transition-all duration-500 ease-in-out min-h-screen relative`}>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? "ml-[210px]" : "ml-0 sm:ml-[80px]"} w-full relative`}>
                <DashboardNav />
                <div className="rounded-md p-2">
                    <Outlet />
                </div>

                {/* Floating Plus Button - always visible */}
                {!hideOnAvaAssistant && (
                    <div className="fixed bottom-20 right-6 z-50">
                        <div
                            onClick={handlePlusClick}
                            className="rounded-full bg-blue-600 w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition"
                        >
                            <Plus size={25} color="white" />
                        </div>
                    </div>
                )}

                {/* AiBot - hidden on Ava Assistant page */}
                {!hideOnAvaAssistant && <AiBot />}
            </div>
        </div>
    );
}
