import { useState } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "./ThemeContext";



export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        const updatedTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(updatedTheme);
    }
    return <ThemeContext.Provider value={{ theme, toggleTheme }}> {children} </ThemeContext.Provider>
    
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
}