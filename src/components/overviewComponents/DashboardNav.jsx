import { Moon, Sun, Menu, X, LayoutDashboard, NotepadText, BarChart, Users, Settings, LogOut, Plus } from "lucide-react"; // Import Menu and X icons
import { useContext, useEffect, useState } from "react";
import '../../App.css';
import { ThemeContext } from "./ThemeContext";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../goalsComponent/Loader";

export default function DashboardNav() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [userName, setUserName] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  const navLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Overview', path: '/dashboard' },
    { icon: <NotepadText size={20} />, name: 'Goals', path: '/dashboard/goals' },
    { icon: <BarChart size={20} />, name: 'Track Goals', path: '/dashboard/track-goals' },
    { icon: <Users size={20} />, name: 'Communities', path: '/dashboard/communities' },
    { icon: <Settings size={20} />, name: 'Settings', path: '/dashboard/settings' },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
        } else {
          console.log("No such document!");
        }
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <Loader />
      </div>

    )
  }

  return (
    <>
      <div className={`w-full p-4`}>
        <div className="flex items-center justify-between sm:justify-end">

          <div className="flex items-center gap-2">
            <span className="cursor-pointer" onClick={toggleTheme}>
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </span>
            <img className="sm:w-8 sm:h-8 w-5 h-5 rounded-full" src="/profile.jpg" alt="Profile img" />
            <span className="font-semibold sm:text-[16px] text-sm font-sans">{userName || "Loading..."}</span>
          </div>

          <span className="cursor-pointer sm:hidden z-50" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </span>
        </div>

      </div>



      {/* Sidebar Links for Mobile Screens */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-[100%] p-10 h-full bg-white shadow-lg z-40 sm:hidden">
          <ul className="flex flex-col p-4 gap-10">
            {navLinks.map((link, index) => (
              <li
                key={index}
                className="flex items-center gap-2 cursor-pointer hover:bg-blue-500 hover:text-white p-2 rounded-sm"
                onClick={() => {
                  navigate(link.path);
                  setIsSidebarOpen(false);
                }}
              >
                {link.icon}
                <span>{link.name}</span>
              </li>
            ))}


            <div className={`flex items-center bg-blue-500 p-1.5 rounded-sm text-white cursor-pointer gap-2`} >
              <Plus size={20} />
              <span>Add Goal</span>
            </div>

            <div onClick={handleLogout}
              className={`flex items-center hover:bg-red-500 hover:text-white text-red-500 p-1.5 rounded-sm cursor-pointer gap-2`} >
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </ul>
        </div>

      )}

    </>
  );
}