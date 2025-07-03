// src/pages/FavoritenPage/FavoritenPage.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import { API_URL } from "../../config";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import { Row, Col, Spin } from "antd";
import BackButton from "../../components/BackButton/BackButton";
import "./FavoritenPage.css";

const FavoritenPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const { data } = await axios.get(
          `${API_URL}/users/${currentUser._id}/favorites`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites(data.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    fetchFavorites();
  }, [currentUser]);

  if (favorites === null) {
    return (
      <div className="favorites-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <BackButton />
      <h2>Meine Favoriten</h2>

      {favorites.length === 0 ? (
        <p>Du hast noch keine Favoriten.</p>
      ) : (
        <Row gutter={[16, 16]}>
          {favorites.map((spaeti) => (
            <Col key={spaeti._id} xs={24} sm={12} md={8} lg={6}>
              <SpaetiCard spaeti={spaeti} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FavoritenPage;
