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
        console.log(data.data);
        setSpaetis(data.data);
        setFilteredSpaetis(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpaetis();
  }, []);

  const applyFilter = ({ sterniMax, wc, seats, starsMin, sortOrder, ratingSortOrder }) => {
    let filtered = spaetis;

    if (sterniMax !== "") {
      filtered = filtered.filter(
        (spaeti) => spaeti.sterni <= parseFloat(sterniMax)
      );
    }
    if (starsMin !== 0) {
      filtered = filtered.filter((spaeti) => {
        const totalStars = spaeti.rating.reduce((sum, rating) => sum + Number(rating.stars), 0);
        const averageRating = totalStars / spaeti.rating.length;
        
        return averageRating >= starsMin;
      });
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

    if (ratingSortOrder !== 'none') {
      filtered = filtered.sort((a, b) => {
        const averageRatingA = a.rating.reduce((sum, rating) => sum + Number(rating.stars), 0) / a.rating.length;
        const averageRatingB = b.rating.reduce((sum, rating) => sum + Number(rating.stars), 0) / b.rating.length;
  
        if (ratingSortOrder === 'asc') {
          return averageRatingA - averageRatingB; 
        } else if (ratingSortOrder === 'desc') {
          return averageRatingB - averageRatingA; 
        }
        return 0; 
      });
    }

    setFilteredSpaetis(filtered);
  };

  return (
    <div>
      <FilterComponent applyFilter={applyFilter} />
      {filteredSpaetis.map((spaeti) => {
        if (spaeti.approved) {
          return <SpaetiCard key={spaeti._id} spaetis={spaeti} />;
        }
      })}
    </div>
  );
};
export default SpaetiListPage;
