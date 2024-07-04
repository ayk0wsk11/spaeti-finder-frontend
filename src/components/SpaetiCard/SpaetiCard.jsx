import { Link } from "react-router-dom";
import React from "react";
import { Card } from "antd";
const { Meta } = Card;
import "./SpaetiCard.css";

const SpaetiCard = ({ spaetis }) => {
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalStars = ratings.reduce(
      (sum, rating) => sum + Number(rating.stars),
      0
    );
    return (totalStars / ratings.length).toFixed(1);
  };
  const averageRating = calculateAverageRating(spaetis.rating);

  return (
    <div id="spaeti-card">
      <Link to={`/spaeti/details/${spaetis._id}`}>
        <Card hoverable cover={<img alt={spaetis.name} src={spaetis.image} />}>
          <h2>{spaetis.name}</h2>
          <div>{spaetis.rating && <div>{spaetis.rating.stars}</div>}</div>
          <div>
            {averageRating !== null ? (
              <div>Average Rating: {averageRating} ⭐</div>
            ) : (
              <div>No ratings yet</div>
            )}
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default SpaetiCard;
