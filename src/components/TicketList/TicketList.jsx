import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Link } from 'react-router-dom';
import { Card, Button, Image, message } from 'antd';
import './TicketList.css';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${API_URL}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        message.error("Failed to fetch tickets");
      }
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
      message.success("Change request approved successfully!");
    } catch (err) {
      console.error("Error approving ticket:", err);
      message.error('Error approving ticket');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_URL}/tickets/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter(ticket => ticket._id !== id));
      message.success("Change request rejected successfully!");
    } catch (err) {
      console.error("Error rejecting ticket:", err);
      message.error('Error rejecting ticket');
    }
  };

  return (
    <div className="ticket-list">
      <h2>Pending Change Requests ({tickets.length})</h2>
      <div className="ticket-cards">
        {tickets.map(ticket => (
          <Card 
            key={ticket._id} 
            className="ticket-card"
            title={`Change Request for: ${ticket.spaetiId?.name || 'Unknown Späti'}`}
            extra={<span>By: {ticket.userId?.username}</span>}
          >
            <div className="ticket-content">
              <div className="change-details">
                <h4>Proposed Changes:</h4>
                <ul>
                  {ticket.changes?.name && (
                    <li><strong>Name:</strong> {ticket.changes.name}</li>
                  )}
                  {ticket.changes?.proposedSterni && (
                    <li><strong>Sterni-Index:</strong> €{ticket.changes.proposedSterni}</li>
                  )}
                  {ticket.changes?.seats !== undefined && (
                    <li><strong>Seats:</strong> {ticket.changes.seats ? 'Yes' : 'No'}</li>
                  )}
                  {ticket.changes?.wc !== undefined && (
                    <li><strong>WC:</strong> {ticket.changes.wc ? 'Yes' : 'No'}</li>
                  )}
                </ul>
                
                {ticket.changes?.image && (
                  <div className="proposed-image">
                    <h4>Proposed New Image:</h4>
                    <Image 
                      src={ticket.changes.image} 
                      alt="Proposed change" 
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <Button 
                  type="primary" 
                  className="approve-btn"
                  onClick={() => handleApprove(ticket._id)}
                >
                  Approve Changes
                </Button>
                <Button 
                  danger 
                  className="reject-btn"
                  onClick={() => handleReject(ticket._id)}
                >
                  Reject Changes
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {tickets.length === 0 && (
          <p>No pending change requests</p>
        )}
      </div>
    </div>
  );
};

export default TicketList;
