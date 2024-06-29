import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

const Sidebar = ({ sidebarClosed }) => {
  const [spaetis, setSpaetis] = useState([]);

  useEffect(() => {
    const fetchSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis`);
        console.log(data.data);
        setSpaetis(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpaetis();
  }, []);

  return (
    <div
      id="sidebar"
      style={sidebarClosed ? { display: "none" } : { display: "flex" }}
    >
      <ul id="sidebar-ul">
        {spaetis.map((spaeti) => {
          return (
            <NavLink
              id="sidebar-links"
              key={spaeti._id}
              to={`/spaeti/details/${spaeti._id}`}
            >
              <li>{spaeti.name}</li>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
