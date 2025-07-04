// LEAFLET IMPORTS
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

// REST
import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { API_URL } from "../../config";
import "./SpatiMap.css";
import { Link } from "react-router-dom";
import DefaultUserImage from "../../assets/default_user_image.png";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

const SpatiMap = () => {
  const [spatis, setSpatis] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { currentUser, isLoggedIn } = useContext(AuthContext);
  const mapRef = useRef();


  const userIcon = L.icon({
    iconUrl: currentUser?.image || DefaultUserImage,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    className: "user-marker-icon",
  });

  useEffect(() => {
    const fetchAllSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis`);
        const arrOfSpaeti = data.data;
        setSpatis(
          arrOfSpaeti.map((spati) => ({
            _id: spati._id,
            name: spati.name,
            approved: spati.approved,
            lat: spati.lat,
            lng: spati.lng,
          }))
        );
      } catch (error) {
        console.error("Error fetching spaetis:", error);
      }
    };

    fetchAllSpaetis();
  }, []);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      }
    };

    getUserLocation();
  }, []);

  const flyToUserLocation = () => {
  if (mapRef.current && userLocation) {
    mapRef.current.flyTo([userLocation.lat, userLocation.lng], 17, {
      duration: 1.5,
    });
  }
};


  return (
    <MapContainer center={[52.52, 13.405]} zoom={15} id="map" ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

 
      <MarkerClusterGroup
        maxClusterRadius={150}
        spiderfyOnMaxZoom={true}
        chunkedLoading
        showCoverageOnHover={true}
        singleMarkerMode={true}
      >
        {spatis.map((spati, idx) => {
          if (spati.approved && spati.lat && spati.lng)
            return (
              <Marker key={idx} position={[spati.lat, spati.lng]}>
                <Popup>
                  <Link to={`/spaeti/details/${spati._id}`}>{spati.name}</Link>
                </Popup>
              </Marker>
            );
        })}
      </MarkerClusterGroup>

      {userLocation && currentUser && isLoggedIn && userIcon && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>{currentUser.username || "You"}</Popup>
        </Marker>
      )}

      {isLoggedIn && (
  <button className="my-location-btn" onClick={flyToUserLocation}>
    📍
  </button>
)};
    </MapContainer>
    
  );
};


export default SpatiMap;
