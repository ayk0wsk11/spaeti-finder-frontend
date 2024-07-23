import React from 'react';
import TicketList from '../../components/TicketList/TicketList';
import './AdminDashboard.css';  // Import the CSS file

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="ticket-list-container">
        <TicketList />
      </div>
    </div>
  );
};

export default AdminDashboard;
