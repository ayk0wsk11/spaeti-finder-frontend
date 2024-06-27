import { useContext, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
const SpaetiCreatePage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState(12345);
  const [city, setCity] = useState("");
  const [seats, setSeats] = useState(false);
  const [wc, setWc] = useState(false);
  const [sterni, setSterni] = useState(1);
  const [rating, setRating] = useState(null);
  const [approved, setApproved] = useState(false);
  const { currentUser } = useContext(AuthContext);

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
  };



  const handleAddSpaeti = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/spaetis`, newSpaeti);
      console.log("Spaeti added", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
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
            placeholder="Street"
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

        <button>Add Späti</button>
      </form>
    </div>
  );
};

export default SpaetiCreatePage;
