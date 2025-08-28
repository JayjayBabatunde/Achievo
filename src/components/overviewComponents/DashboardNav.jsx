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
      <div className={`w-full p-4 py-5 shadow-sm fixed top-0 left-0 z-10 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
        <div className="flex items-center justify-between sm:justify-end pe-4">
          <div className="flex items-center gap-5">
            {/* Search toggle */}
            <div className="relative">
              <Search size={18} className="cursor-pointer" onClick={() => setShowSearch(prev => !prev)} />
            </div>

            {/* Theme toggle */}
            <span className="cursor-pointer" onClick={toggleTheme}>
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </span>

            {/* Notifications */}
            <Bell size={18} className="cursor-pointer" />

            {/* Profile */}
            <img
              className="sm:w-7 sm:h-7 w-5 h-5 rounded-full object-cover bg-gray-300 cursor-pointer"
              src={photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
              alt="Profile img"
            />
          </div>

          {/* Mobile sidebar toggle */}
          <span className="cursor-pointer sm:hidden z-50" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </span>
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
      {isSidebarOpen && (
        <div className={`fixed top-0 left-0 w-[100%] p-10 h-full shadow-lg z-40 sm:hidden ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
          <ul className="flex flex-col p-4 gap-10">
            {navLinks.map((link, index) => (
              <li key={index} className="flex items-center gap-2 cursor-pointer hover:bg-blue-500 p-2 rounded-sm"
                onClick={() => { navigate(link.path); setIsSidebarOpen(false); }}>
                {link.icon}<span>{link.name}</span>
              </li>
            ))}

            <div className="flex items-center bg-blue-500 p-1.5 rounded-sm text-white cursor-pointer gap-2">
              <Plus size={20} /><span>Add Goal</span>
            </div>

            <div onClick={handleLogout} className="flex items-center hover:bg-red-500 hover:text-white text-red-500 p-1.5 rounded-sm cursor-pointer gap-2">
              <LogOut size={20} /><span>Logout</span>
            </div>
          </ul>
        </div>
      )}
    </>
  );
}