import SpatiMap from "../../components/SpatiMap/SpatiMap";
import { AuthContext } from "../../context/auth.context";
import { useContext, useEffect } from "react";

const Homepage = () => {
  const { setIsOnProfile } = useContext(AuthContext);

  useEffect(() => {
    setIsOnProfile(false);
  }, []);

  return (
    <div>
      <SpatiMap />
    </div>
  );
};
export default Homepage;
