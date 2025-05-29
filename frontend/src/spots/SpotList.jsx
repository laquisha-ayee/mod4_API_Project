import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSpots } from "../store/spots"; 
import './SpotList.css';



function SpotList() {
  const dispatch = useDispatch();

  const spotsObj = useSelector(state => state.spots);
  const spots = Object.values(spotsObj);

  const loading = spots.length === 0;

useEffect(() => {
  dispatch(fetchSpots());
}, [dispatch]);

if (loading) return <div>Loading...</div>;
return (
<div className="spot-grid">
  {spots.map(spot => {
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
  &#9733;
{typeof spot.avgRating === "number" ? spot.avgRating.toFixed(2) : "New"}
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