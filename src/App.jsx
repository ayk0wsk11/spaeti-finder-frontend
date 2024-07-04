import "./App.css";
import { Routes, Route } from "react-router-dom";

//***************** COMPONENTS ****************/
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsApproved from "./components/IsApproved/IsApproved";

//***************** PAGES *****************/
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignUpPage/SignUpPage";
import SpaetiCreatePage from "./pages/SpaetiCreatePage/SpaetiCreatePage";
import SpaetiDetailsPage from "./pages/SpaetiDetailsPage/SpaetiDetailsPage";
import SpaetiEditPage from "./pages/SpaetiEditPage/SpaetiEditPage";
import SpaetiListPage from "./pages/SpaetiListPage/SpaetiListPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ApprovalPage from "./pages/ApprovalPage/ApprovalPage";
import AboutPage from "./pages/AboutPage/AboutPage";

function App() {
  return (
    <div id="spa">
      <Navbar />
      <div id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/spaeti/create"
            element={
              <IsPrivate>
                <SpaetiCreatePage />
              </IsPrivate>
            }
          />
          <Route
            path="/spaeti/details/:spaetiId"
            element={<SpaetiDetailsPage />}
          />
          <Route
            path="/spaeti/edit/:spaetiId"
            element={
              <IsPrivate>
                <SpaetiEditPage />
              </IsPrivate>
            }
          />
          <Route path="/spaeti/list" element={<SpaetiListPage />} />
          <Route
            path="/profile"
            element={
              <IsPrivate>
                <UserProfilePage />
              </IsPrivate>
            }
          />
          <Route
            path="/approval"
            element={
              <IsApproved>
                <ApprovalPage />
              </IsApproved>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/about" element={<AboutPage/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
