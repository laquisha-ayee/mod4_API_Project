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
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [reviewToDelete, setReviewToDelete] = useState(null);

const reviews = useSelector(state => state.reviews.userReviews || []);

useEffect(() => {
dispatch(fetchCurrentUserReviews());
}, [dispatch]);

const handleDeleteClick = (spotId, reviewId) => {
  setReviewToDelete({ spotId, reviewId });
  setShowDeleteModal(true);
};

const handleConfirmDelete = async () => {
  await dispatch(deleteReview(reviewToDelete.spotId, reviewToDelete.reviewId));
  setShowDeleteModal(false);
  setReviewToDelete(null);
};

const handleCancelDelete = () => {
  setShowDeleteModal(false);
  setReviewToDelete(null);
};

const handleUpdate = (review) => {
setReviewToEdit(review);
setShowUpdateModal(true);
};

return (
<div className="user-reviews-container">
<h2>Manage Your Reviews Here</h2>
    {reviews.length === 0 ? (
<p>You have not written any reviews yet</p>
) : (
reviews.map(review => (
<div key={review.id} className="review-card">
<div className="review-spot">{review.Spot?.name}</div>
<div className="review-date">{formatDate(review.createdAt)}</div>
<div className="review-text">{review.review}</div>
<div className="review-stars">{review.stars} &#9733;</div>
<button className="update-btn" onClick={() => handleUpdate(review)}>
    Update
    </button>
<button className="delete-Areview-btn" onClick={() => handleDeleteClick(review.spotId, review.id)}>
    Delete
    </button>
</div>

))
)}

{showUpdateModal && (
<div className="modal-overlay">
<div className="modal-content">
<ReviewFormModal review={reviewToEdit} 
onClose={() => setShowUpdateModal(false)}/>
</div>
</div>
)}

{showDeleteModal && (
<div className="modal-overlay">
<div className="modal-content">
  <h2>Confirm Delete</h2>
  <p>Are you sure you want to delete this review?</p>
  <button className="modal-submit-btn" onClick={handleConfirmDelete}> Yes </button>
  <button className="no-btn" onClick={handleCancelDelete}> No </button>
</div>
</div>
)}

</div>
);
}

export default CurrentUserReviews;