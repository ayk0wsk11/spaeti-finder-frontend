import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import './SpaetiCreatePage.css';

const SpaetiCreatePage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState(undefined);
  const [city, setCity] = useState("Berlin");
  const [seats, setSeats] = useState(false);
  const [wc, setWc] = useState(false);
  const [sterni, setSterni] = useState(0);
  const [rating, setRating] = useState([]);
  const [approved, setApproved] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { currentUser, setIsOnProfile } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
  }, []);

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

  const handleAddSpaeti = async (event) => {
    event.preventDefault();

    const address = `${street}, ${zip} ${city}`;
    const coords = await geocodeAddress(address);

    if (!coords) {
      console.log("Failed to get coordinates for the address.");
      return;
    }

    const newSpaeti = {
      name,
      image,
      street,
      zip,
      city,
      rating,
      sterni,
      seats,
      wc,
      creator: currentUser,
      approved,
      lat: coords.lat,
      lng: coords.lng,
    };

    try {
      await axios.post(`${API_URL}/spaetis`, newSpaeti);
      setShowAlert(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHome = () => {
    nav("/");
  };

  return (
    <div id="add-container">
      <form id="add-form" onSubmit={handleAddSpaeti}>
        <label>
          Name:
          <input
            value={name}
            placeholder="Name"
            type="text"
            onChange={(event) => {
              setName(event.target.value);
            }}
          ></input>
        </label>

        <label>
          Image:
          <input
            value={image}
            placeholder="Image URL"
            type="text"
            onChange={(event) => {
              setImage(event.target.value);
            }}
          ></input>
        </label>

        <label>
          Address:
          <input
            value={street}
            placeholder="Street + Number"
            type="text"
            onChange={(event) => {
              setStreet(event.target.value);
            }}
          ></input>
          <input
            placeholder="Zipcode"
            value={zip}
            type="number"
            onChange={(event) => {
              setZip(event.target.value);
            }}
          ></input>
          <input
            name="city"
            value={city}
            placeholder="City"
            type="text"
            onChange={(event) => {
              setCity(event.target.value);
            }}
          ></input>
        </label>

        <label>
          Toilet:
          <select
            name="wc"
            value={wc}
            onChange={(event) => {
              setWc(event.target.value === "true");
            }}
          >
            <option value="">-- Select an option --</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
            <option value="">Unknown</option>
          </select>
        </label>

        <label>
          Seats:
          <select
            name="seats"
            value={seats}
            onChange={(event) => {
              setSeats(event.target.value === "true");
            }}
          >
            <option value="">-- Select an option --</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
            <option value="">Unknown</option>
          </select>
        </label>

        <label>
          Sterni:
          <input
            value={sterni}
            placeholder="Price of a Sternburg"
            type="number"
            onChange={(event) => {
              setSterni(event.target.value);
            }}
          ></input>
        </label>

        <button id="add-spaeti-btn">Add Späti</button>
      </form>

      {showAlert && (
        <div id="alert-overlay">
          <div id="alert-box">
            <p>Späti created successfully! After approval your Späti will be added to our map and list! 😃 </p>
            <button id="home-btn" onClick={handleHome}>Home</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaetiCreatePage;
