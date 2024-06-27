import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

const SpaetiDetailsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [comment, setComment] = useState();
  const [oneSpaeti, setOneSpaeti] = useState();

  const { spaetiId } = useParams();
  const nav = useNavigate();

  useEffect(()=>{

    const fetchData = async ()=>{

      try {
        const {data} = await axios.get(`${API_URL}/spaetis/${spaetiId}`)
        setOneSpaeti(data.data)

      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  },[spaetiId])

  return <div></div>;
};
export default SpaetiDetailsPage;
