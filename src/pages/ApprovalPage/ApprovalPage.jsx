import { useContext, useEffect, useState } from "react";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";

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
    const handleUpdate = await axios.patch(`${API_URL}/spaetis/update/${id}`, {
      ...spaetis,
      approved: true,
    });
  };

  return (
    <div>
      {spaetis.map((spaeti) => {
        if (!spaeti.approved) {
          return (
            <div key={spaeti._id}>
              <SpaetiCard spaetis={spaeti} />
              <button
                onClick={() => {
                  handleApproval(spaeti._id);
                }}
              >
                Approve spaeti
              </button>
            </div>
          );
        }
      })}
    </div>
  );
};
export default ApprovalPage;
