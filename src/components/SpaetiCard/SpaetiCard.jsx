import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StarFilled, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { API_URL } from "../../config";
import sterniImg from "../../assets/icon.png";
import "./SpaetiCard.css";

const SpaetiCard = ({ spaeti, distance }) => {
  const { currentUser } = useContext(AuthContext);
  const [isFav, setIsFav] = useState(false);

  // beim Laden prüfen, ob dieser Späti in den Favoriten ist
  useEffect(() => {
    if (!currentUser) return;
    const fetchFavs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get(
          `${API_URL}/users/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFav(data.data.favorites?.includes(spaeti._id) ?? false);
      } catch (err) {
        console.error("Fehler beim Laden der Favoriten", err);
      }
    };
    fetchFavs();
  }, [currentUser, spaeti._id]);

  // Favoriten umschalten
  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Link‐Navigation verhindern
    if (!currentUser) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${API_URL}/users/${currentUser._id}/favorite/${spaeti._id}`,
        { add: !isFav },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFav(!isFav);
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
              onClick={toggleFavorite}
              aria-label={
                isFav ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
              }
            >
              {isFav ? <HeartFilled /> : <HeartOutlined />}
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
