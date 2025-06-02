import { csrfFetch } from './csrf';

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';


const loadUserReviews = (reviews) => ({
  type: LOAD_USER_REVIEWS,
  reviews,
});

const loadReviews = (spotId, reviews) => ({
type: LOAD_REVIEWS,
spotId,
reviews
});

const addReview = (spotId, review) => ({
type: ADD_REVIEW,
spotId,
review
});

const removeReview = (spotId, reviewId) => ({
type: REMOVE_REVIEW,
spotId,
reviewId
});

export const fetchCurrentUserReviews = () => async (dispatch) => {
const res = await csrfFetch('/api/reviews/current');
const data = await res.json();
  dispatch(loadUserReviews(data.Reviews));
return data.Reviews;
};


export const fetchReviews = (spotId) => async dispatch => {
const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
const data = await res.json();
  dispatch(loadReviews(spotId, data.Reviews));
return data.Reviews;
};

export const createReview = (spotId, review) => async dispatch => {
const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
method: 'POST',
body: JSON.stringify(review)
});
  
if (!res.ok) throw await res.json();
  const data = await res.json();
  dispatch(addReview(spotId, data));
  return data;
};


export const updateReview = (reviewId, reviewData) => async dispatch => {
const res = await csrfFetch(`/api/reviews/${reviewId}`, {
  method: 'PUT',
  body: JSON.stringify(reviewData)
});

if (!res.ok) throw await res.json();
const updatedReview = await res.json();
dispatch({ type: 'UPDATE_REVIEW', review: updatedReview });
  return updatedReview;
};


export const deleteReview = (spotId, reviewId) => async (dispatch) => {
try {
const res = await csrfFetch(`/api/reviews/${reviewId}`, {
  method: "DELETE"
});
if (res.ok) {
  dispatch(removeReview(spotId, reviewId));
}
  } catch (err) {
if (err.status === 404) {
  dispatch(removeReview(spotId, reviewId));
}
 }
};

const initialState = {};
export default function reviewsReducer(state = initialState, action) {
switch (action.type) {
case LOAD_REVIEWS: {
return { ...state, [action.spotId]: action.reviews };
}

case LOAD_USER_REVIEWS: {
return { ...state, userReviews: action.reviews };
}

case ADD_REVIEW: {
return {
    ...state,
    [action.spotId]: [action.review, ...(state[action.spotId] || [])]
  };
}

case UPDATE_REVIEW: {
  const spotId = action.review.spotId;
return {
...state,
[spotId]: state[spotId].map(r =>
r.id === action.review.id ? action.review : r
  )
 };
}

case REMOVE_REVIEW: {
const newState = { ...state };

if (newState[action.spotId]) {
newState[action.spotId] = newState[action.spotId].filter(r => r.id !== action.reviewId);
}

if (Array.isArray(newState.userReviews)) {
newState.userReviews = newState.userReviews.filter(r => r.id !== action.reviewId);
}

return newState;
}

default:
   return state;
  }
}