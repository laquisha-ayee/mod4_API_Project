import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, fetchCurrentUserReviews } from "../store/reviews";
import ReviewFormModal from "./ReviewFormModal";
import './CurrentUserButtons.css';


function formatDate(dateString) {
const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function CurrentUserReviews() {

const dispatch = useDispatch();
const [showUpdateModal, setShowUpdateModal] = useState(false);
const [reviewToEdit, setReviewToEdit] = useState(null);

const reviews = useSelector(state => state.reviews.userReviews || []);

useEffect(() => {
dispatch(fetchCurrentUserReviews());
}, [dispatch]);

const handleDelete = async (spotId, reviewId) => {
if (window.confirm("Are you sure you want to delete this review?")) {
await dispatch(deleteReview(spotId, reviewId));
 }
  };

const handleUpdate = (review) => {
setReviewToEdit(review);
setShowUpdateModal(true);
};

return (
<div className="user-reviews-container">
<h2>Manage Reviews</h2>
    {reviews.length === 0 ? (
<p>You have not written any reviews yet</p>
) : (
reviews.map(review => (
<div key={review.id} className="review-card">
    <div className="review-spot" style={{fontWeight: "bold", fontSize: "1.2rem"}}>{review.Spot?.name}</div>
    <div className="review-date" style={{color: "#aaa", marginBottom: "6px"}}>{formatDate(review.createdAt)}</div>
    <div className="review-text" style={{marginBottom: "8px"}}>{review.review}</div>
    <div className="review-stars" style={{marginBottom: "8px"}}>{review.stars} stars</div>
<button className="update-btn" style={{marginRight: "10px"}} onClick={() => handleUpdate(review)}>
    Update
</button>
<button className="delete-btn" onClick={() => handleDelete(review.spotId, review.id)}>
    Delete
</button>
</div>

))
)}

{showUpdateModal && (
<ReviewFormModal review={reviewToEdit} 
onClose={() => setShowUpdateModal(false)}/>
)}

</div>
);
}


export default CurrentUserReviews;