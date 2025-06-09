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
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [reviewToDelete, setReviewToDelete] = useState(null);



useEffect(() => {
const fetchData = async () => {
  await dispatch(fetchSpotDetails(spotId));
  await dispatch(fetchReviews(spotId));
setLoading(false);
setMainImageIdx(0);
};
fetchData();
}, [dispatch, spotId]);


const handleDeleteClick = (reviewId) => {
  setReviewToDelete(reviewId);
  setShowDeleteModal(true);
};

const handleConfirmDelete = async () => {
  await dispatch(deleteReview(spotId, reviewToDelete));
  await dispatch(fetchSpotDetails(spotId));
  setShowDeleteModal(false);
  setReviewToDelete(null);
};

const handleCancelDelete = () => {
  setShowDeleteModal(false);
  setReviewToDelete(null);
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
  className={`small-image ${realIdx === mainImageIdx ? 'selected' : ''}`}
  onClick={() => setMainImageIdx(realIdx)}
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
&#9733; {spot.avgStarRating ? 
  parseFloat(spot.avgStarRating).toFixed(1)
  : "New"} · {spot.numReviews} {Number(spot.numReviews) === 1 ? "review" : "reviews"}
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
  &#9733; {spot.avgStarRating ? 
  parseFloat(spot.avgStarRating).toFixed(1)
  : "New"} · {spot.numReviews} {Number(spot.numReviews) === 1 ? "review" : "reviews"}
</span>
</div>

{canPostReview && (
<button
  className="post-review-btn"
  onClick={() => setShowReviewModal(true)}>
{Number(spot.numReviews) === 0 ? "Be the first to post a review!" : "Post Your Review"}
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
onClick={() => handleDeleteClick(review.id)}>
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

{showDeleteModal && (
<div className="modal-overlay">
<div className="modal-content">
  <h2>Confirm Delete</h2>
  <p>Are you sure you want to delete this review?</p>
  <button className="modal-submit-btn" onClick={handleConfirmDelete}>Yes</button>
  <button className="no-btn" onClick={handleCancelDelete}>No</button>
</div>
</div>
)}

</div>
);
}

export default SpotDetails;