import { Link } from "react-router-dom";
import React from "react";
import { StarFilled } from "@ant-design/icons";
import sterniImg from "../../assets/icon.png";
import "./SpaetiCard.css";

const SpaetiCard = ({ spaeti }) => {
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalStars = ratings.reduce(
      (sum, rating) => sum + Number(rating.stars),
      0
    );
    return (totalStars / ratings.length).toFixed(1);
  };

  if (!spaeti) return null;
  const averageRating = calculateAverageRating(spaeti.rating);

  return (
    <Link to={`/spaeti/details/${spaeti._id}`} className="spaeti-card">
      <div className="spaeti-card-row top-row">
        <h3>{spaeti.name}</h3>
        <span className="rating">
          {averageRating} <StarFilled className="text-yellow-500" />
        </span>
      </div>

      <div className="spaeti-card-row middle-row">
        <p>
          {spaeti.street}, {spaeti.zip} {spaeti.city}
        </p>
        <span className="distance">Distance: -- km</span>
      </div>

      <div className="spaeti-card-row bottom-row">
        <div className="labels">
          {spaeti.seats && <span className="label seats">Seats</span>}
          {spaeti.wc && <span className="label wc">WC</span>}
        </div>
        <span className="sterni">
          <img src={sterniImg} alt="sterni" />
          {typeof spaeti.sternAvg === "number"
            ? `${spaeti.sternAvg.toFixed(2)}€`
            : "N/A"}
        </span>
      </div>
    </Link>
  );
};

export default SpaetiCard;
