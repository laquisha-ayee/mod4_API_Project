import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './SpotList.css';

function SpotList() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spots")
      .then(res => res.json())
      .then(data => {
        setSpots(Array.isArray(data.Spots) ? data.Spots : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="spot-grid">
      {spots.map(spot => {
        // Find the preview image
        const previewImage = spot.SpotImages?.find(img => img.preview) || spot.SpotImages?.[0];
        return (
          <div className="spot-card" key={spot.id}>
            <Link to={`/spots/${spot.id}`}>
              <img
                src={previewImage ? previewImage.url : "https://via.placeholder.com/300x200?text=No+Image"}
                alt={spot.name}
                className="spot-image"
              />
              <div className="spot-info">
                <div className="spot-location">
                  {spot.city}, {spot.state}
                  <span className="spot-rating">
                    ★ {spot.avgRating ? spot.avgRating.toFixed(2) : "New"}
                  </span>
                </div>
                <div className="spot-price">
                  <strong>${spot.price}</strong> night
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default SpotList;