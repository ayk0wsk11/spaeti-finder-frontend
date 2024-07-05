import { AuthContext } from "../../context/auth.context";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const { setIsOnProfile } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
  }, []);
  return (
    <div>
      <h1>About Us</h1>
      <h2>
        Welcome to Spätify! <br />
        We are two web developers working on an exciting project called
        "Spätify." Our web app aims to help Berlin residents and visitors easily
        find and rate Spätis, the beloved late-night convenience stores unique
        to the city. With Spätify, users can discover the best Spätis based on
        community reviews, ensuring they always find the perfect spot for their
        late-night needs.
      </h2>
      <h2>Our Github:</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>
          <a href="https://github.com/ayk0wsk11" target="_blank">
            Ayko
            <img
              src="https://cdn.worldvectorlogo.com/logos/github-icon-2.svg"
              alt="Github"
              width="20"
              height="20"
            />
          </a>
        </li>
        <li>
          <a href="https://github.com/Senfjo" target="_blank">
            Jonathan
            <img
              src="https://cdn.worldvectorlogo.com/logos/github-icon-2.svg"
              alt="Github"
              width="20"
              height="20"
            />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AboutPage;
