import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import { API_URL } from "../../config";

const UserProfilePage = () => {
  const { currentUser, setIsOnProfile } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  function getCreationDate() {
    const date = user.createdAt.split("T")[0].split("-");
    return date[1] + "/" + date[0];
  }

  useEffect(() => {
    setIsOnProfile(true);
    const fetchSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/users/${currentUser._id}`);
        setUser(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpaetis();
  }, []);

  if (!user) return;

  return (
    <div id="user-profile-page">
      <div id="user-infos">
        <Avatar size={64} icon={<UserOutlined />} />
        <div>{user.username}</div>
        <div>{user.xp}</div>
        <div>joined {getCreationDate()}</div>
      </div>
      <div id="user-ratings"></div>
    </div>
  );
};
export default UserProfilePage;
