import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import RatingCard from "../../components/RatingCard/RatingCard";

const SpaetiDetailsPage = () => {
  const { currentUser, isLoading, setIsOnProfile } = useContext(AuthContext);
  const [oneSpaeti, setOneSpaeti] = useState(undefined);
  const [averageRating, setAverageRating] = useState(null);


  const { spaetiId } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis/${spaetiId}`);
        setOneSpaeti(data.data);

        const ratingsResponse = await axios.get(`${API_URL}/spaetis/ratings/${spaetiId}`)
        const ratings = ratingsResponse.data.rating;
        const avgRating = calculateAverageRating(ratings);
        setAverageRating(avgRating);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [spaetiId]);

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return null;
    const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    return (totalStars / ratings.length).toFixed(1); // Keeping one decimal place for the average
  };

  const renderStars = (stars) => {
    return "★".repeat(stars) + "☆".repeat(5 - stars); // Assuming a 5-star rating system
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const deleteSpaeti = await axios.delete(
      `${API_URL}/spaetis/delete/${spaetiId}`
    );
    console.log("Späti was deleted successfully!");
    nav("/spaeti/list");
  };

  if (!oneSpaeti) {
    return <p>Loading...</p>;
  }

  if (isLoading) {
    return;
  }

  return (
    <div>
      {currentUser && currentUser.admin  ? (
        <div>
          <Link to={`/spaeti/edit/${spaetiId}`}>
            <button>Edit Späti</button>
          </Link>
          <button onClick={handleDelete}>Delete Späti</button>
        </div>
      ) : null}
      <h1>{oneSpaeti.name}</h1>
      {averageRating !== null ? (
        <h4>Average Rating: {renderStars(Math.round(averageRating))} ({averageRating})</h4>
      ) : (
        <h4>No ratings yet</h4>
      )}
      <img src={oneSpaeti.image} />
      <h3>Address:</h3>
      <div>
        <h4>
          {oneSpaeti.street}
          <br />
          {oneSpaeti.zip}, {oneSpaeti.city}
          <br />
        </h4>
      </div>
      {oneSpaeti.sterni !== 0 ? (
        <h4>Sterni-Index: {oneSpaeti.sterni} €</h4>
      ) : (
        <h4>Sterni-Index: Not available</h4>
      )}
      <div>{oneSpaeti.seats ? <h4>Seats: Yes </h4> : <h4>Seats: No</h4>}</div>
      <div>{oneSpaeti.wc ? <h4>Toilet: Yes </h4> : <h4>Toilet: No</h4>}</div>

      <RatingCard />
    </div>
  );
};
export default SpaetiDetailsPage;
