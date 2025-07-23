// import { useState } from 'react';
// import { Menu, X } from 'lucide-react'; // For hamburger icon
import { Link } from 'react-router-dom';

export default function Nav() {
  // const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle

  return (
    <nav className="p-6 ps-6 lg:ps-28 flex items-center justify-between pe-6 lg:pe-28">

      <div>
        <h1 className="text-2xl font-sans font-bold text-white">
          Achievo
        </h1>
      </div>


      {/* <button
        className="lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button> */}

      {/* <ul
        className={`flex-col lg:flex-row lg:flex items-center gap-5 ${isOpen ? 'flex bg-white shadow-lg h-screen z-10' : 'hidden'
          } absolute lg:static top-16 left-0 w-full lg:w-auto p-6 lg:p-0 transition-all`}
      >
        <li className="text-black font-normal font-sans text-[16px] p-2 cursor-pointer hover:text-[#148359]">
          Home
        </li>
        <li className="text-black font-normal font-sans text-[16px] p-2 cursor-pointer hover:text-[#148359]">
          Features
        </li>
        <li className="text-black font-normal font-sans text-[16px] p-2 cursor-pointer hover:text-[#148359]">
          About
        </li>
        <li className="text-black font-normal font-sans text-[16px] p-2 cursor-pointer hover:text-[#148359]">
          Contact
        </li> */}


      {/* Buttons */}
      <div className="flex gap-4">
        {/* <button className="text-black p-2 transition ease-in-out hover:text-teal-700">
          <Link to='/login'>Login</Link>
        </button> */}
        <button className="w-[90px] h-10 border-white border-2 flex justify-center text-white rounded-full hover:bg-white hover:text-[#0061ff] transition ease-in-out">
          <Link to='/signup' className='flex items-center justify-center'>Signup</Link>
        </button>
      </div>
      {/* </ul> */}
    </nav>
  );
}

