import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../config";

const SpaetiCard = () => {
  const [spaetis, setSpaetis] = useState([])

  useEffect(()=>{

    const fetchData = async ()=>{
    try {
      const {data} = await axios.get(`${API_URL}/spaetis`)
      setSpaetis(data.data)
      console.log("spaetis in card", data.data)

    } catch (error) {
      console.log(error)
    }}
    fetchData()
  }, [])


if(!spaetis)return


  const calculateAverageRating = (ratings) => {
    
    if (!ratings || ratings.length === 0) return 0;
    const totalStars = ratings.reduce((sum, rating) => sum + Number(rating.stars), 0);
    return (totalStars / ratings.length).toFixed(1); 
  };

  const averageRating = calculateAverageRating(spaetis.rating);
  

  


  return (
    <Link to={`/spaeti/details/${spaetis._id}`}>
      <h2>{spaetis.name}</h2>
      <img src={spaetis.image} alt={spaetis.name} />
      <div>{spaetis.rating ? <div>{spaetis.rating.stars}</div> : null}</div>

      <div>
        {averageRating !== null ? (
          <div>Average Rating: {averageRating} ⭐</div>
        ) : (
          <div>No ratings yet</div>
        )}
      </div>

      <h3>Address:</h3>
      <div>
        <h4>
          {spaetis.street}
          <br />
          {spaetis.zip}, {spaetis.city}
          <br />
        </h4>
      </div>
    </Link>
  );
};

export default SpaetiCard;
