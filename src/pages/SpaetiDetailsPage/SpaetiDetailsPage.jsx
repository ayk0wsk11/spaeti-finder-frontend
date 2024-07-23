import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import RatingCard from "../../components/RatingCard/RatingCard";
import "./SpaetiDetailsPage.css";
import sterniImg from "../../assets/icon.png";
import { Button, Flex } from "antd";

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
      <div id="change-request-btn">
        <Link to={`/spaeti/change-request/${spaetiId}`}>
          <Flex gap="small" wrap>
            <Button className="btn-list-page">Request a change</Button>
          </Flex>
        </Link>
      </div>
      <div id="header-container">
        <h1>{oneSpaeti.name}</h1>
        <div id="address">
          <div>
            <h4>
              {oneSpaeti.street}
              <br />
              {oneSpaeti.zip}, {oneSpaeti.city}
              <br />
            </h4>
          </div>
        </div>
        {averageRating !== null ? (
          <h3>
            Average Rating: {renderStars(Math.round(averageRating))} (
            {averageRating})
          </h3>
        ) : (
          <h4>No ratings yet</h4>
        )}
        <img src={oneSpaeti.image} alt="Spaeti img" />
      </div>

      <div id="labels">
        {oneSpaeti.sterni > 0 && (
          <div id="sterni">
            <img src={sterniImg} />
            &#32;
            {oneSpaeti.sterni.toFixed(2)}€
          </div>
        )}
        {oneSpaeti.seats && <div id="seats">seats</div>}
        {oneSpaeti.wc && <div id="wc">WC</div>}
      </div>

      <div id="rating-card">
        <RatingCard />
      </div>
    </div>
  );
};

export default SpaetiDetailsPage;
