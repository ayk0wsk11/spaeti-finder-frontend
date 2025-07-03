import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

const SpaetiEditPage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState(12345);
  const [city, setCity] = useState("Berlin");
  const [seats, setSeats] = useState(false);
  const [wc, setWc] = useState(false);
  const [sterni, setSterni] = useState(0); // this is the newly edited price
  const { currentUser, setIsOnProfile } = useContext(AuthContext);
  const nav = useNavigate();
  const { spaetiId } = useParams();

  useEffect(() => { setIsOnProfile(false); }, [setIsOnProfile]);

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
        setSterni(data.data.sternAvg); // pull the current average into your editor
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [spaetiId]);

  const geocodeAddress = async (address) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const json = await res.json();
    if (json.length) return { lat: +json[0].lat, lng: +json[0].lon };
    return null;
  };

  const handleEditSpaeti = async (e) => {
    e.preventDefault();
    const coords = await geocodeAddress(`${street}, ${zip} ${city}`);
    if (!coords) return console.log("Geo failed");

    // send the newly edited Sterni as `sterni`: backend will append & recalc
    const payload = {
      name,
      image,
      street,
      zip,
      city,
      seats,
      wc,
      sterni,       // new price goes here
      lat: coords.lat,
      lng: coords.lng,
    };

    try {
      await axios.patch(`${API_URL}/spaetis/update/${spaetiId}`, payload);
      nav(`/spaeti/details/${spaetiId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <BackButton to={`/spaeti/details/${spaetiId}`}>Zurück zu Details</BackButton>
      <form id="add-form" onSubmit={handleEditSpaeti}>
        <label>
          Name:
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>

        <label>
          Image URL:
          <input value={image} onChange={e => setImage(e.target.value)} />
        </label>

        <label>
          Address:
          <input value={street} onChange={e => setStreet(e.target.value)} required />
          <input type="number" value={zip} onChange={e => setZip(e.target.value)} required />
          <input value={city} onChange={e => setCity(e.target.value)} required />
        </label>

        <label>
          Toilet:
          <select value={wc} onChange={e => setWc(e.target.value === "true")}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>

        <label>
          Seats:
          <select value={seats} onChange={e => setSeats(e.target.value === "true")}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>

        <label>
          New Sterni-Index (€):
          <input
            type="number"
            step="0.1"
            value={sterni}
            onChange={e => setSterni(e.target.value)}
            required
          />
        </label>

        <button>Update Späti</button>
      </form>
    </div>
  );
};

export default SpaetiEditPage;
