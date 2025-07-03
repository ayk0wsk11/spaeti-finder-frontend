// src/pages/UserProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Card,
  Modal,
  Row,
  Col,
  Button,
  Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import { API_URL } from "../../config";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import avatar1 from "../../assets/avatar1.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";
import avatar5 from "../../assets/avatar5.png";
import "./UserProfilePage.css";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

const tabList = [
  { key: "ratings", label: "Ratings" },
  { key: "likes",   label: "Likes"   },
];

const UserProfilePage = () => {
  const {
    currentUser,
    authenticateUser,
    setIsOnProfile,
  } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState("ratings");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setIsOnProfile(true);
  }, [setIsOnProfile]);

  // fetch user + ratings
  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        const [{ data: userData }, { data: ratingsData }] = await Promise.all([
          axios.get(`${API_URL}/users/${currentUser._id}`),
          axios.get(`${API_URL}/ratings/user/${currentUser._id}`),
        ]);
        setUser(userData.data);
        setUserRatings(ratingsData.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentUser]);

  const getCreationDate = () => {
    if (!user?.createdAt) return "";
    return new Date(user.createdAt).toLocaleDateString();
  };

  const onTabChange = (key) => setActiveTabKey(key);

  // update profile image on select
  const handleAvatarSelect = async (imgUrl) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/users/update/${currentUser._id}`,
        { image: imgUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // refresh auth & local data
      await authenticateUser();
      const { data } = await axios.get(`${API_URL}/users/${currentUser._id}`);
      setUser(data.data);
      setModalVisible(false);
    } catch (err) {
      console.error("Error updating avatar:", err);
    }
  };

  if (!user) {
    return (
      <div className="loading">
        <Spin size="large" />
      </div>
    );
  }

  const renderStars = (n) =>
    "★".repeat(n) + "☆".repeat(5 - n);

  const contentList = {
    ratings: (
      <div className="activity-list">
        {userRatings.length > 0 ? (
          userRatings.map((r) => (
            <div className="one-rating" key={r._id}>
              <Link to={`/spaeti/details/${r.spaeti._id}`}>
                <h3>{r.spaeti.name}</h3>
              </Link>
              {r.comment && <p>{r.comment}</p>}
              <h4>Rating: {renderStars(r.stars)}</h4>
            </div>
          ))
        ) : (
          <p>No ratings found.</p>
        )}
      </div>
    ),
    likes: <p>Likes content</p>,
  };

  return (
    <div id="user-profile-page">
      <BackButton to="/">Zurück zur Startseite</BackButton>
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar
            size={80}
            src={user.image}
            icon={<UserOutlined />}
          />
          <Button
            type="link"
            className="change-image-btn"
            onClick={() => setModalVisible(true)}
          >
            Change image
          </Button>
        </div>
        <div className="user-infos">
          <h2>{user.username}</h2>
          <p>Joined {getCreationDate()}</p>
        </div>
      </Card>

      <div className="user-activity">
        <Card
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={onTabChange}
          tabProps={{ size: "middle" }}
        >
          {contentList[activeTabKey]}
        </Card>
      </div>

      <Modal
        title="Choose Your Avatar"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Row gutter={[16, 16]}>
          {avatars.map((img, idx) => (
            <Col key={idx} span={8} className="avatar-choice">
              <Avatar
                size={64}
                src={img}
                onClick={() => handleAvatarSelect(img)}
                className="avatar-option"
              />
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default UserProfilePage;
