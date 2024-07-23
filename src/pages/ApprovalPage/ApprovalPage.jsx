import { useContext, useEffect, useState } from "react";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import "./ApprovalPage.css";

const ApprovalPage = () => {
  const { setIsOnProfile } = useContext(AuthContext);
  const [spaetis, setSpaetis] = useState([]);

  useEffect(() => {
    setIsOnProfile(false);
    const fetchSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis`);
        setSpaetis(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpaetis();
  }, []);

  const handleApproval = async (id) => {
    try {
      await axios.patch(`${API_URL}/spaetis/update/${id}`, { approved: true });
      setSpaetis((prevSpaetis) =>
        prevSpaetis.map((spaeti) =>
          spaeti._id === id ? { ...spaeti, approved: true } : spaeti
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejection = async (id) => {
    try {
      await axios.delete(`${API_URL}/spaetis/delete/${id}`);
      setSpaetis((prevSpaetis) =>
        prevSpaetis.filter((spaeti) => spaeti._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="approval-page">
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
      </div>
    </div>
  );
};

export default ApprovalPage;
