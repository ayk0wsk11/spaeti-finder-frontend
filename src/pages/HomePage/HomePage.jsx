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
    triggerAlert("Spätify is not finished yet. We are still working on features and design. If you want to test the webpage without creating an account, ask us for credentials to login.");
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
      <div id="alert-message">
      {showAlert && <Alert message={alertMessage} onClose={closeAlert}/>}
      </div>
      <SpatiMap />
    </div>
  );
};
export default HomePage;
