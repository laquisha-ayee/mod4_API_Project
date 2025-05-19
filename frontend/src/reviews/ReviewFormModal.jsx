import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../store/reviews";

function ReviewFormModal({ spotId, onClose }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState([]);


const handleSubmit = async (e) => {
e.preventDefault();
setErrors([]);

if (review.length < 10) {
setErrors(["Review must be at least 10 characters"]);
return;
}

if (stars < 1) {
setErrors(["Please select a star rating"]);
return;
}

try {
      await dispatch(createReview(spotId, { review, stars }));
      onClose();
    } catch (err) {
      setErrors(err.errors || [err.message]);
    }
  };

  return (
<form onSubmit={handleSubmit}>
<h2>How was your stay?</h2>
{errors.length > 0 && <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
<textarea
    value={review}
    onChange={e => setReview(e.target.value)}
    placeholder="Leave your review here..."
    minLength={10}
    required
/>


<div>
{[1,2,3,4,5].map(num => (
<span
    key={num}
    style={{ cursor: "pointer", color: num <= stars ? "#e75480" : "#ccc" }}
    onClick={() => setStars(num)}
>  &#9733;  </span>
))}
        
<span> Stars</span>
</div>
<button type="submit" disabled={review.length < 10 || stars < 1}>
    Submit Your Review
</button>
</form>
  );
}

export default ReviewFormModal;