import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  SearchOutlined,
  LoginOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
  UserOutlined,
  MenuOutlined, // <-- import burger icon
} from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import "./Navbar.css";

const Navbar = ({ onBurgerClick }) => {
  const { handleLogout, currentUser, isOnProfile } = useContext(AuthContext);

  return (
    <nav id="navbar">
      <div id="burger-btn-div">
        <button
          id="burger-button"
          onClick={onBurgerClick}
          aria-label="Toggle sidebar"
        >
          <MenuOutlined style={{ fontSize: "24px", color: "white" }} />
        </button>
      </div>
      <div id="middle-div">
        <Link to="/" id="app-icon-link">
          <h3 id="app-icon">Spätify</h3>
        </Link>
      </div>

      <div id="navbar-right">
        {currentUser ? (
          isOnProfile ? (
            <Link to="/" onClick={handleLogout}>
              <LogoutOutlined id="logout-button"/>
            </Link>
          ) : (
            <Link to="/profile">
              <UserOutlined />
            </Link>
          )
        ) : (
          <Link to="/login">
            <LoginOutlined id="login-button" />
          </Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
