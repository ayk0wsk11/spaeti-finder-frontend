import { Link } from "react-router-dom";
import React from "react";
import { PictureFilled, StarFilled } from "@ant-design/icons";
import "./SpaetiCard.css";
import sterniImg from "../../assets/icon.png";

const SpaetiCard = ({ spaeti }) => {
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalStars = ratings.reduce(
      (sum, rating) => sum + Number(rating.stars),
      0
    );
    return (totalStars / ratings.length).toFixed(1);
  };
  if (!spaeti) return;
  const averageRating = calculateAverageRating(spaeti.rating);

  return (
    <Link id="spaeti-card" to={`/spaeti/details/${spaeti._id}`}>
      <div id="s-c-img-box">
        {spaeti.image ? (
          <img alt={spaeti.name} src={spaeti.image} />
        ) : (
          <PictureFilled />
        )}
      </div>
      <div id="s-c-text-box">
        <h3>{spaeti.name}</h3>

        <div id="s-c-rating">
          {averageRating && spaeti.rating ? (
            <>
              {averageRating} <StarFilled />
              &#32; &#40;{spaeti.rating.length}&#41;
            </>
          ) : (
            <>
              - <StarFilled />
              &#32; &#40;0&#41;
            </>
          )}
        </div>
        <div id="labels">
          {spaeti.sterni > 0 && (
            <div id="sterni">
              <img src={sterniImg} />
              &#32;
              {spaeti.sterni.toFixed(2)}€
            </div>
          )}
          {spaeti.seats && <div id="seats">seats</div>}
          {spaeti.wc && <div id="wc">WC</div>}
        </div>
      </div>
    </Link>
  );
};

export default SpaetiCard;
