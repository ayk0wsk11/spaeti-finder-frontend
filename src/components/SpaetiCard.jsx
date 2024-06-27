import { Link } from "react-router-dom";

const SpaetiCard = ({ spaetis }) => {
  return (
    <Link to={`/spaeti/details/${spaetis._id}`}>
      <h2>{spaetis.name}</h2>
      <img src={spaetis.image} alt={spaetis.name} />
      <div>{spaetis.rating ? <h4>{spaetis.rating}</h4> : null}</div>
      <h3>Address:</h3> <br />
      <div>
        <h4>
          {spaetis.street}
          <br />
          {spaetis.zip}, {spaetis.city}
          <br />
        </h4>
      </div>
    </Link>
  );
};

export default SpaetiCard;
