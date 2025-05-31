import { csrfFetch } from './csrf';


const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const ADD_SPOT = 'spots/ADD_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const REMOVE_SPOT = 'spots/REMOVE_SPOT';

const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});

const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});


export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const data = await res.json();
  dispatch(updateSpot(data)); 
  return data;
};

export const fetchSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots');
  const data = await res.json();
  dispatch(loadSpots(data.Spots || [])); 
};

export const createSpot = (spotData) => async (dispatch) => {
const res = await csrfFetch('/api/spots', {
  method: 'POST',
  body: JSON.stringify(spotData),
});
const data = await res.json();
dispatch(addSpot(data));
  return data;
};

export const fetchCurrentUserSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current');
  const data = await res.json();
  dispatch(loadSpots(data.Spots));
  return data.Spots;
};


export const editSpot = (spotId, spotData) => async (dispatch) => {
const res = await csrfFetch(`/api/spots/${spotId}`, {
  method: 'PUT',
  body: JSON.stringify(spotData),
});
const data = await res.json();
dispatch(updateSpot(data));
  return data;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });
  dispatch(removeSpot(spotId));
};

const initialState = {};

export default function spotsReducer(state = initialState, action) {
switch (action.type) {

case LOAD_SPOTS: {
  const newState = {};
  if (Array.isArray(action.spots)) {
    action.spots.forEach(spot => {
      newState[spot.id] = spot;
    });
  }
  return newState;
}

case ADD_SPOT:
case UPDATE_SPOT: {
    return {
...state,
[action.spot.id]: action.spot,
};
  }

case REMOVE_SPOT: {
const newState = { ...state };
delete newState[action.spotId];
return newState;
}
default:
return state;
}
}