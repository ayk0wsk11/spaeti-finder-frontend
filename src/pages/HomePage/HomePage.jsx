import SpatiMap from "../../components/SpatiMap/SpatiMap";
import { AuthContext } from "../../context/auth.context";
import { useContext, useEffect } from "react";

const HomePage = () => {
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
export default HomePage;
