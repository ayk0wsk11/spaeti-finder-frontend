import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { Rate } from "antd";
import React from "react";
import { API_URL } from "../../config";

const CreateRatingComp = () => {
  const { currentUser } = useContext(AuthContext);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const {spaetiId} = useParams()
  const nav = useNavigate()


  const createRating = {
    stars,
    user: currentUser,
    comment,
    date: Date.now,
    spaeti: spaetiId,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newRating = await axios.post(`${API_URL}/ratings`, createRating);
      setStars(0);
      setComment("")

     

    } catch (error) {
      console.log(error);
    }
  };

  

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Comment:
          <input
            type="text"
            value={comment}
            placeholder="Please leave a comment"
            onChange={(event) => {
              setComment(event.target.value);
            }}
          ></input>
        </label>
        <button> Add Rating</button>
      </form>
      <Rate value={stars} onChange={(event)=>{
        setStars(event)
      }} />
      
    </div>
  );
};
export default CreateRatingComp;
