import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './SpotList.css'; 

function ManageSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spots/current")
.then(res => res.json())
.then(data => {
    setSpots(Array.isArray(data.Spots) ? data.Spots : []);
    setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
  <div>
<h2>Manage Spots</h2>
<div className="spot-grid">
    {spots.length === 0 && <div>You have no spots yet.</div>}
    {spots.map(spot => (
<div className="spot-card" key={spot.id}>
    <Link to={`/spots/${spot.id}`}>
              
<img
    src={spot.previewImage || "https://via.placeholder.com/300x200?text=No+Image"}
    alt={spot.name}
    className="spot-image"
/>
              
<div className="spot-info">
<div className="spot-location">
    {spot.city}, {spot.state}
<span className="spot-rating">
   &#9733; {spot.avgRating ? Number(spot.avgRating).toFixed(2) : "New"}
</span>
</div>
                
<div className="spot-price">
    <strong>${spot.price}</strong> night
</div>
</div>
</Link>
    {/* You can add Edit/Delete buttons here if you want */}
</div>
    ))}
</div>
    </div>
);
    }  

export default ManageSpots;