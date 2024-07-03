import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  SearchOutlined,
  LoginOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import "./Navbar.css";

const Navbar = () => {
  const { handleLogout, currentUser } = useContext(AuthContext);

  return (
    <nav id="navbar">
      <Link to="/">
        <h3 id="app-icon">Spätify</h3>
      </Link>
      <div id="navbar-right">
        <Link to="/spaeti/list">
          <SearchOutlined />
        </Link>
        <Link to="/about">
          <InfoCircleOutlined />
        </Link>
        {currentUser ? (
          <Link to="/profile">
            <UserOutlined />
          </Link>
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
