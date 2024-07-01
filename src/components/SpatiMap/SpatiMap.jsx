import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { API_URL } from "../../config";
import "./SpatiMap.css";
import { Link } from "react-router-dom";

// Fixing marker icon issue with react-leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`
  );
  const data = await response.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
};

const SpatiMap = () => {
  const [spatis, setSpatis] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchAllSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis`);
        const arrOfSpaeti = data.data;
        setSpatis(
          arrOfSpaeti.map((spati) => ({
            _id: spati._id,
            name: spati.name,
            address: `${spati.street}, ${spati.zip} ${spati.city}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching spaetis:", error);
      }
    };
    fetchAllSpaetis();
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const newMarkers = [];
      for (const spati of spatis) {
        const coords = await geocodeAddress(spati.address);
        if (coords) {
          newMarkers.push({ ...spati, ...coords, _id: spati._id });
        }
      }
      setMarkers(newMarkers);
    };

    // fetchCoordinates is called whenever spatis changes
    fetchCoordinates();
  }, [spatis]);

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

  return (
    <MapContainer center={[52.52, 13.405]} zoom={12} id="map">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]}>
          <Popup>
            <Link to={`/spaeti/details/${marker._id}`}>{marker.name}</Link>
          </Popup>
        </Marker>
      ))}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default SpatiMap;
