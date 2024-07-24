import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { Rate } from "antd";
import React from "react";
import { API_URL } from "../../config";
import './CreateRatingComponent.css';

const CreateRatingComp = ({ onNewRating }) => {
  const { currentUser } = useContext(AuthContext);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const { spaetiId } = useParams();

  const createRating = {
    stars,
    user: currentUser,
    comment,
    date: Date.now(),
    spaeti: spaetiId,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${API_URL}/ratings`, createRating);
      setStars(0);
      setComment("");
      onNewRating(); 

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="form-container">
      <Rate value={stars} onChange={(value) => setStars(value)} />
      <form id="form" onSubmit={handleSubmit}>
        <label id="comment">
          Comment:
          <input
            id="input"
            type="text"
            value={comment}
            placeholder="Please leave a comment"
            onChange={(event) => {
              setComment(event.target.value);
            }}
          />
        </label>
        <button id="rating-btn">Add Rating</button>
      </form>
    </div>
  );
};

export default CreateRatingComp;
