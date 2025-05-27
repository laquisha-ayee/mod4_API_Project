import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createReview, updateReview } from "../store/reviews";
import './CurrentUserButtons.css';

function ReviewFormModal({ spotId, review, onClose, onReviewSubmit }) {
  const dispatch = useDispatch();
  const [reviewText, setReviewText] = useState("");
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (review) {
      setReviewText(review.review);
      setStars(review.stars);
    } else {
      setReviewText("");
      setStars(0);
    }
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (reviewText.length < 10) {
      setErrors(["Review must be at least 10 characters"]);
      return;
    }

    if (stars < 1) {
      setErrors(["Please select a star rating"]);
      return;
    }

    try {
      let newReview;
      if (review) {
        newReview = await dispatch(updateReview(review.id, { review: reviewText, stars }));
      } else {
        newReview = await dispatch(createReview(spotId, { review: reviewText, stars }));
      }
      if (onReviewSubmit) onReviewSubmit(newReview);
      if (onClose) onClose();
    } catch (err) {
      setErrors(err.errors || [err.message]);
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
  <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
      <form onSubmit={handleSubmit} className="review-form-modal-form">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
  {review
  ? `How was your stay at ${review?.Spot?.name || "this spot"}?`
  : "How was your stay?"}
        </h2>

{errors.length > 0 && <ul className="modal-errors">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
  <textarea
    value={reviewText}
    onChange={e => setReviewText(e.target.value)}
    placeholder="Leave your review here..."
    required
    className="modal-textarea"
/>

  <div className="star-row">
      {[1, 2, 3, 4, 5].map(num => (
    <span
      key={num}
      style={{
    cursor: "pointer",
    color: (hoverStars || stars) >= num ? "#e75480" : "#ccc",
    fontSize: "2rem"
  }}
   onMouseEnter={() => setHoverStars(num)}
   onMouseLeave={() => setHoverStars(0)}
   onClick={() => setStars(num)}
>&#9733;</span>
))}
<span style={{ fontSize: "1rem", marginLeft: "8px" }}>Stars</span>
  </div>
          
<button
  type="submit"
  disabled={reviewText.length < 10 || stars < 1}
  className="modal-submit-btn"
  >
{review ? "Update Your Review" : "Submit Your Review"}
</button>
  </form>
  </div>
  </div>
);
 }

export default ReviewFormModal;