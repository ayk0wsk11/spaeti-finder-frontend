import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import RatingCard from "../../components/RatingCard/RatingCard";

const SpaetiDetailsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [oneSpaeti, setOneSpaeti] = useState();

  const { spaetiId } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/spaetis/${spaetiId}`);
        console.log("inside detailspage:", data);
        setOneSpaeti(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [spaetiId]);

  const handleDelete = async (e)=>{
    e.preventDefault();

    const deleteSpaeti = await axios.delete(`${API_URL}/spaetis/delete/${spaetiId}`)
    console.log("Späti was deleted successfully!")
    nav("/spaeti/list")
  }

  if (!oneSpaeti) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      
      {currentUser && (currentUser._id == "668263216512af155244867e" || currentUser._id == "Aykos ID") ? 
        <div>
          <Link to={`/spaeti/edit/${spaetiId}`}><button>Edit Späti</button></Link>
          <button onClick={handleDelete}>Delete Späti</button>
        </div>
       : null}
      <h1>{oneSpaeti.name}</h1>
      <img src={oneSpaeti.image} />
      <h3>Address:</h3>
      <div>
        <h4>
          {oneSpaeti.street}
          <br />
          {oneSpaeti.zip}, {oneSpaeti.city}
          <br />
        </h4>
        <h4>Created by: {oneSpaeti.creator.username}</h4>
      </div>
      {oneSpaeti.sterni ? 
      <h4>Sterni-Index: {oneSpaeti.sterni}</h4> : <h4>Sterni-Index: Not available</h4>}
      <div>{oneSpaeti.seats ? <h4>Seats: Yes </h4> : <h4>Seats: No</h4>}</div>
      <div>{oneSpaeti.wc ? <h4>Toilet: Yes </h4> : <h4>Toilet: No</h4>}</div>
      
      <RatingCard />
    </div>
  );
};
export default SpaetiDetailsPage;
