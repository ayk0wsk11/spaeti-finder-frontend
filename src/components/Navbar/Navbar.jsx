import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import "./Navbar.css";

const Navbar = () => {
  const { handleLogout, currentUser } = useContext(AuthContext);

  return (
    <nav id="navbar">
      <div>sidebar-icon</div>
      <Link to="/">
        <div>lieber späti als nie</div>
      </Link>
      {currentUser ? (
        <button id="logout-button" onClick={handleLogout}>
          logout
        </button>
      ) : (
        <Link to="/login">
          <button id="login-button">login</button>
        </Link>
      )}
    </nav>
  );
};
export default Navbar;
