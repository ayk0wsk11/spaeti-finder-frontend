import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { setIsOnProfile } = useContext(AuthContext);

  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
  }, []);

  const handleSignupSubmit = (event) => {
    event.preventDefault();

    const image = event.target.image.files[0];
    const myFormData = new FormData();
    myFormData.append("image", image); //myFormData is like an object {imageUrl: image}
    myFormData.append("username", username);
    myFormData.append("email", email);
    myFormData.append("password", password);

    axios
      .post(`${API_URL}/auth/signup`, myFormData)
      .then((res) => {
        nav("/login");
      })
      .catch((err) => console.log("error while creating new user", err));
  };

  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignupSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="name"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <label>User Image:</label>
        <input type="file" name="image" />

        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
};
export default SignupPage;
