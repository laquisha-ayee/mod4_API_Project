import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../store/spots";
import { fetchReviews, deleteReview } from "../store/reviews";
import ReviewFormModal from "../reviews/ReviewFormModal";
import './SpotDetails.css';

function SpotDetails() {
const { spotId } = useParams();
const dispatch = useDispatch();

const spot = useSelector(state => state.spots[spotId]);
const reviews = useSelector(state => state.reviews[spotId] || []);
const currentUser = useSelector(state => state.session.user);

const [mainImageIdx, setMainImageIdx] = useState(0);
const [showReviewModal, setShowReviewModal] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchData = async () => {
  await dispatch(fetchSpotDetails(spotId));
  await dispatch(fetchReviews(spotId));
setLoading(false);
setMainImageIdx(0);
};
fetchData();
}, [dispatch, spotId]);

const handleDeleteReview = async (reviewId) => {
  if (!window.confirm("Are you sure you want to delete this review?")) return;
await dispatch(deleteReview(spotId, reviewId));
await dispatch(fetchSpotDetails(spotId));
};

if (loading) return <div>Loading...</div>;
if (!spot) return <div>Spot not found.</div>;

const images = spot.SpotImages || [];
const mainImage = images[mainImageIdx];
const otherImages = images.filter((img, idx) => idx !== mainImageIdx).slice(0, 4);

function formatDate(dateString) {
const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

const isOwner = currentUser && spot && spot.ownerId === currentUser.id;
const hasReviewed = reviews.some(review => review.userId === currentUser?.id);
const canPostReview = currentUser && !isOwner && !hasReviewed;

return (
<div className="spot-details-container">
  <h1 className="spot-title">{spot.name}</h1>
<div className="spot-location">{spot.city}, {spot.state}, {spot.country}</div>
<div className="spot-gallery-and-sidebar">
<div className="spot-gallery">
  {mainImage && (
<img src={mainImage.url} alt={spot.name} className="main-image" />
)}
<div className="other-images-row">
  {otherImages.map((img) => {
const realIdx = images.findIndex(i => i.url === img.url);
return (
 <img
  key={img.url}
   src={img.url}
 alt={`${spot.name} ${realIdx + 1}`}
className="small-image"
onClick={() => setMainImageIdx(realIdx)}
  style={{
cursor: "pointer",
  border: realIdx === mainImageIdx ? "2px solid #e75480" : "none",
boxShadow: realIdx === mainImageIdx ? "0 0 8px #e75480" : "none"
}}
/>
 );
  })}
</div>
</div>

<div className="spot-sidebar">
  <div className="spot-price-rating">
<span className="spot-price">
  ${spot.price} 
<span className="per-night">night</span></span>

<span className="spot-rating">
&#9733; {typeof spot.avgStarRating === "number"
? spot.avgStarRating.toFixed(2)
: "New"} · {spot.numReviews} {spot.numReviews === 1 ? "review" : "reviews"}
</span>
  
</div>
  <button
className="reserve-btn"
onClick={() => alert("Feature Coming Soon...")}>
Reserve
 </button>
</div>
</div>

<div className="spot-host">
  Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
</div>
<div className="spot-description">{spot.description}</div>

<div className="spot-reviews-section">
<div className="spot-reviews-header">
<span className="spot-rating">
 &#9733; {spot.avgRating ? 
  parseFloat(spot.avgRating).toFixed(1) 
  : "New"} · {spot.numReviews} {spot.numReviews === 1 ? "review" : "reviews"}
</span>
</div>

{canPostReview && (
<button
className="post-review-btn"
onClick={() => setShowReviewModal(true)}
>
Post Your Review
</button>
)}

{showReviewModal && (
<ReviewFormModal
  spotId={spotId}
  onClose={() => setShowReviewModal(false)}
onReviewSubmit={async () => {
setShowReviewModal(false);
await dispatch(fetchReviews(spotId));
await dispatch(fetchSpotDetails(spotId));
}}
/>
)}

<div className="spot-reviews-list">
{reviews.length > 0 ? (() => {
const reviewsCopy = [...reviews];
const sortedReviews = reviewsCopy.sort((a, b) => {
const dateA = new Date(a.createdAt);
const dateB = new Date(b.createdAt);
  return dateB - dateA;
});
  
return sortedReviews.map(review => (
<div key={review.id} className="spot-review">
<div className="review-author">{review.User?.firstName || "Unknown User"}</div>
<div className="review-date">{formatDate(review.createdAt)}</div>
<div className="review-text">{review.review}</div>
  {review.userId === currentUser?.id && (
<button
className="delete-review-btn"
onClick={() => handleDeleteReview(review.id)}>
  Delete
</button>
)}
</div>
));
})() : (
<div>No reviews yet</div>
)}
</div>
</div>
</div>
);
}

export default SpotDetails;