import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { AuthContext, AuthContextWrapper } from "../../context/auth.context";
import { useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isList = location.pathname === "/spaeti/list";
  const onProfile = location.pathname === "/profile";

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          X
        </button>
        <div className="nav-container">
          <div className="nav-section">
            <ul>
              {!isHomePage && (
                <li>
                  <Link to="/" onClick={onClose}>
                    Go to Map
                  </Link>
                </li>
              )}
              {!isList && (
                <li>
                  <Link to="/spaeti/list" onClick={onClose}>
                    Späti list
                  </Link>
                </li>
              )}
              <li>
                <Link to="/top-rated" onClick={onClose}>
                  Top 10 rated spätis
                </Link>
              </li>
              <li>
                <Link to="/favourites" onClick={onClose}>
                  Favourite Spätis
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <ul>
              {currentUser?.admin && (
                <>
                  <li>
                    <Link to="/admin" onClick={onClose}>
                      Admin-Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/approval" onClick={onClose}>
                      Approval Page
                    </Link>
                  </li>
                </>
              )}
              {!onProfile && isLoggedIn && (
                <li>
                  <Link to="/profile" onClick={onClose}>
                    Profile
                  </Link>
                </li>
              )}
              <li>
                <Link to="/settings" onClick={onClose}>
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
