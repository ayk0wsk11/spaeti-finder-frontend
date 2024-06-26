import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fixing marker icon issue with react-leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const geocodeAddress = async (address) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await response.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
};

const SpatiMap = () => {
  const [spatis, setSpatis] = useState([
    { name: "Späti 1", address: "Alexanderplatz, Berlin" },
    { name: "Späti 2", address: "Brandenburger Tor, Berlin" }
  ]);
  
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const newMarkers = [];
      for (const spati of spatis) {
        const coords = await geocodeAddress(spati.address);
        if (coords) {
          newMarkers.push({ ...spati, ...coords });
        }
      }
      setMarkers(newMarkers);
    };
    fetchCoordinates();
  }, [spatis]);

  return (
    <MapContainer center={[52.5200, 13.4050]} zoom={12} style={{ height: "600px", width: "100vw" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]}>
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SpatiMap;
