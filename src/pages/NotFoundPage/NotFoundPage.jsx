import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth.context";

const NotFoundPage = () => {
  const { setIsOnProfile } = useContext(AuthContext);

  useEffect(() => {
    setIsOnProfile(false);
  }, []);

  return <div>NotFoundPage</div>;
};
export default NotFoundPage;
