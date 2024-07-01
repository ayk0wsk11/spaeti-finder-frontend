import { API_URL } from "../../config";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";

const RatingCard = () => {
  const { spaetiId } = useParams();
  const [ratings, setRatings] = useState([]);
  const [likeCounter, setLikeCounter] = useState(null);
  const [dislikeCounter, setDislikeCounter] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/ratings`);
        setRatings(data.data);
        console.log(data.data);
        console.log("current user", currentUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRatings();
  }, []);

  const handleLike = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ratings/${id}`);
      console.log("Response inside Rating Card from get request:", response);

      if (response.data && response.data.data) {
        const data = response.data.data;

        if (Array.isArray(data.likes)) {
          if (!data.likes.includes(currentUser._id)) {
            const addLike = await axios.put(`${API_URL}/ratings/like/${id}`, {
              user: currentUser._id,
            });
            const totalLikes = data.likes.length + 1;
            setLikeCounter(totalLikes);
            console.log("Total likes (after increment):", totalLikes);
          } else {
            console.log("User ID already liked this post");
          }
        } else {
          console.error("data.likes is not an array:", data.likes);
        }
      } else {
        console.error("response.data or response.data.data is undefined");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDislike = () => {
    console.log("DISLIKE");
  };

  return (
    <div key={spaetiId}>
      {ratings.map((oneRating) => {
        if (oneRating.spaeti === spaetiId)
          return (
            <div key={oneRating._id}>
              <h4> Comment: {oneRating.comment} </h4>
              <h4>Stars: {oneRating.stars}</h4>
              <h4>User: {oneRating.user.username}</h4>
              <h4>Created: {oneRating.date}</h4>
              <div>
                <LikeOutlined onClick={() => handleLike(oneRating._id)} />
                  <h4>{likeCounter}</h4>
                <DislikeOutlined onClick={handleDislike} />
              </div>
            </div>
          );
      })}
    </div>
  );
};
export default RatingCard;
