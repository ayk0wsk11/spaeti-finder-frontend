import { useContext, useEffect, useState } from "react";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { Link } from "react-router-dom";
import "./SpaetiListPage.css";
import { Button, Flex } from "antd";


const SpaetiListPage = () => {
  const { setIsOnProfile, currentUser } = useContext(AuthContext);
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

  const applyFilter = ({
    sterniMax,
    wc,
    seats,
    starsMin,
    sortOrder,
    ratingSortOrder,
  }) => {
    let filtered = spaetis;
  
    // Filter logic remains unchanged
    if (sterniMax !== "") {
      filtered = filtered.filter(
        (spaeti) => spaeti.sterni <= parseFloat(sterniMax)
      );
    }
    if (starsMin !== 0) {
      filtered = filtered.filter((spaeti) => {
        const totalStars = spaeti.rating.reduce(
          (sum, rating) => sum + Number(rating.stars),
          0
        );
        const averageRating = totalStars / spaeti.rating.length || 0;
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
  
    // Sorting by Sterni-Index
    if (sortOrder === "asc") {
      filtered = filtered.sort((a, b) => a.sterni - b.sterni);
    } else if (sortOrder === "desc") {
      filtered = filtered.sort((a, b) => b.sterni - a.sterni);
    }
  
    // Sorting by Rating
    if (ratingSortOrder !== "none") {
      filtered = filtered.sort((a, b) => {
        const averageRatingA =
          a.rating.length > 0
            ? a.rating.reduce((sum, rating) => sum + Number(rating.stars), 0) /
              a.rating.length
            : 0;
        const averageRatingB =
          b.rating.length > 0
            ? b.rating.reduce((sum, rating) => sum + Number(rating.stars), 0) /
              b.rating.length
            : 0;
  
        if (ratingSortOrder === "asc") {
          return averageRatingA - averageRatingB || (averageRatingB === 0 ? -1 : 0);
        } else if (ratingSortOrder === "desc") {
          return averageRatingB - averageRatingA || (averageRatingA === 0 ? -1 : 0);
        }
        return 0;
      });
    }
  
    setFilteredSpaetis(filtered);
  };
  

  return (
    <div>
      <div id="btn-container">
        {currentUser && currentUser.admin ? (
          <div>
            <Link to={`/approval`}>
            <Button className="btn-list-page" >Approval page</Button>
            </Link>
          </div>
        ) : null}
        <div>
          {currentUser ? (
            <div>
              <Link to="/spaeti/create">
                <Flex gap="small" wrap>
                  <Button className="btn-list-page" >Add a new Späti here</Button>
                </Flex>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div id="spaeti-list-page">
        <FilterComponent applyFilter={applyFilter} />
        <br />
        <div id="spaeti-cards">
          {filteredSpaetis.map((spaeti) => {
            if (spaeti.approved) {
              return <SpaetiCard key={spaeti._id} spaeti={spaeti} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};
export default SpaetiListPage;
