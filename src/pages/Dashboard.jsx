import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/landingPageComponents/Sidebar";
import DashboardNav from "../components/overviewComponents/DashboardNav";
import { ThemeContext } from "../components/overviewComponents/ThemeContext";
import { Outlet } from 'react-router-dom';


export default function Dashboard() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div
            className={`
                ${theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"}
                w-full flex transition-all duration-500 ease-in-out min-h-screen
            `}
        >

            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />


            <div
                className={`
                    transition-all duration-500 ease-in-out 
                    ${isOpen ? "ml-[210px]" : "ml-0 sm:ml-[80px]"} 
                    md:ps-6 md:pe-6 px-3 w-full
                `}
            >

                <DashboardNav />
                <div className="rounded-md p-2">
                    <Outlet />

                </div>
            </div>
        </div>
    );
}
