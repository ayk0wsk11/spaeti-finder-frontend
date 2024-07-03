import { Link } from "react-router-dom";

const SpaetiCard = ({ spaetis }) => {

  const calculateAverageRating = (ratings) => {
    


    if (!ratings || ratings.length === 0) return null;
    const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    return (totalStars / ratings.length).toFixed(1); // Keeping one decimal place for the average
  };

  const averageRating = calculateAverageRating(spaetis.rating);

  


  return (
    <Link to={`/spaeti/details/${spaetis._id}`}>
      <h2>{spaetis.name}</h2>
      <img src={spaetis.image} alt={spaetis.name} />
      <div>{spaetis.rating ? <div>{spaetis.rating.stars}</div> : null}</div>

      <div>
        {averageRating !== null ? (
          <div>Average Rating: {averageRating} ⭐</div>
        ) : (
          <div>No ratings yet</div>
        )}
      </div>

      <h3>Address:</h3>
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
