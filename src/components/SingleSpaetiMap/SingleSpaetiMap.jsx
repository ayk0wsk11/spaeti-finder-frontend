import React, { useRef, useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AuthContext } from "../../context/auth.context";
import DefaultUserImage from "../../assets/default_user_image.png";
import "./SingleSpaetiMap.css";

// Restore Leaflet’s default icon paths (if you overrode them globally)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const SingleSpaetiMap = ({ lat, lng, name }) => {
  const { currentUser, isLoggedIn } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef();

  // get user location once
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // optional: re-center map when spaeti coords change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16);
    }
  }, [lat, lng]);

  // custom icon for user
  const userIcon = L.icon({
    iconUrl: currentUser?.image || DefaultUserImage,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
    className: "user-marker-icon",
  });

  return (
    <MapContainer
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
      center={[lat, lng]}
      zoom={16}
      scrollWheelZoom={false}
      className="single-spaeti-map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Späti Marker */}
      <Marker position={[lat, lng]}>
        <Popup>{name}</Popup>
      </Marker>

      {/* User Marker */}
      {isLoggedIn && userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default SingleSpaetiMap;
