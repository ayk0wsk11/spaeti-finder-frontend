// src/pages/SpaetiListPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Modal, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import L from "leaflet";
import { API_URL } from "../../config";
import "./SpaetiListPage.css";

const SpaetiListPage = () => {
  const { setIsOnProfile, currentUser } = useContext(AuthContext);

  const [spaetis, setSpaetis]             = useState([]);
  const [filteredSpaetis, setFilteredSpaetis] = useState([]);
  const [search, setSearch]               = useState("");
  const [userLocation, setUserLocation]   = useState(null);
  const [showNoResults, setShowNoResults] = useState(false);

  // NEU: Favoriten-IDs aus dem Backend holen
  const [favoriteIds, setFavoriteIds]     = useState([]);
  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/users/${currentUser._id}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // extract nur die IDs
        setFavoriteIds(res.data.data.map((spa) => spa._id));
      })
      .catch(console.error);
  }, [currentUser]);

  useEffect(() => {
    setIsOnProfile(false);
  }, [setIsOnProfile]);

  // Geolocation wie gehabt
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      console.error,
      { enableHighAccuracy: true }
    );
  }, []);

  // Alle Spätis laden
  useEffect(() => {
    axios
      .get(`${API_URL}/spaetis`)
      .then(({ data }) => {
        setSpaetis(data.data);
        setFilteredSpaetis(data.data);
      })
      .catch(console.error);
  }, []);

  // Filter-Funktion übernimmt jetzt `favoriteIds`
  const applyFilter = ({
    sterniMax,
    wc,
    seats,
    starsMin,
    sortOrder,
    ratingSortOrder,
    distanceSortOrder,
    zipCode,
    showFavorites,
  }) => {
    let filtered = [...spaetis];

    // 1) Favoriten
    if (showFavorites) {
      filtered = filtered.filter((s) => favoriteIds.includes(s._id));
    }

    // 2) PLZ-Filter
    if (zipCode && zipCode.length === 5) {
      filtered = filtered.filter((s) => String(s.zip) === zipCode);
    }

    // 3) Sterni-Max
    if (sterniMax !== "") {
      filtered = filtered.filter((s) => s.sternAvg <= parseFloat(sterniMax));
    }

    // 4) Min-Rating
    if (starsMin !== 0) {
      filtered = filtered.filter((s) => {
        const avg =
          s.rating.reduce((sum, r) => sum + Number(r.stars), 0) /
            (s.rating.length || 1) || 0;
        return avg >= starsMin;
      });
    }

    // 5) WC & Seats
    if (wc !== "any") {
      filtered = filtered.filter((s) => (wc === "yes" ? s.wc : !s.wc));
    }
    if (seats !== "any") {
      filtered = filtered.filter((s) =>
        seats === "yes" ? s.seats : !s.seats
      );
    }

    // 6) Sort by Sterni-Index
    if (sortOrder === "asc") filtered.sort((a, b) => a.sternAvg - b.sternAvg);
    if (sortOrder === "desc") filtered.sort((a, b) => b.sternAvg - a.sternAvg);

    // 7) Sort by Rating
    if (ratingSortOrder !== "none") {
      filtered.sort((a, b) => {
        const avgA =
          a.rating.reduce((sum, r) => sum + Number(r.stars), 0) /
            (a.rating.length || 1) || 0;
        const avgB =
          b.rating.reduce((sum, r) => sum + Number(r.stars), 0) /
            (b.rating.length || 1) || 0;
        return ratingSortOrder === "asc" ? avgA - avgB : avgB - avgA;
      });
    }

    // 8) Sort by Distance
    if (userLocation && distanceSortOrder !== "none") {
      filtered.sort((a, b) => {
        const da = L.latLng(userLocation).distanceTo(L.latLng(a.lat, a.lng));
        const db = L.latLng(userLocation).distanceTo(L.latLng(b.lat, b.lng));
        return distanceSortOrder === "asc" ? da - db : db - da;
      });
    }

    // No-results Banner nur bei PLZ
    if (zipCode && zipCode.length === 5 && filtered.length === 0) {
      setShowNoResults(true);
    } else {
      setShowNoResults(false);
    }

    setFilteredSpaetis(filtered);
  };

  // Search + Anhängen der Distance-Prop
  const filteredAndSearched = filteredSpaetis
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .map((spa) => {
      if (userLocation && spa.lat && spa.lng) {
        spa.distance = L.latLng(userLocation).distanceTo(
          L.latLng(spa.lat, spa.lng)
        );
      } else {
        spa.distance = null;
      }
      return spa;
    });

  return (
    <div id="spaeti-list-page">
      <div id="left-panel">
        <FilterComponent applyFilter={applyFilter} />
      </div>

      <div id="right-panel">
        <div id="btn-container">
          {currentUser?.admin && (
            <Link to="/approval" id="approval-btn">
              Approval Page
            </Link>
          )}
          {currentUser && (
            <Link to="/spaeti/create" id="create-spaeti-btn">
              Add a new Späti
            </Link>
          )}
        </div>

        <Input
          placeholder="Search Späti by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <Modal
          title={
            <div className="no-results-modal-header">
              <InfoCircleOutlined style={{ marginRight: 8, fontSize: '16px' }} />
              Kein Späti gefunden :(
            </div>
          }
          open={showNoResults}
          onCancel={() => setShowNoResults(false)}
          footer={[
            <Button 
              key="add" 
              type="primary" 
              onClick={() => setShowNoResults(false)}
            >
              <Link to="/spaeti/create" style={{ color: 'inherit', textDecoration: 'none' }}>
                Späti hinzufügen
              </Link>
            </Button>,
            <Button key="close" onClick={() => setShowNoResults(false)}>
              Schließen
            </Button>
          ]}
          className="no-results-modal"
          centered
        >
          <div className="no-results-modal-content">
            <p>
              Leider gibt es in dieser PLZ keinen Späti. Falls du einen 
              gefunden hast, kannst du ihn gerne hinzufügen!
            </p>
          </div>
        </Modal>

        <div id="spaeti-cards-column">
          {filteredAndSearched.map(
            (spaeti) =>
              spaeti.approved && (
                <SpaetiCard
                  key={spaeti._id}
                  spaeti={spaeti}
                  distance={spaeti.distance}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaetiListPage;
