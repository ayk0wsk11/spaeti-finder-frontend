import { createContext, useEffect, useState } from "react";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthContextWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nav = useNavigate();

  function storeToken(token) {
    localStorage.setItem("authToken", token);
  }

  const authenticateUser = async () => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    try {
      const { data } = await axios.get(`${API_URL}/auth/verify`, {
        headers: { authorization: `Bearer ${tokenFromLocalStorage}` },
      });
      console.log("response from verify ", data);
      setCurrentUser(data.user);
      setIsLoading(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.log("error authenticating user", error);
      setCurrentUser(null);
      setIsLoading(false);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    nav("/login");
    setCurrentUser(null);
    console.log("user was logged out successfully");
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        storeToken,
        handleLogout,
        currentUser,
        isLoading,
        isLoggedIn,
        authenticateUser,
      }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthContextWrapper };
