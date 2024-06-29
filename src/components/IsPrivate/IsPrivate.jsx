import { useContext} from "react";
import { AuthContext } from "../../context/auth.context";


const IsPrivate = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  console.log("currentUser in Private", currentUser);

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  if (currentUser.admin === false) {
    return <div> Nothing here</div>;
  } else {
    return <div>{children}</div>;
  }
};
export default IsPrivate;
