import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createReview, updateReview } from "../store/reviews";
import './CurrentUserButtons.css';

function ReviewFormModal({ spotId, review, onClose, onReviewSubmit }) {
  const dispatch = useDispatch();
  const [reviewText, setReviewText] = useState(review ? review.review : "");
  const [stars, setStars] = useState(review ? review.stars : 0);
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
<div className="review-modal">
<button
type="button"
onClick={onClose}
className="close-modal-btn"
aria-label="Close"
style={{ position: "relative", top: "16px", right: "16px", background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
>
  &times;
</button>

<form onSubmit={handleSubmit}>
<h2>
  {review
? `How was your stay at ${review?.Spot?.name}?`
: "How was your stay?"}
</h2>
{errors.length > 0 && <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
 <textarea value={reviewText}
onChange={e => setReviewText(e.target.value)}
placeholder="Leave your review here..."
minLength={10}
required
/>

<div className="star-row">
{[1,2,3,4,5].map(num => (
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
>  &#9733;  </span>
))}
<span style={{fontSize: "1rem", marginLeft: "8px"}}>Stars</span>
</div>
<button
  type="submit"
  disabled={reviewText.length < 10 || stars < 1}
>
{review ? "Update Your Review" : "Submit Your Review"}
</button>
</form>
</div>
  );
}     

export default ReviewFormModal;