import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './SpotList.css'; 
import { csrfFetch } from "../store/csrf";

function ManageSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  const navigate = useNavigate();
 

useEffect(() => {
    fetch("/api/spots/current")
.then(res => res.json())
.then(data => {
    setSpots(Array.isArray(data.Spots) ? data.Spots : []);
    setLoading(false);
      });
  }, 
  []);

const handleDeleteClick = (spotId) => {
    setSpotToDelete(spotId);
    setShowModal(true);
};

const handleConfirmDelete = async () => {
    try {
await csrfFetch(`/api/spots/${spotToDelete}`, { method: "DELETE" });
setSpots(spots.filter(spot => spot.id !== spotToDelete));
setShowModal(false);
setSpotToDelete(null);
 if (spots.length === 1) {
        navigate('/spots');
  }
} catch (err) {
alert("Failed to delete spot.");
setShowModal(false);
setSpotToDelete(null);
}
  };

const handleCancelDelete = () => {
    setShowModal(false);
    setSpotToDelete(null);
};

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => (
<div className="modal-overlay">
<div className="modal-content">
    <h2>Confirm Delete</h2>
<p>Are you sure you want to remove this spot from the listing?</p>
<button className="delete-btn" onClick={onConfirm}>
    Yes (Delete Spot)
    </button>
<button className="cancel-btn" onClick={onCancel}>
    No (Keep Spot)
</button>
</div>
</div>
);


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
 
 <button className="delete-btn"
    onClick={() => handleDeleteClick(spot.id)}>
 Delete
</button>
 </div>
</div>
    ))}
</div>
{showModal && (
<ConfirmDeleteModal
  onConfirm={handleConfirmDelete}
 onCancel={handleCancelDelete} 
/>
)}
</div>
);
}




export default ManageSpots;