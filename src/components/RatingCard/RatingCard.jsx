import { API_URL } from "../../config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const RatingCard = () => {
    const { spaetiId } = useParams()
    const [ratings, setRatings] = useState([])

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const {data}  = await axios.get(`${API_URL}/ratings`)
        setRatings(data.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchRatings();
  }, []);

  

  return <div key={spaetiId}>
    
    {ratings.map((oneRating)=>{
        if(oneRating.spaeti === spaetiId)
        return(
    <div key={oneRating._id}>
        <h4> Comment: {oneRating.comment} </h4>
        <h4>Stars: {oneRating.stars}</h4>
        <h4>User: {oneRating.user.username}</h4>
        <h4>Created: {oneRating.date}</h4>


    </div>
        )
})}
  </div>;
};
export default RatingCard;
