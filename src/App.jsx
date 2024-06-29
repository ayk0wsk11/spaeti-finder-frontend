import "./App.css";
import { Routes, Route } from "react-router-dom";

//***************** COMPONENTS ****************/
import Navbar from "./components/Navbar/Navbar";

//***************** PAGES *****************/
import Homepage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignUpPage/SignUpPage";
import SpaetiCreatePage from "./pages/SpaetiCreatePage/SpaetiCreatePage";
import SpaetiDetailsPage from "./pages/SpaetiDetailsPage/SpaetiDetailsPage";
import SpaetiEditPage from "./pages/SpaetiEditPage/SpaetiEditPage";
import SpaetiListPage from "./pages/SpaetiListPage/SpaetiListPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div id="spa">
      <Navbar />
      <div id="main">
        <Sidebar sidebarClosed={false} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/spaeti/create" element={<SpaetiCreatePage />} />
          <Route
            path="/spaeti/details/:spaetiId"
            element={<SpaetiDetailsPage />}
          />
          <Route path="/spaeti/edit/:spaetiId" element={<SpaetiEditPage />} />
          <Route path="/spaeti/list" element={<SpaetiListPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
