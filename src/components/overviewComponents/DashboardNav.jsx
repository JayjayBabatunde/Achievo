import { Moon, Sun } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import '../../App.css'
import { ThemeContext } from "./ThemeContext";

export default function DashboardNav() {
      const { theme, toggleTheme } = useContext(ThemeContext);
    const [userName, setUserName] = useState();
  

    useEffect(() => {
        const storedName = localStorage.getItem('userData');
        if(storedName) {
            const user = JSON.parse(storedName); // Parse the data
            setUserName(user.name); // Set the name
        }
    }, [])
  return (
    <>

    <div className={`w-full p-4`}>
        <div className='flex items-center justify-end gap-2'>
            <span className="cursor-pointer" onClick={toggleTheme}>
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </span>
            <img className="w-8 h-8 rounded-full" src='/profile.jpg'  alt='Profile img' />
            <span className="font-semibold text-[16px] font-sans">{userName}</span>
        </div>
    </div>
    </>
  )
}
