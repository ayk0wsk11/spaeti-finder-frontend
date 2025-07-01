// src/pages/SpaetiListPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Alert } from "antd";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import L from "leaflet";
import { API_URL } from "../../config";
import "./SpaetiListPage.css";

const SpaetiListPage = () => {
  const { setIsOnProfile, currentUser } = useContext(AuthContext);
  const [spaetis, setSpaetis] = useState([]);
  const [filteredSpaetis, setFilteredSpaetis] = useState([]);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    setIsOnProfile(false);
  }, [setIsOnProfile]);

  // 1) grab user geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      console.error,
      { enableHighAccuracy: true }
    );
  }, []);

  // 2) fetch all Spätis
  useEffect(() => {
    const fetchSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis`);
        setSpaetis(data.data);
        setFilteredSpaetis(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpaetis();
  }, []);

  // 3) apply filters & sorts
  const applyFilter = ({
    sterniMax,
    wc,
    seats,
    starsMin,
    sortOrder,
    ratingSortOrder,
    distanceSortOrder,
    zipCode,
  }) => {
    let filtered = [...spaetis];

    // ZIP filter
    if (zipCode && zipCode.length === 5) {
      filtered = filtered.filter((s) => String(s.zip) === zipCode);
    }

    // Sterni-Index max
    if (sterniMax !== "") {
      filtered = filtered.filter((s) => s.sternAvg <= parseFloat(sterniMax));
    }

    // Min rating
    if (starsMin !== 0) {
      filtered = filtered.filter((s) => {
        const avg =
          s.rating.reduce((sum, r) => sum + Number(r.stars), 0) /
            (s.rating.length || 1) || 0;
        return avg >= starsMin;
      });
    }

    // WC / seats filters
    if (wc !== "any") {
      filtered = filtered.filter((s) => (wc === "yes" ? s.wc : !s.wc));
    }
    if (seats !== "any") {
      filtered = filtered.filter((s) => (seats === "yes" ? s.seats : !s.seats));
    }

    // Sort by Sterni-Index
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.sternAvg - b.sternAvg);
    }
    if (sortOrder === "desc") {
      filtered.sort((a, b) => b.sternAvg - a.sternAvg);
    }

    // Sort by Rating
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

    // Sort by Distance
    if (userLocation && distanceSortOrder !== "none") {
      filtered.sort((a, b) => {
        const da = L.latLng(userLocation).distanceTo(L.latLng(a.lat, a.lng));
        const db = L.latLng(userLocation).distanceTo(L.latLng(b.lat, b.lng));
        return distanceSortOrder === "asc" ? da - db : db - da;
      });
    }

    // Show “no results” banner only if ZIP was entered and nothing matched
    if (zipCode && zipCode.length === 5 && filtered.length === 0) {
      setShowNoResults(true);
    } else {
      setShowNoResults(false);
    }

    setFilteredSpaetis(filtered);
  };

  // 4) search + attach distance prop for cards
  const filteredAndSearched = filteredSpaetis
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .map((spa) => {
      if (userLocation && spa.lat && spa.lng) {
        const d = L.latLng(userLocation).distanceTo(L.latLng(spa.lat, spa.lng));
        return { ...spa, distance: d };
      }
      return { ...spa, distance: null };
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

        {showNoResults && (
          <Alert
            type="info"
            showIcon
            closable
            onClose={() => setShowNoResults(false)}
            message="No Späti found :("
            description={
              <span>
                Unfortunately we didn't find you a Späti matching your criterias in this Kiez. Maybe try do adjust your filter.
                Should you find a Späti matching your criteria, please add it{" "}
                <Link to="/spaeti/create">here</Link>.
              </span>
            }
            style={{ marginBottom: 16, borderRadius: 8 }}
          />
        )}

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
