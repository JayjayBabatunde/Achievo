import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage on initial load
        return localStorage.getItem("app-theme") || "light";
    });

    const toggleTheme = () => {
        const updatedTheme = theme === "light" ? "dark" : "light";
        setTheme(updatedTheme);
        localStorage.setItem("app-theme", updatedTheme);
    };

    // Optional: Keep localStorage in sync if theme changes elsewhere
    useEffect(() => {
        localStorage.setItem("app-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
