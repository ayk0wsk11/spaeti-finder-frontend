// src/components/Navbar/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import "./Navbar.css";

const Navbar = ({ onBurgerClick }) => {
  const { handleLogout, currentUser, isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.setAttribute("data-theme", shouldUseDark ? "dark" : "light");
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    const themeValue = newTheme ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", themeValue);
    localStorage.setItem("theme", themeValue);
  };

  // true, wenn wir gerade auf /profile sind
  const onProfilePage = location.pathname === "/profile";

  return (
    <nav id="navbar">
      <div id="burger-btn-div">
        <button
          id="burger-button"
          onClick={onBurgerClick}
          aria-label="Toggle sidebar"
        >
          <MenuOutlined style={{ fontSize: 24, color: "white" }} />
        </button>
      </div>

      <div id="middle-div">
        <Link to="/" id="app-icon-link">
          <h3 id="app-icon">Spätify</h3>
        </Link>
      </div>

      <div id="navbar-right">
        {/* Theme toggle button */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <SunOutlined style={{ fontSize: 20, color: "white" }} />
          ) : (
            <MoonOutlined style={{ fontSize: 20, color: "white" }} />
          )}
        </button>

        {!currentUser && !isLoggedIn &&(
          <Link to="/login" aria-label="Login">
            <LoginOutlined style={{ fontSize: 20, color: "white" }} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
