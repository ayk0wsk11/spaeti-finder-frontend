import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Avatar, Card } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import { API_URL } from "../../config";
import "./UserProfilePage.css";

const tabList = [
  {
    key: "ratings",
    label: "ratings",
  },
  {
    key: "likes",
    label: "likes",
  },
];

const contentList = {
  ratings: <p>ratings content</p>,
  likes: <p>likes content</p>,
};

const UserProfilePage = () => {
  const { currentUser, setIsOnProfile } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState("ratings");

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  function getCreationDate() {
    const date = user.createdAt.split("T")[0].split("-");
    return date[1] + "/" + date[0];
  }

  useEffect(() => {
    setIsOnProfile(true);
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/users/${currentUser._id}`);
        setUser(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/ratings`);
        const allRatings = data.data.filter(
          (r) => r.user._id === currentUser._id
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchRatings();
  }, []);

  if (!user) return;

  return (
    <div id="user-profile-page">
      <Card>
        <div id="user-profile">
          <Avatar size={64} icon={<UserOutlined />} />
          <div id="user-infos">
            <h3>{user.username}</h3>
            <div>joined {getCreationDate()}</div>
          </div>
        </div>
      </Card>
      <div id="user-activity">
        <Card
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={onTabChange}
          tabProps={{
            size: "middle",
          }}
        >
          {contentList[activeTabKey]}
        </Card>
      </div>
    </div>
  );
};
export default UserProfilePage;
