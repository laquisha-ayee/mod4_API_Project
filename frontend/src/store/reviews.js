import { csrfFetch } from './csrf';

//export const updateReview = (reviewId, reviewData) => async dispatch => {
//const res = await csrfFetch(`/api/reviews/${reviewId}`, {
//  method: 'PUT',
//  headers: { 'Content-Type': 'application/json' },
//  body: JSON.stringify(reviewData)
//});


const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';





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



export const fetchReviews = (spotId) => async dispatch => {
const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
const data = await res.json();
  dispatch(loadReviews(spotId, data.Reviews));
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
const res = await fetch(`/api/reviews/${reviewId}`, {
  method: 'PUT',
  body: JSON.stringify(reviewData) 
});

if (!res.ok) throw await res.json();
  const updatedReview = await res.json();
dispatch({ type: 'UPDATE_REVIEW', review: updatedReview });
return updatedReview;
};



export const deleteReview = (spotId, reviewId) => async (dispatch) => {
const res = await fetch(`/api/reviews/${reviewId}`, {
  method: "DELETE",
  credentials: "include"
});
  if (res.ok) {
  dispatch(removeReview(spotId,reviewId));
  return true;
} else {
  return false;
}
 };


const initialState = {};
export default function reviewsReducer(state = initialState, action) {
switch (action.type) {
case LOAD_REVIEWS: {
return { ...state, [action.spotId]: action.reviews };
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
return {
    ...state,
    [action.spotId]: state[action.spotId].filter(r => r.id !== action.reviewId)
  };
}

default:
   return state;
  }
}