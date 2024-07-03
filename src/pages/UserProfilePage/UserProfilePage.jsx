import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import { API_URL } from "../../config";

const UserProfilePage = () => {
  const { handleLogout, currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/users/${currentUser._id}`);
        console.log("fetch", data.data);
        setUser(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpaetis();
  }, []);

  return (
    <div id="user-profile-page">
      <div id="user-infos">
        <Avatar size={64} icon={<UserOutlined />} />
        <Link to="/" onClick={handleLogout}>
          <LogoutOutlined id="logout-button" />
        </Link>
      </div>
      <div id="user-ratungs"></div>
    </div>
  );
};
export default UserProfilePage;
