import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StarFilled, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import { useSpaetiContext } from "../../context/spaeti.context";
import axios from "axios";
import { API_URL } from "../../config";
import sterniImg from "../../assets/icon.png";
import "./SpaetiCard.css";

const SpaetiCard = ({ spaeti, distance }) => {
  const { currentUser } = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useSpaetiContext();
  
  // No more local state or useEffect - use context directly!
  
  // Favoriten umschalten
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Link‐Navigation verhindern
    if (!currentUser) return;
    
    try {
      await toggleFavorite(spaeti._id, currentUser._id);
    } catch (err) {
      console.error("Fehler beim Umschalten des Favoriten", err);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + Number(r.stars), 0);
    return (total / ratings.length).toFixed(1);
  };

  if (!spaeti) return null;
  const avg = calculateAverageRating(spaeti.rating);

  return (
    <Link to={`/spaeti/details/${spaeti._id}`} className="spaeti-card">
      <div className="spaeti-card-row top-row">
        <div className="title-group">
          <h3 className="spaeti-name">{spaeti.name}</h3>
          {currentUser && (
            <span
              className="fav-icon"
              onClick={handleToggleFavorite}
              aria-label={
                isFavorite(spaeti._id) ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
              }
            >
              {isFavorite(spaeti._id) ? <HeartFilled /> : <HeartOutlined />}
            </span>
          )}
        </div>
        <span className="rating">
          {avg} <StarFilled className="star-icon" />
        </span>
      </div>

      <div className="spaeti-card-row middle-row">
        <p>
          {spaeti.street}, {spaeti.zip} {spaeti.city}
        </p>
        <span className="distance">
          {distance == null
            ? "–"
            : distance < 1000
            ? `${Math.round(distance)} m`
            : `${(distance / 1000).toFixed(1)} km`}
        </span>
      </div>

      <div className="spaeti-card-row bottom-row">
        <div className="labels">
          {spaeti.seats && <span className="label seats">Seats</span>}
          {spaeti.wc && <span className="label wc">WC</span>}
        </div>
        <span className="sterni">
          <img src={sterniImg} alt="€" />
          {typeof spaeti.sternAvg === "number"
            ? `${spaeti.sternAvg.toFixed(2)}€`
            : "N/A"}
        </span>
      </div>
    </Link>
  );
};

export default SpaetiCard;
