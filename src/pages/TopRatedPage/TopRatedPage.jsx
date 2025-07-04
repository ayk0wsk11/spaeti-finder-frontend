import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SpaetiCard from "../../components/SpaetiCard/SpaetiCard";
import { API_URL } from "../../config";
import "./TopRatedPage.css";

const TopRatedPage = () => {
  const [topSpätis, setTopSpätis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedSpätis = async () => {
      try {
        setLoading(true);
        // Fetch all approved Spätis
        const response = await axios.get(`${API_URL}/spaetis`);
        const allSpätis = response.data.data || response.data;

        // Filter only approved Spätis with ratings
        const approvedSpätis = allSpätis.filter(
          spaeti => spaeti.approved && spaeti.rating && spaeti.rating.length > 0
        );

        // Sort by calculated average rating (highest first) and take top 10
        const sortedSpätis = approvedSpätis
          .sort((a, b) => {
            const avgA =
              a.rating.reduce((sum, r) => sum + Number(r.stars), 0) /
                (a.rating.length || 1) || 0;
            const avgB =
              b.rating.reduce((sum, r) => sum + Number(r.stars), 0) /
                (b.rating.length || 1) || 0;
            return avgB - avgA; // Descending order (highest first)
          })
          .slice(0, 10);

        setTopSpätis(sortedSpätis);
      } catch (err) {
        console.error("Error fetching top-rated Spätis:", err);
        setError("Failed to load top-rated Spätis. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedSpätis();
  }, []);

  if (loading) {
    return (
      <div className="top-rated-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading top-rated Spätis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-rated-page">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="top-rated-page">
      <div className="top-rated-header">
        <h1>🏆 Top-Rated Spätis</h1>
        <p className="subtitle">
          Discover Berlin's highest-rated late-night stores, ranked by our community
        </p>
        <div className="stats">
          <span className="stat">
            🌟 Showing {topSpätis.length} top-rated Spätis
          </span>
        </div>
      </div>

      {topSpätis.length === 0 ? (
        <div className="no-results">
          <h3>No rated Spätis found</h3>
          <p>Be the first to rate a Späti and help build our community rankings!</p>
          <Link to="/spaetis" className="cta-button">
            Browse All Spätis
          </Link>
        </div>
      ) : (
        <div className="top-rated-grid">
          {topSpätis.map((spaeti, index) => {
            // Calculate average rating using your method
            const calculatedAverage = spaeti.rating && spaeti.rating.length > 0
              ? spaeti.rating.reduce((sum, r) => sum + Number(r.stars), 0) / spaeti.rating.length
              : 0;
            
            return (
              <div key={spaeti._id} className="ranked-card">
                <div className="rank-badge">
                  <span className="rank-number">#{index + 1}</span>
                  <span className="rank-icon">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏆"}
                  </span>
                </div>
                <SpaetiCard spaeti={spaeti} />
                <div className="rating-highlight">
                  <span className="rating-score">⭐ {calculatedAverage.toFixed(1)}</span>
                  <span className="rating-count">
                    ({spaeti.rating?.length || 0} review{spaeti.rating?.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="top-rated-footer">
        <div className="cta-section">
          <h3>Help improve our rankings!</h3>
          <p>Rate more Spätis to help other users discover the best spots in Berlin.</p>
          <div className="cta-buttons">
            <Link to="/spaeti/list" className="cta-button secondary">
              Browse All Spätis
            </Link>
            <Link to="/spaeti/create" className="cta-button primary">
              Add a Späti
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRatedPage;
