import "./App.css";
import { Routes, Route } from "react-router-dom";

//***************** COMPONENTS ****************/
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

//***************** PAGES *****************/
import Homepage from "./pages/Homepage/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SpaetiCreatePage from "./pages/SpaetiCreatePage";
import SpaetiDetailsPage from "./pages/SpaetiDetailsPage";
import SpaetiEditPage from "./pages/SpaetiEditPage";
import SpaetiListPage from "./pages/SpaetiListPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
    <Navbar/>
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
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
