import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const { setIsOnProfile } = useContext(AuthContext);

  useEffect(() => {
    setIsOnProfile(false);
  }, []);
  return (
    <div className="not-found-container">
      <div className="not-found-background">
        <img
          src="https://i.ebayimg.com/images/g/tecAAOSwCuBcczLj/s-l1200.webp"
          alt="The Shire"
          className="background-image"
        />
      </div>
      <div className="not-found-content">
        <h1 className="not-found-title">404 - Lost in the Shire</h1>
        <p className="not-found-description">
          It seems you've taken a wrong turn on your journey. The path you seek
          is hidden, but fear not! Return to the safety of the Shire.
        </p>
        <div className="not-found-buttons">
          <Link to="/" className="button-home">
            {" "}
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
