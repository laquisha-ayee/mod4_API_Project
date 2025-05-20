import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewFormModal from "../reviews/ReviewFormModal";
import './SpotDetails.css';

function SpotDetails() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);


const currentUser = useSelector(state => state.session.user);


  useEffect(() => {
    fetch(`/api/spots/${spotId}`)
      .then(res => res.json())
      .then(data => {
        setSpot(data);
        setLoading(false);
        setMainImageIdx(0); 
      });

    fetch(`/api/spots/${spotId}/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.Reviews || []);
      });
  }, [spotId]);

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
<span className="spot-price">${spot.price} <span className="per-night">night</span></span>
<span className="spot-rating">
  &#9733; {typeof spot.avgStarRating === "number"
    ? spot.avgStarRating.toFixed(2)
    : "New"} · {spot.numReviews} reviews
</span>
      </div>
   <button
 className="reserve-btn"
 onClick={() => alert("Feature Coming Soon...")}
>

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
 &#9733; {spot.avgStarRating ? Number(spot.avgStarRating).toFixed(2) : "New"} · {spot.numReviews} reviews
  </span>
   <span> · {spot.numReviews} reviews</span>
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
  onReviewSubmit={newReview => {
  setReviews([newReview, ...reviews]);
  setShowReviewModal(false);
}}
  />
)}

   <div className="spot-reviews-list">
   {reviews.length > 0 ? (
    reviews.map(review => (
     <div key={review.id} className="spot-review">
   <div className="review-author">{review.User.firstName}</div>
   <div className="review-date">{formatDate(review.createdAt)}</div>
     <div className="review-text">{review.review}</div>
 </div>
   ))
 ) : (
   <div>No reviews yet</div>
   )}
  </div>
  </div>
   </div>
  );
}

export default SpotDetails;
