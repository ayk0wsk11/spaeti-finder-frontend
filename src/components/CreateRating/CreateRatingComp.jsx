import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { Rate, Button, Card, Input, Alert } from "antd";
import { API_URL } from "../../config";
import "./CreateRatingComponent.css";
const { TextArea } = Input;

const CreateRatingComp = ({ onNewRating }) => {
  const { currentUser } = useContext(AuthContext);
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
      await axios.post(`${API_URL}/ratings`, {
        stars,
        user: currentUser._id,
        comment: comment.trim(),
        date: new Date().toISOString(),
        spaeti: spaetiId,
      });
      setStars(0);
      setComment("");
      onNewRating();
    } catch (err) {
      console.error(err);
      setError("Failed to submit rating. Please try again.");
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
