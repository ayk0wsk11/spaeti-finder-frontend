import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import './SpaetiCreatePage.css'

const SpaetiCreatePage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState(12345);
  const [city, setCity] = useState("Berlin");
  const [seats, setSeats] = useState(false);
  const [wc, setWc] = useState(false);
  const [sterni, setSterni] = useState(0);
  const [rating, setRating] = useState([]);
  const [approved, setApproved] = useState(false);
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
      setName("");
      setImage("");
      setStreet("");
      setZip(12345);
      setCity("Berlin");
      setSeats(false);
      setWc(false);
      setSterni(0);
      nav("/");
    } catch (error) {
      console.log(error);
    }
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
            value={zip}
            placeholder="Zipcode"
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
              setWc(event.target.value);
            }}
          >
            <option value="">-- Select an option --</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
            <option value={false}>Unknown</option>
          </select>
        </label>

        <label>
          Seats:
          <select
            name="seats"
            value={seats}
            onChange={(event) => {
              setSeats(event.target.value);
            }}
          >
            <option value="">-- Select an option --</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
            <option value={false}>Unknown</option>
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
    </div>
  );
};

export default SpaetiCreatePage;
