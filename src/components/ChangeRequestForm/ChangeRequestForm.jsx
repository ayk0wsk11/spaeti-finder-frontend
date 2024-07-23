import React, { useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

const ChangeRequestForm = () => {
  const [changes, setChanges] = useState({});
  const {spaetiId} = useParams()
  const {currentUser} = useContext(AuthContext)

  if(!currentUser){
    return <p>Loading...</p>
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChanges({
      ...changes,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken'); 
      await axios.post(`${API_URL}/tickets`, { spaetiId, changes, userId: currentUser._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Change request submitted!');
    } catch (err) {
      alert('Error submitting change request');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" onChange={handleChange} />
      </label>
      
      <label>
        Sterni:
        <input type="number" name="sterni" step={"0.1"} onChange={handleChange} />
      </label>
      <label>
        Seats:
        <input type="checkbox" name="seats" onChange={handleChange} />
      </label>
      <label>
        WC:
        <input type="checkbox" name="wc" onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ChangeRequestForm;
