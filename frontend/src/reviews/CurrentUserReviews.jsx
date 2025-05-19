import { useEffect, useState } from "react";

function CurrentUserReviews() {
const [reviews, setReviews] = useState([]);

useEffect(() => {
fetch('/api/reviews/current')
    .then(res => res.json())
    .then(data => setReviews(data.Reviews || []));
}, []);

return (
<div>
<h2>Your Reviews</h2>

{reviews.length === 0 ? (
<p>You have not written any reviews yet</p>
) : (
reviews.map(review => (

<div key={review.id}>
<div>{review.Spot?.name}</div>
<div>{review.review}</div>
<div>{revies.start} start</div>
</div>
    ))
)}
</div>
);
}



export default CurrentUserReviews;