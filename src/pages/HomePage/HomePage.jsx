import Alert from "../../components/AlertComponent/AlertComponent";
import SpatiMap from "../../components/SpatiMap/SpatiMap";
import { AuthContext } from "../../context/auth.context";
import { useContext, useEffect, useState } from "react";

const HomePage = () => {
  const { setIsOnProfile } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setIsOnProfile(false);
    triggerAlert("Spätify is not finished yet. We are still working on features and design");
  }, []);

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  return (
    <div>
      {showAlert && <Alert message={alertMessage} onClose={closeAlert}/>}
      <SpatiMap />
    </div>
  );
};
export default HomePage;
