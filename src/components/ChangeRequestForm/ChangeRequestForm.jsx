import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import "./ChangeRequestForm.css";

const ChangeRequestForm = () => {
  const [changes, setChanges] = useState({
    name: "",
    proposedSterni: 0,
    seats: false,
    wc: false,
  });
  const { spaetiId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [oneSpaeti, setOneSpaeti] = useState(null);

  // Fetch the spaeti data
  useEffect(() => {
    const fetchSpaeti = async () => {
      const { data } = await axios.get(`${API_URL}/spaetis/${spaetiId}`);
      setOneSpaeti(data.data);
    };
    fetchSpaeti();
  }, [spaetiId]);

  // Initialize changes state when oneSpaeti loads
  useEffect(() => {
    if (oneSpaeti) {
      setChanges({
        name: oneSpaeti.name || "",
        proposedSterni: oneSpaeti.sternAvg || 0,
        seats: oneSpaeti.seats || false,
        wc: oneSpaeti.wc || false,
      });
    }
  }, [oneSpaeti]);

  if (!currentUser) {
    return <p>Loading user info...</p>;
  }
  if (!oneSpaeti) {
    return <p>Loading spaeti data...</p>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChanges((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/tickets`,
        { spaetiId, changes, userId: currentUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
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
          value={changes.name}
          onChange={handleChange}
        />
      </label>

      <label>
        Proposed Sterni-Index (€):
        <input
          type="number"
          name="proposedSterni"
          value={changes.proposedSterni}
          step="0.1"
          onChange={handleChange}
        />
      </label>

      <label>
        <input
          type="checkbox"
          name="seats"
          checked={changes.seats}
          onChange={handleChange}
        />
        Seats
      </label>

      <label>
        <input
          type="checkbox"
          name="wc"
          checked={changes.wc}
          onChange={handleChange}
        />
        WC
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ChangeRequestForm;
