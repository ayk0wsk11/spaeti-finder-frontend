import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import { useNavigate, useParams } from "react-router-dom";

const SpaetiEditPage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState(12345);
  const [city, setCity] = useState("Berlin");
  const [seats, setSeats] = useState(false);
  const [wc, setWc] = useState(false);
  const [sterni, setSterni] = useState(0);
  const [rating, setRating] = useState([]);
  const { currentUser, setIsOnProfile } = useContext(AuthContext);
  const nav = useNavigate();
  const { spaetiId } = useParams();

  useEffect(() => {
    setIsOnProfile(false);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis/${spaetiId}`);
        setName(data.data.name);
        setImage(data.data.image);
        setStreet(data.data.street);
        setZip(data.data.zip);
        setCity(data.data.city);
        setSeats(data.data.seats);
        setWc(data.data.wc);
        setSterni(data.data.sterni);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [spaetiId]);

  const updatedSpaeti = {
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
    approved: true,
  };

  const handleEditSpaeti = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.patch(
        `${API_URL}/spaetis/update/${spaetiId}`,
        updatedSpaeti
      );

      nav(`/spaeti/details/${spaetiId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form id="add-form" onSubmit={handleEditSpaeti}>
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

        <button>Update Späti</button>
      </form>
    </div>
  );
};
export default SpaetiEditPage;
