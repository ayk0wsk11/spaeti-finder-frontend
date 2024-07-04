import { useContext, useEffect, useState } from "react";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import FilterComponent from "../../components/FilterComponent/FilterComponent";

const SpaetiListPage = () => {
  const { setIsOnProfile } = useContext(AuthContext);
  const [spaetis, setSpaetis] = useState([]);
  const [filteredSpaetis, setFilteredSpaetis] = useState([]);

  useEffect(() => {
    setIsOnProfile(false);
  }, []);

  useEffect(() => {
    const fetchSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis`);
        setSpaetis(data.data);
        setFilteredSpaetis(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpaetis();
  }, []);

  const applyFilter = ({ sterniMin, sterniMax, wc, seats, sortOrder }) => {
    let filtered = spaetis;

    if (sterniMin !== "") {
      filtered = filtered.filter(
        (spaeti) => spaeti.sterni >= parseFloat(sterniMin)
      );
    }
    if (sterniMax !== "") {
      filtered = filtered.filter(
        (spaeti) => spaeti.sterni <= parseFloat(sterniMax)
      );
    }
    if (wc !== "any") {
      filtered = filtered.filter((spaeti) =>
        wc === "yes" ? spaeti.wc : !spaeti.wc
      );
    }
    if (seats !== "any") {
      filtered = filtered.filter((spaeti) =>
        seats === "yes" ? spaeti.seats : !spaeti.seats
      );
    }

    if (sortOrder === "asc") {
      filtered = filtered.sort((a, b) => a.sterni - b.sterni);
    } else if (sortOrder === "desc") {
      filtered = filtered.sort((a, b) => b.sterni - a.sterni);
    }

    setFilteredSpaetis(filtered);
  };

  return (
    <div>
      <FilterComponent applyFilter={applyFilter} />
      {filteredSpaetis.map((spaeti) => {
        if (spaeti.approved) {
          return <SpaetiCard key={spaeti._id} spaetis={spaeti}/>;
        }
      })}
    </div>
  );
};
export default SpaetiListPage;
