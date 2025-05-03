import { ArrowLeft, ArrowRight, BarChart, LayoutDashboard, LogOut, NotepadText, Plus, Settings, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const navLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Overview', path: '/dashboard' },
    { icon: <NotepadText size={20} />, name: 'Goals', path: '/dashboard/goals' },
    { icon: <BarChart size={20} />, name: 'Track Goals', path: '/dashboard/track-goals' },
    { icon: <Users size={20} />, name: 'Communities', path: '/dashboard/communities' },
    { icon: <Settings size={20} />, name: 'Settings', path: '/dashboard/settings' },
  ];


  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside
      className={`
        ${isOpen ? 'w-[210px]' : 'w-0 sm:w-[80px]'} 
        h-screen fixed overflow-hidden transition-all duration-500 ease-in-out border-r shadow-sm`}
    >
      <nav className="h-full flex flex-col justify-between">
        <div>
          <div className="p-4 pb-2 flex justify-start items-center">
            <button
              className="p-1.5 rounded-lg mx-2.5 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </button>
          </div>

          <ul className="flex flex-col px-3 py-6 gap-3.5 items-center">
            {navLinks.map((link, index) => (
              <li
                key={index}
                className={`flex items-center hover:bg-blue-500 hover:text-white ${isOpen ? 'w-36 pe-3 justify-start' : 'w-10 justify-center'
                  } p-1.5 rounded-sm cursor-pointer transition-all ease-out gap-2 font-sans text-[15px]`}
                onClick={() => navigate(link.path)}
              >
                {link.icon}
                {isOpen && <span>{link.name}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 p-3 mb-6 items-center">
          <div
            className={`flex items-center ${isOpen ? 'w-36 pe-3 justify-start' : 'w-10 justify-center'
              } bg-blue-500 p-1.5 rounded-sm text-white cursor-pointer gap-2`}
          >
            <Plus size={20} />
            {isOpen && <span>Add Goal</span>}
          </div>

          <div
            onClick={handleLogout}
            className={`flex items-center ${isOpen ? 'w-36 pe-3 justify-start' : 'w-10 justify-center'
              } hover:bg-red-500 hover:text-white text-red-500 p-1.5 rounded-sm cursor-pointer gap-2`}
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </div>
        </div>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

