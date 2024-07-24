import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import "./ChangeRequestForm.css";

const ChangeRequestForm = () => {
  const [changes, setChanges] = useState({});
  const { spaetiId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [oneSpaeti, setOneSpaeti] = useState({});
  useEffect(() => {
    const fetchSpaeti = async () => {
      const { data } = await axios.get(`${API_URL}/spaetis/${spaetiId}`);
      setOneSpaeti(data.data);
    };
    fetchSpaeti();
  }, [spaetiId]);

  if (!currentUser) {
    setTimeout(() => {
      return <p>Loading...</p>;
    }, 3000);
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChanges({
      ...changes,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/tickets`,
        { spaetiId, changes, userId: currentUser._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Change request submitted!");
    } catch (err) {
      alert("Error submitting change request");
    }
  };

  return (
    <form className="change-request-form" onSubmit={handleSubmit}>
      <h2>Change Request</h2>
      <label>
        Name of the Späti:
        <input
          type="text"
          name="name"
          placeholder={oneSpaeti.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Price of a Sterni:
        <input type="number" name="sterni" placeholder={oneSpaeti.sterni} step="0.1" onChange={handleChange} />
      </label>
      <label>
        <input
          type="checkbox"
          name="seats"
          checked={oneSpaeti.seats ? true : false}
          onChange={handleChange}
        />
        Seats
      </label>
      <label>
        <input
          type="checkbox"
          checked={oneSpaeti.wc ? true : false}
          name="wc"
          onChange={handleChange}
        />
        WC
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ChangeRequestForm;
