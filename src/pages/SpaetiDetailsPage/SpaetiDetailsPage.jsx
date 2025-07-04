import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { useSpaetiContext } from "../../context/spaeti.context";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import RatingCard from "../../components/RatingCard/RatingCard";
import "./SpaetiDetailsPage.css";
import SingleSpaetiMap from "../../components/SingleSpaetiMap/SingleSpaetiMap";
import sterniImg from "../../assets/icon.png";
import { Button, Flex } from "antd";
import { StarFilled, HeartOutlined, HeartFilled } from "@ant-design/icons";
import L from "leaflet";

const SpaetiDetailsPage = () => {
  const { currentUser, isLoading, setIsOnProfile } = useContext(AuthContext);
  const { getSpaeti, updateSpaeti, refreshSpaetis } = useSpaetiContext();
  const [oneSpaeti, setOneSpaeti] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const { spaetiId } = useParams();
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const nav = useNavigate();

  useEffect(() => setIsOnProfile(false), [setIsOnProfile]);

  // Geolocation holen
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      console.error,
      { enableHighAccuracy: true }
    );
  }, []);

  // Distanz berechnen
  useEffect(() => {
    if (!userLocation || !oneSpaeti) return;
    const p1 = L.latLng(userLocation.lat, userLocation.lng);
    const p2 = L.latLng(oneSpaeti.lat, oneSpaeti.lng);
    setDistance(p1.distanceTo(p2));
  }, [userLocation, oneSpaeti]);

  // First try to get Späti from context, fallback to API if needed
  useEffect(() => {
    const spaetiFromContext = getSpaeti(spaetiId);
    if (spaetiFromContext) {
      setOneSpaeti(spaetiFromContext);
      // If context has ratings, calculate average immediately
      if (spaetiFromContext.rating && spaetiFromContext.rating.length > 0) {
        setAverageRating(calculateAverageRating(spaetiFromContext.rating));
      }
    } else {
      // Fallback: fetch from API if not in context yet
      fetchData();
    }
  }, [spaetiId, getSpaeti]);

  // Daten & Favorite-Status laden (fallback function)
  const fetchData = async () => {
    try {
      const { data: spaData } = await axios.get(
        `${API_URL}/spaetis/${spaetiId}`
      );
      setOneSpaeti(spaData.data);

      const { data: ratingData } = await axios.get(
        `${API_URL}/spaetis/ratings/${spaetiId}`
      );
      setAverageRating(calculateAverageRating(ratingData.rating));

      if (currentUser) {
        const token = localStorage.getItem("authToken");
        const { data: userRes } = await axios.get(
          `${API_URL}/users/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const favs = userRes.data.favorites || [];
        setIsFav(favs.includes(spaetiId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load favorites when user changes
  useEffect(() => {
    if (currentUser && oneSpaeti) {
      // Only fetch favorites, not the Späti data
      const checkFavoriteStatus = async () => {
        try {
          const { data: userData } = await axios.get(
            `${API_URL}/users/${currentUser._id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
          );
          setIsFav(userData.data.favorites?.includes(spaetiId));
        } catch (err) {
          console.error(err);
        }
      };
      checkFavoriteStatus();
    }
  }, [currentUser, spaetiId, oneSpaeti]);

  // Durchschnitts‐Rating
  const calculateAverageRating = (ratings) =>
    ratings && ratings.length
      ? (
          ratings.reduce((sum, r) => sum + Number(r.rating || r.stars || 0), 0) / ratings.length
        ).toFixed(1)
      : 0;

  // Favoriten umschalten
  const toggleFavorite = async () => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${API_URL}/users/${currentUser._id}/favorite/${spaetiId}`,
        { add: !isFav },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFav(!isFav);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    await axios.delete(`${API_URL}/spaetis/delete/${spaetiId}`);
    nav("/spaeti/list");
  };

  if (!oneSpaeti || isLoading) return <p className="loading">Loading…</p>;

  return (
    <div className="detail-page">
      <div className="detail-header">
        <Link to="/spaeti/list" className="back-btn">
          ← Zurück
        </Link>

        {/* ganz rechts: Request change, Herz & ggf. Admin-Actions */}
        <div className="detail-header-right">
          {currentUser && (
            <Button id="change-btn" onClick={() => nav(`/spaeti/change-request/${spaetiId}`)}>
              Request a change
            </Button>
          )}
          {currentUser && (
            <span
              className="fav-icon-header"
              onClick={toggleFavorite}
              role="button"
              aria-label={isFav ? "Remove favorite" : "Add favorite"}
            >
              {isFav ? <HeartFilled /> : <HeartOutlined />}
            </span>
          )}
          {currentUser?.admin && (
            <div className="admin-actions">
              <Button onClick={() => nav(`/spaeti/edit/${spaetiId}`)}>
                Edit
              </Button>
              <Button danger onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div
        className="hero-image"
        style={{ backgroundImage: `url(${oneSpaeti.image})` }}
      >
        <div className="hero-overlay">
          <h1 className="spaeti-name">{oneSpaeti.name}</h1>
          <div className="hero-rating">
            <span>{averageRating || '0.0'}</span>
            <StarFilled className="star-icon" />
          </div>
        </div>
      </div>

      {/* Rest unverändert */}
      <section className="info-section">
        <div className="info-left">
          <p className="info-line">
            <strong>Adresse:</strong>
            <br />
            {oneSpaeti.street}, {oneSpaeti.zip} {oneSpaeti.city}
          </p>
          <p className="info-line">
            <strong>Sterni-Index:</strong> {oneSpaeti.sternAvg?.toFixed(2)}€
            <img src={sterniImg} alt="€" className="sterni-icon" />
          </p>
          <div className="feature-tags">
            {oneSpaeti.wc && <span className="tag wc">WC</span>}
            {oneSpaeti.seats && <span className="tag seats">Seats</span>}
            {oneSpaeti.atm && <span className="tag atm">ATM</span>}
            {oneSpaeti.card && <span className="tag card">Card</span>}
          </div>
        </div>
        <div className="info-right">
          <SingleSpaetiMap
            lat={oneSpaeti.lat}
            lng={oneSpaeti.lng}
            name={oneSpaeti.name}
          />
          <p className="distance">
            Distance:{" "}
            {distance == null
              ? "…"
              : distance < 1000
              ? `${Math.round(distance)} m`
              : `${(distance / 1000).toFixed(1)} km`}
          </p>
        </div>
      </section>

      <section className="reviews-section">
        <RatingCard onNewRating={refreshSpaetis} />
      </section>
    </div>
  );
};

export default SpaetiDetailsPage;
