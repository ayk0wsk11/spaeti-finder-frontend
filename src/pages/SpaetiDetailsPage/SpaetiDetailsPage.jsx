import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import RatingCard from "../../components/RatingCard/RatingCard";
import "./SpaetiDetailsPage.css";
import SingleSpaetiMap from "../../components/SingleSpaetiMap/SingleSpaetiMap";
import sterniImg from "../../assets/icon.png";
import { Button, Flex } from "antd";
import { StarFilled } from "@ant-design/icons";
import L from "leaflet";

const SpaetiDetailsPage = () => {
  const { currentUser, isLoading, setIsOnProfile } = useContext(AuthContext);
  const [oneSpaeti, setOneSpaeti] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const { spaetiId } = useParams();
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const nav = useNavigate();

  useEffect(() => setIsOnProfile(false), [setIsOnProfile]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      console.error,
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (!userLocation || !oneSpaeti) return;
    const p1 = L.latLng(userLocation.lat, userLocation.lng);
    const p2 = L.latLng(oneSpaeti.lat, oneSpaeti.lng);
    setDistance(p1.distanceTo(p2));
  }, [userLocation, oneSpaeti]);

  const calculateAverageRating = (ratings) =>
    ratings && ratings.length
      ? (ratings.reduce((sum, r) => sum + Number(r.stars), 0) / ratings.length).toFixed(1)
      : 0;

  const fetchData = async () => {
    try {
      const { data: spaData } = await axios.get(`${API_URL}/spaetis/${spaetiId}`);
      const { data: ratingData } = await axios.get(`${API_URL}/spaetis/ratings/${spaetiId}`);
      setOneSpaeti(spaData.data);
      setAverageRating(calculateAverageRating(ratingData.rating));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, [spaetiId]);

  const handleDelete = async () => {
    await axios.delete(`${API_URL}/spaetis/delete/${spaetiId}`);
    nav("/spaeti/list");
  };

  if (!oneSpaeti || isLoading) return <p className="loading">Loading…</p>;

  return (
    <div className="detail-page">
      <div className="detail-header">
        <Link to="/spaeti/list" className="back-btn">← Zurück</Link>
        {currentUser && (
          <Link to={`/spaeti/change-request/${spaetiId}`}>
            <Flex gap="small" wrap>
              <Button className="btn-list-page">Request a change</Button>
            </Flex>
          </Link>
        )}
        {currentUser?.admin && (
          <div className="admin-actions">
            <Button onClick={() => nav(`/spaeti/edit/${spaetiId}`)}>Edit</Button>
            <Button danger onClick={handleDelete}>Delete</Button>
          </div>
        )}
      </div>

      <div className="hero-image" style={{ backgroundImage: `url(${oneSpaeti.image})` }}>
        <div className="hero-overlay">
          <h1 className="spaeti-name">{oneSpaeti.name}</h1>
          <div className="hero-rating">
            <span>{averageRating}</span>
            <StarFilled className="star-icon" />
          </div>
        </div>
      </div>

      <section className="info-section">
        <div className="info-left">
          <p className="info-line">
            <strong>Adresse:</strong><br/>
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
          <SingleSpaetiMap lat={oneSpaeti.lat} lng={oneSpaeti.lng} name={oneSpaeti.name} />
          <p className="distance">
            Distance: {distance == null
              ? "…"
              : distance < 1000
              ? `${Math.round(distance)} m`
              : `${(distance / 1000).toFixed(1)} km`}
          </p>
        </div>
      </section>

      <section className="reviews-section">
        <RatingCard onNewRating={fetchData} />
      </section>
    </div>
  );
};

export default SpaetiDetailsPage;
