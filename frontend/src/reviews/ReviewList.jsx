import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "../store/reviews";

function ReviewList({ spotId }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const reviews = useSelector(state => state.reviews[spotId] || []);

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(spotId, reviewId));
  };

  return (
 <div>
 {reviews.length === 0 ? (

<div>No reviews yet</div>
) : (
reviews.map(review => (
  <div key={review.id}>
<div>{review.User?.firstName}</div>
<div>{review.review}</div>
<div>{review.stars} stars</div>
{currentUser && review.userId === currentUser.id && (
 <button onClick={() => handleDelete(review.id)}>Delete</button>
 )}
 </div>
  ))
)}
</div>
);
}

export default ReviewList;