import { API_URL } from "../../config";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LikeOutlined } from "@ant-design/icons";
import CreateRatingComp from "../../components/CreateRating/CreateRatingComp";
import { AuthContext } from "../../context/auth.context";
import "./RatingCard.css";
import { Rate } from "antd";

const RatingCard = ({ onNewRating }) => {
  const { spaetiId } = useParams();
  const [ratings, setRatings] = useState([]);
  const [likes, setLikes] = useState({});
  const { currentUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(null);
  const [editStars, setEditStars] = useState(0);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/spaetis/ratings/${spaetiId}`
        );
        setRatings(data.rating);

        const initialLikes = data.rating.reduce((acc, rating) => {
          acc[rating._id] = rating.likes.length;
          return acc;
        }, {});

        setLikes(initialLikes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRatings();
  }, [spaetiId, onNewRating]);

  const handleLike = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ratings/${id}`);
      const data = response.data.data;
      if (!data.likes.includes(currentUser._id)) {
        await axios.put(`${API_URL}/ratings/add-like/${id}`, {
          user: currentUser._id,
        });
        setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      } else {
        await axios.put(`${API_URL}/ratings/remove-like/${id}`, {
          user: currentUser._id,
        });
        setLikes((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (id) => {
    await axios.delete(`${API_URL}/ratings/delete/${id}`);
    setRatings(ratings.filter((e) => e._id !== id));
  };

  const getCreationDate = (date) => date.split("T")[0];

  const handleEdit = (rating) => {
    setEditMode(rating._id);
    setEditStars(rating.stars);
    setEditComment(rating.comment);
  };

  const handleUpdate = async (id) => {
    try {
      const updatedRating = {
        stars: editStars,
        comment: editComment,
        user: currentUser,
        spaeti: spaetiId,
      };
      await axios.put(`${API_URL}/ratings/update/${id}`, updatedRating);
      setRatings((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, stars: editStars, comment: editComment } : r
        )
      );
      setEditMode(null);
    } catch (error) {
      console.log(error);
    }
  };

  const renderStars = (stars) =>
    "★".repeat(stars) + "☆".repeat(5 - stars);

  return (
    <div id="rating-container">
      <div id="create-container">
        {currentUser && <CreateRatingComp onNewRating={onNewRating} />}
      </div>
      {ratings.map((oneRating) => {
        if (oneRating.spaeti !== spaetiId) return null;
        return (
          <div key={oneRating._id} id="rating">
            {/* edit/delete buttons */}
            {currentUser &&
            (currentUser._id === oneRating.user._id ||
              currentUser.admin) ? (
              <div id="rc-btn">
                <button
                  id="r-c-dlt-btn"
                  onClick={() => handleDeleteComment(oneRating._id)}
                >
                  Delete
                </button>
                <button
                  id="r-c-edt-btn"
                  onClick={() => handleEdit(oneRating)}
                >
                  Edit
                </button>
              </div>
            ) : null}

            {/* edit mode */}
            {editMode === oneRating._id ? (
              <>
                <input
                  type="text"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                />
                <Rate
                  value={editStars}
                  onChange={(value) => setEditStars(value)}
                />
                <button onClick={() => handleUpdate(oneRating._id)}>
                  Update
                </button>
              </>
            ) : (
              <>
                <div id="rating-content">
                  <div id="rating-top-row">
                    <div id="rating-left">
                      <h4>User: {oneRating.user.username}</h4>
                      <h4>Rating: {renderStars(oneRating.stars)}</h4>
                    </div>
                    {currentUser && (
                      <div id="likes">
                        <LikeOutlined
                          onClick={() => handleLike(oneRating._id)}
                        />
                        <span id="likes-num">{likes[oneRating._id]}</span>
                      </div>
                    )}
                  </div>
                  <h4>Created: {getCreationDate(oneRating.date)}</h4>
                </div>

                {/* only show non-empty comments */}
                {oneRating.comment?.trim() && (
                  <div id="rating-comment">
                    <h4>Comment:</h4>
                    <p>{oneRating.comment}</p>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RatingCard;
