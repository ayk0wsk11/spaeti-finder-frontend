// src/components/Navbar/Navbar.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import "./Navbar.css";

const Navbar = ({ onBurgerClick }) => {
  const { handleLogout, currentUser, isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

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
