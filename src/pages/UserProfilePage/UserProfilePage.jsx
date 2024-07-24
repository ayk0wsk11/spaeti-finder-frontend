import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Avatar, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import { API_URL } from "../../config";
import "./UserProfilePage.css";
import { Link } from "react-router-dom";

const tabList = [
  {
    key: "ratings",
    label: "Ratings",
  },
  {
    key: "likes",
    label: "Likes",
  },
];

const UserProfilePage = () => {
  const { currentUser, setIsOnProfile } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState("ratings");

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  function getCreationDate() {
    if (!user || !user.createdAt) return "";
    const date = new Date(user.createdAt).toLocaleDateString();
    return date;
  }

  useEffect(() => {
    setIsOnProfile(true);

    const fetchUserAndRatings = async () => {
      try {
        // Fetch user details
        const { data: userData } = await axios.get(
          `${API_URL}/users/${currentUser._id}`
        );
        setUser(userData.data);

        // Fetch user ratings
        const { data: ratingsData } = await axios.get(
          `${API_URL}/ratings/user/${currentUser._id}`
        );
        setUserRatings(ratingsData.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserAndRatings();
  }, [currentUser._id, setIsOnProfile]);

  if (!user) return <div>Loading...</div>;

  const renderStars = (stars) => {
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  const contentList = {
    ratings: (
      <div>
        {userRatings.length > 0 ? (
          userRatings.map((rating) => (
            <div id="oneRating" key={rating._id}>
              <Link to={`/spaeti/details/${rating.spaeti._id}`}>
                <h3>{rating.spaeti.name}</h3>
              </Link>
              <p style={{ fontWeight: "400" }}>
                {" "}
                <span style={{ fontWeight: "bolder" }}>Comment:</span>
                <br />
                {rating.comment}
              </p>
              <h4>Rating: {renderStars(rating.stars)}</h4>
            </div>
          ))
        ) : (
          <p>No ratings found.</p>
        )}
      </div>
    ),
    likes: <p>Likes content</p>, // Placeholder for likes content
  };

  return (
    <div id="user-profile-page">
      <Card>
        <div id="user-profile">
          <Avatar size={64} icon={<UserOutlined />} />
          <div id="user-infos">
            <h3>{user.username}</h3>
            <div>Joined {getCreationDate()}</div>
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
