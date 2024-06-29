import { useEffect, useState } from "react";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import axios from "axios";
import { API_URL } from "../../config";

const SpaetiListPage = () => {
  const [spaetis, setSpaetis] = useState([]);

  useEffect(() => {
    const fetchSpaetis = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis`);
        console.log("data in allList", data.data)
        setSpaetis(data.data)

      } catch (error) {
        console.log(error);
      }
    };
    fetchSpaetis();
  }, []);

  return (
    <div>
      {spaetis.map((spaeti) =>{ 
        if(spaeti.approved){
        return(
        <SpaetiCard key={spaeti._id} spaetis={spaeti} />
      
        
      )}})}
    </div>
  );
};
export default SpaetiListPage;
