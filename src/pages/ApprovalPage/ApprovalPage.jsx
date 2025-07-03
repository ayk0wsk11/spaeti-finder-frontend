import { useContext, useEffect, useState } from "react";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import { useSpaetiContext } from "../../context/spaeti.context";
import { message, Tabs, Card, Button, Image } from "antd";
import BackButton from "../../components/BackButton/BackButton";
import "./ApprovalPage.css";

const { TabPane } = Tabs;

const ApprovalPage = () => {
  const { setIsOnProfile } = useContext(AuthContext);
  const { getUnapprovedSpaetis, updateSpaeti, deleteSpaeti, refreshSpaetis } = useSpaetiContext();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setIsOnProfile(false);
    fetchTickets();
  }, []);

  const spaetis = getUnapprovedSpaetis(); // Get unapproved Spätis from context

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(data.data);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch ticket data");
    }
  };

  const handleApproval = async (id) => {
    try {
      await axios.patch(`${API_URL}/spaetis/update/${id}`, { approved: true });
      updateSpaeti(id, { approved: true }); // Update in context
      message.success("Späti approved successfully!");
    } catch (error) {
      console.log(error);
      message.error("Failed to approve Späti");
    }
  };

  const handleRejection = async (id) => {
    try {
      await axios.delete(`${API_URL}/spaetis/delete/${id}`);
      deleteSpaeti(id); // Remove from context
      message.success("Späti rejected and deleted successfully!");
    } catch (error) {
      console.log(error);
      message.error("Failed to reject Späti");
    }
  };

  const handleTicketApproval = async (ticketId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API_URL}/tickets/${ticketId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== ticketId)
      );
      refreshSpaetis(); // Refresh Spätis from server after ticket approval
      message.success("Change request approved successfully!");
    } catch (error) {
      console.log(error);
      message.error("Failed to approve change request");
    }
  };

  const handleTicketRejection = async (ticketId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API_URL}/tickets/${ticketId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== ticketId)
      );
      message.success("Change request rejected successfully!");
    } catch (error) {
      console.log(error);
      message.error("Failed to reject change request");
    }
  };

  return (
    <div id="approval-page">
      <BackButton to="/">Zurück zur Startseite</BackButton>
      
      <h1>Admin Dashboard</h1>
      
      <Tabs defaultActiveKey="spaetis" size="large">
        <TabPane tab={`New Späti Requests (${spaetis.filter(s => !s.approved).length})`} key="spaetis">
          <div id="spaeti-cards">
            {spaetis.map((spaeti) => {
              if (!spaeti.approved) {
                return (
                  <div key={spaeti._id} className="spaeti-card-container">
                    <SpaetiCard spaeti={spaeti} />
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleApproval(spaeti._id)}
                      >
                        Approve Späti
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleRejection(spaeti._id)}
                      >
                        Reject Späti
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            {spaetis.filter(s => !s.approved).length === 0 && (
              <p>No pending Späti requests</p>
            )}
          </div>
        </TabPane>

        <TabPane tab={`Change Requests (${tickets.length})`} key="tickets">
          <div id="ticket-cards">
            {tickets.map((ticket) => (
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
                      onClick={() => handleTicketApproval(ticket._id)}
                    >
                      Approve Changes
                    </Button>
                    <Button 
                      danger 
                      className="reject-btn"
                      onClick={() => handleTicketRejection(ticket._id)}
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
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ApprovalPage;
