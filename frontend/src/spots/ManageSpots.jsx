import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './SpotList.css'; 
import { csrfFetch } from "../store/csrf";

function ManageSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 

  useEffect(() => {
    fetch("/api/spots/current")
.then(res => res.json())
.then(data => {
    setSpots(Array.isArray(data.Spots) ? data.Spots : []);
    setLoading(false);
      });
  }, []);

  const handleDelete = async (spotId) => {
    if (window.confirm("Are you sure you want to delete this spot?")) {
try {
    await csrfFetch(`/api/spots/${spotId}`, { method: "DELETE" });
setSpots(spots.filter(spot => spot.id !== spotId));
if (spots.length === 1) {
    navigate('/spots');
    }
} catch (err) {
alert("Failed to delete spot.");
}
    }
  };


  if (loading) return <div>Loading...</div>;

  return (
  <div>
<h2 className="center-header">Manage Spots</h2>

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
   
<div className="spot-actions">
    <Link to={`/spots/${spot.id}/edit`}>
<button className="edit-btn">Edit</button>
  </Link>
 
 <button
    className="delete-btn"
    onClick={() => handleDelete(spot.id)}>
 Delete
</button>
 </div>
</div>
    ))}
</div>
    </div>
);
    }  

export default ManageSpots;