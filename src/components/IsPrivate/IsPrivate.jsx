import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";

const IsPrivate = ({ children }) => {
  const { isLoading, isLoggedIn } = useContext(AuthContext);

  if (isLoading) {
    return;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return <div>{children}</div>;
};

export default IsPrivate;
