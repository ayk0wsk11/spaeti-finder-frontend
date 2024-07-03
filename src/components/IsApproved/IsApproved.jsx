import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link } from "react-router-dom";

const IsApproved = ({ children }) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (currentUser.admin) {
    return <div>{children}</div>;
  } else {
    return <div><h2>No access to this page!</h2>
    <Link to="/">Return to Home</Link>
    </div>
  }
};
export default IsApproved;
