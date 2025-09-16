import { Moon, Sun, Menu, X, LayoutDashboard, NotepadText, BarChart, Users, Settings, LogOut, Plus, Bell, Search } from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import '../../App.css';
import { ThemeContext } from "./ThemeContext";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Loader from "../goalsComponent/Loader";

export default function DashboardNav({ onSearch }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [photoURL, setPhotoURL] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const navLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Overview', path: '/dashboard' },
    { icon: <NotepadText size={20} />, name: 'Goals', path: '/dashboard/goals' },
    { icon: <BarChart size={20} />, name: 'Track Goals', path: '/dashboard/analytics' },
    { icon: <Users size={20} />, name: 'Communities', path: '/dashboard/communities' },
    { icon: <Settings size={20} />, name: 'Settings', path: '/dashboard/settings' },
    { icon: <span className="text-xl">🤖</span>, name: "AI Assistant", path: "/dashboard/Ava-assistant" },
  ];

  useEffect(() => {
    let unsubscribeSnapshot = () => { };

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setPhotoURL(userData.photoURL || user.photoURL);
          } else {
            setPhotoURL(user.photoURL);
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Error with snapshot listener:", error);
          setIsLoading(false);
        });
      } else {
        navigate("/login");
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, [navigate]);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }

    if (showSearch) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const handleLogout = () => auth.signOut().then(() => navigate("/login"));
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) onSearch(term);
  };

  if (isLoading) return <div className="flex justify-center items-center overflow-hidden"><Loader /></div>;

  return (
    <>
      {/* Top Navbar */}
      <div className={`w-full fixed top-0 left-0 z-10 ${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/80'} backdrop-blur shadow-sm p-1 border-gray-200 dark:border-gray-800`}>
        <div className="max-w-full px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            {/* Brand + Mobile Menu */}
            <div className="flex items-center gap-3">
              <span className="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer" onClick={toggleSidebar}>
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <button className="relative inline-flex items-center justify-center h-8 w-8 dark:border-gray-700 " onClick={() => setShowSearch(prev => !prev)}>
                <Search size={18} />
              </button>
              <button className="inline-flex items-center justify-center h-8 w-8 dark:border-gray-700  transition" onClick={toggleTheme}>
                {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="inline-flex items-center justify-center h-8 w-8 dark:border-gray-700">
                <Bell size={18} />
              </button>
              <img
                className="sm:w-8 sm:h-8 w-7 h-7 rounded-full object-cover bg-gray-300 ring-1 ring-gray-300 dark:ring-gray-700"
                src={photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                alt="Profile img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay - Moved outside and increased z-index */}
      {showSearch && (
        <div className="fixed inset-0 flex justify-center items-start bg-black/30" style={{ zIndex: 9999 }}>
          <div
            ref={searchRef}
            className="relative mt-20 sm:mt-28 md:mt-32 px-4 w-full flex justify-center"
          >
            <div className="relative w-full max-w-[90%] sm:max-w-[400px] md:max-w-[600px]">
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={handleSearch}
                autoFocus
                className={`p-3 pr-12 rounded-md shadow-lg w-full
             ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
              />
              <X
                size={22}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-red-500"
                onClick={() => setShowSearch(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Links for Mobile Screens */}
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-30 sm:hidden ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleSidebar}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 h-full w-[82%] max-w-xs ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
            } shadow-xl transform transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="p-4 pt-6 flex items-center justify-between border-b dark:border-gray-300">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600" />
              <span className="font-semibold">Achievo</span>
            </div>
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:text-gray-400"
              onClick={toggleSidebar}
            >
              <X size={18} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col h-[93vh] justify-between">
            {/* Nav Links */}
            <ul className="flex flex-col p-4 gap-6 mt-6">
              {navLinks.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition cursor-pointer"
                  onClick={() => {
                    navigate(link.path);
                    setIsSidebarOpen(false);
                  }}
                >
                  {link.icon}
                  <span className="text-sm font-medium">{link.name}</span>
                </li>
              ))}
            </ul>

            {/* Bottom Actions */}
            <div className="flex flex-col p-4 gap-4 mb-6">
              <button className="flex items-center gap-2 px-3 py-3 rounded-md text-white bg-purple-500 hover:bg-purple-600 transition">
                <Plus size={18} />
                <span className="text-sm font-medium">Add Goal</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-start gap-2 px-3 py-3 rounded-lg text-red-600 hover:bg-purple-200 transition"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}