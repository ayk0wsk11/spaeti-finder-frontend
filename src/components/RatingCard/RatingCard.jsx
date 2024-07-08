import { API_URL } from "../../config";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LikeOutlined } from "@ant-design/icons";
import CreateRatingComp from "../../components/CreateRating/CreateRatingComp";
import { AuthContext } from "../../context/auth.context";
import "./RatingCard.css";
import { Rate } from "antd";

const RatingCard = () => {
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
  }, [spaetiId]);

  const handleLike = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ratings/${id}`);

      if (!(response.data && response.data.data))
        throw "response.data or response.data.data is undefined";
      const data = response.data.data;

      if (!data.likes.includes(currentUser._id)) {
        const addLike = await axios.put(`${API_URL}/ratings/add-like/${id}`, {
          user: currentUser._id,
        });

        setLikes((prevLikes) => ({
          ...prevLikes,
          [id]: prevLikes[id] + 1,
        }));
      } else {
        const removeLike = await axios.put(
          `${API_URL}/ratings/remove-like/${id}`,
          {
            user: currentUser._id,
          }
        );
        setLikes((prevLikes) => ({
          ...prevLikes,
          [id]: prevLikes[id] - 1,
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteComment = async (id) => {
    const deleteComment = await axios.delete(`${API_URL}/ratings/delete/${id}`);
    setRatings(ratings.filter((e) => e._id !== id));
  };

  function getCreationDate(date) {
    const newDate = date.split("T");
    return newDate[0];
  }

  // ******************* HANDLE EDIT ********************

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

      setRatings((prevRatings) =>
        prevRatings.map((rating) =>
          rating._id === id
            ? { ...rating, stars: editStars, comment: editComment }
            : rating
        )
      );

      setEditMode(null);
    } catch (error) {
      console.log(error);
    }
  };

  const renderStars = (stars) => {
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <div key={spaetiId} id="rating-container">
      <div id="create-container">{currentUser && <CreateRatingComp />}</div>
      <div>
        {ratings.map((oneRating) => {
          if (oneRating.spaeti === spaetiId)
            return (
              <div key={oneRating._id} id="rating">
                {currentUser && (currentUser._id === oneRating.user._id || currentUser.admin) ? (
                  <div id="rc-btn">
                    <div>
                      <button
                        id="r-c-dlt-btn"
                        onClick={() => handleDeleteComment(oneRating._id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div>
                      <button
                        id="r-c-edt-btn"
                        onClick={() => handleEdit(oneRating)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ) : null}

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
                  <div id="rating-content">
                    <h4>User: {oneRating.user.username}</h4>
                    <h4>Rating: {renderStars(oneRating.stars)}</h4>
                    <h4>Created: {getCreationDate(oneRating.date)}</h4>
                    <div>
                      {currentUser && (
                        <div id="likes">
                          <div>
                            <LikeOutlined
                              onClick={() => handleLike(oneRating._id)}
                            />
                          </div>
                          <div id="likes-num">
                            <h4> {likes[oneRating._id]}</h4>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div id="rating-comment">
                  <h4> Comment: {oneRating.comment} </h4>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};
export default RatingCard;
