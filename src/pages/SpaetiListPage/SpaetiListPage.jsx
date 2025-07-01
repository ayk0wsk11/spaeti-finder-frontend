import { useContext, useEffect, useState } from "react";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { Link } from "react-router-dom";
import { Input } from "antd";
import "./SpaetiListPage.css";

const SpaetiListPage = () => {
  const { setIsOnProfile, currentUser } = useContext(AuthContext);
  const [spaetis, setSpaetis] = useState([]);
  const [filteredSpaetis, setFilteredSpaetis] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => setIsOnProfile(false), []);

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

  const applyFilter = ({ sterniMax, wc, seats, starsMin, sortOrder, ratingSortOrder }) => {
    let filtered = [...spaetis];

    if (sterniMax !== "") {
      filtered = filtered.filter(spaeti => spaeti.sternAvg <= parseFloat(sterniMax));
    }
    if (starsMin !== 0) {
      filtered = filtered.filter(spaeti => {
        const totalStars = spaeti.rating.reduce((sum, r) => sum + Number(r.stars), 0);
        const avg = totalStars / spaeti.rating.length || 0;
        return avg >= starsMin;
      });
    }
    if (wc !== "any") filtered = filtered.filter(spaeti => wc === "yes" ? spaeti.wc : !spaeti.wc);
    if (seats !== "any") filtered = filtered.filter(spaeti => seats === "yes" ? spaeti.seats : !spaeti.seats);

    if (sortOrder === "asc") filtered.sort((a, b) => a.sternAvg - b.sternAvg);
    if (sortOrder === "desc") filtered.sort((a, b) => b.sternAvg - a.sternAvg);

    if (ratingSortOrder !== "none") {
      filtered.sort((a, b) => {
        const avgA = a.rating.reduce((sum, r) => sum + Number(r.stars), 0) / (a.rating.length || 1);
        const avgB = b.rating.reduce((sum, r) => sum + Number(r.stars), 0) / (b.rating.length || 1);
        return ratingSortOrder === "asc" ? avgA - avgB : avgB - avgA;
      });
    }

    setFilteredSpaetis(filtered);
  };

  const filteredAndSearched = filteredSpaetis.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div id="spaeti-list-page">
      <div id="left-panel">
        <FilterComponent applyFilter={applyFilter} />
      </div>

      <div id="right-panel">
        <div id="btn-container">
          {currentUser?.admin && (
            <Link to="/approval" id="approval-btn">Approval Page</Link>
          )}
          {currentUser && (
            <Link to="/spaeti/create" id="create-spaeti-btn">Add a new Späti</Link>
          )}
        </div>

        <Input
          placeholder="Search Späti by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4"
        />

        <div id="spaeti-cards-column">
          {filteredAndSearched.map(spaeti => spaeti.approved && (
            <SpaetiCard key={spaeti._id} spaeti={spaeti} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaetiListPage;
