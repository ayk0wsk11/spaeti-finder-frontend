import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

//***************** CONTEXT ****************/
import { SpaetiProvider } from "./context/spaeti.context";

//***************** COMPONENTS ****************/
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsApproved from "./components/IsApproved/IsApproved";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";

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
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ChangeRequestForm from "./components/ChangeRequestForm/ChangeRequestForm";
import FavoritenPage from "./pages/FavoritenPage/FavoritenPage";
import TopRatedPage from "./pages/TopRatedPage/TopRatedPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <SpaetiProvider>
      <div id="spa">
        <Navbar onBurgerClick={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div id="main" className={sidebarOpen ? "sidebar-open" : ""}>
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
          <Route path="/top-rated" element={<TopRatedPage />} />
          <Route
            path="/profile"
            element={
              <IsPrivate>
                <UserProfilePage />
              </IsPrivate>
            }
          />
          <Route
            path="/spaeti/change-request/:spaetiId"
            element={
              <IsPrivate>
                <ChangeRequestForm />
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
          <Route
            path="/admin"
            element={
              <IsApproved>
                <AdminDashboard />
              </IsApproved>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/favorites"
            element={
              <IsPrivate>
                <FavoritenPage />
              </IsPrivate>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
    </SpaetiProvider>
  );
}

export default App;
