import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import RatingCard from "../../components/RatingCard/RatingCard";
import "./SpaetiDetailsPage.css";
import sterniImg from "../../assets/icon.png";

const SpaetiDetailsPage = () => {
  const { currentUser, isLoading, setIsOnProfile } = useContext(AuthContext);
  const [oneSpaeti, setOneSpaeti] = useState(undefined);
  const [averageRating, setAverageRating] = useState(null);

  const { spaetiId } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
  }, []);

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalStars = ratings.reduce(
      (sum, rating) => sum + Number(rating.stars),
      0
    );
    return (totalStars / ratings.length).toFixed(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis/${spaetiId}`);
        setOneSpaeti(data.data);
        const ratingsResponse = await axios.get(
          `${API_URL}/spaetis/ratings/${spaetiId}`
        );
        const ratings = ratingsResponse.data.rating;
        const avgRating = calculateAverageRating(ratings);
        setAverageRating(avgRating);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [spaetiId]);

  const renderStars = (stars) => {
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const deleteSpaeti = await axios.delete(
      `${API_URL}/spaetis/delete/${spaetiId}`
    );
    nav("/spaeti/list");
  };

  if (!oneSpaeti) {
    return <p>Loading...</p>;
  }

  if (isLoading) {
    return;
  }

  return (
    <div id="spaeti-list-container">
      {currentUser && currentUser.admin ? (
        <div id="detail-list-btn">
          <Link to={`/spaeti/edit/${spaetiId}`}>
            <button>Edit Späti</button>
          </Link>
          <button onClick={handleDelete}>Delete Späti</button>
        </div>
      ) : null}
      <div id="header-container">
        <h1>{oneSpaeti.name}</h1>
        {averageRating !== null ? (
          <h3>
            Average Rating: {renderStars(Math.round(averageRating))} (
            {averageRating})
          </h3>
        ) : (
          <h4>No ratings yet</h4>
        )}
        <img id="detail-img" src={oneSpaeti.image} alt="Spaeti img" />
      </div>
      <div id="middle-container">
        <div id="label-container">
          {oneSpaeti.sterni !== 0 ? (
            <label className="sterni-idx">
              <h4>Sterni-Index: {oneSpaeti.sterni} €</h4>
            </label>
          ) : (
            <label className="sterni-idx">
              <h4>Sterni-Index: Not available</h4>
            </label>
          )}
          <div>
            {oneSpaeti.seats ? (
              <label className="seats-label">
                <h4>Seats: Yes </h4>{" "}
              </label>
            ) : (
              <label className="seats-label">
                <h4>Seats: No</h4>
              </label>
            )}
          </div>
          <div>
            {oneSpaeti.wc ? (
              <label className="wc-label">
                <h4>Toilet: Yes </h4>
              </label>
            ) : (
              <label className="wc-label">
                <h4>Toilet: No</h4>
              </label>
            )}
          </div>
        </div>
        <div id="address">
          <h3>Address:</h3>
          <div>
            <h4>
              {oneSpaeti.street}
              <br />
              {oneSpaeti.zip}, {oneSpaeti.city}
              <br />
            </h4>
          </div>
        </div>
      </div>
      <div id="rating-card">
        <RatingCard />
      </div>
    </div>
  );
};
export default SpaetiDetailsPage;
