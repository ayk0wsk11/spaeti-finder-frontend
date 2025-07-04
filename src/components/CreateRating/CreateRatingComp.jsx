import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { awardXP, XP_REWARDS } from "../../utils/xpSystem";
import axios from "axios";
import { Rate, Button, Card, Input, Alert, message } from "antd";
import { API_URL } from "../../config";
import "./CreateRatingComponent.css";
const { TextArea } = Input;

const CreateRatingComp = ({ onNewRating }) => {
  const { currentUser, authenticateUser } = useContext(AuthContext);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const { spaetiId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stars === 0) {
      setError("Please select at least one star.");
      return;
    }
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API_URL}/ratings`, {
        stars: stars, // Use 'stars' to match the model
        user: currentUser._id,
        comment: comment.trim(),
        spaeti: spaetiId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Award XP for creating a rating
      try {
        await awardXP(currentUser._id, XP_REWARDS.CREATE_RATING, "Created a rating", authenticateUser);
        message.success(`Rating submitted! You earned ${XP_REWARDS.CREATE_RATING} XP!`);
      } catch (xpError) {
        console.error("Error awarding XP:", xpError);
        message.success("Rating submitted successfully!");
      }
      
      setStars(0);
      setComment("");
      onNewRating();
    } catch (err) {
      console.error(err);
      // Check if it's a duplicate rating error
      if (err.response?.data?.message?.includes("already rated")) {
        setError("Already rated this Späti! You can update your rating, but can't add a 2nd one");
      } else {
        setError("Failed to submit rating. Please try again.");
      }
    }
  };

  if (!currentUser) {
    return <Alert message="You must be logged in to rate." type="warning" />;
  }

  return (
    <Card className="create-rating-card">
      {error && (
        <Alert
          className="create-error"
          message={error}
          type="error"
          showIcon
        />
      )}
      <form onSubmit={handleSubmit} className="create-rating-form">
        <label className="star-label">Your Rating:</label>
        <Rate
          className="star-input"
          value={stars}
          onChange={(value) => setStars(value)}
        />

        {stars > 0 && (
          <div className="comment-group">
            <label htmlFor="comment-area">Your Comment (optional):</label>
            <TextArea
              id="comment-area"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a note…"
              maxLength={300}
            />
          </div>
        )}

        <Button
          type="primary"
          htmlType="submit"
          className="submit-rating-btn"
        >
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default CreateRatingComp;
