import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Link } from 'react-router-dom';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('authToken'); 
      const res = await axios.get(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.data);
    };
    fetchTickets();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('authToken'); 
      await axios.post(`${API_URL}/tickets/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter(ticket => ticket._id !== id));
    } catch (err) {
      alert('Error approving ticket');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('authToken'); 
      await axios.post(`${API_URL}/tickets/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter(ticket => ticket._id !== id));
    } catch (err) {
      alert('Error rejecting ticket');
    }
  };

  return (
    <div>
      <h2>Pending Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id}>
            {console.log(ticket)}
            <p>User: {ticket.userId.username}</p>
            <Link to={`/spaeti/details/${ticket.spaetiId._id}`}>
            <p>Späti: {ticket.spaetiId.name}</p>
            </Link>
            <p>Changes: {JSON.stringify(ticket.changes)}</p>
            <button onClick={() => handleApprove(ticket._id)}>Approve</button>
            <button onClick={() => handleReject(ticket._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketList;
