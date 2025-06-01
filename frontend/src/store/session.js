//import { csrfFetch } from './csrf';
import { restoreCSRF } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";


const setUser = (user) => {
return {
  type: SET_USER,
    payload: user
  };
};

const removeUser = () => ({
  type: REMOVE_USER,
});

export const signup = (user) => async (dispatch, getState) => {
  const csrfToken = getState().csrf.token;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user)
  }, csrfToken);

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    await dispatch(restoreCSRF());
    return data.user;
  } else {
    const errors = await response.json();
    throw errors;
  }
};

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

export const login = (user) => async (dispatch, getState) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  }, getState().csrf.token);

if (response.ok) {
  const data = await response.json();
  dispatch(setUser(data.user));
  await dispatch(restoreCSRF());
  return data.user;
} else {
    const errors = await response.json();
    throw errors;
    }
};


export const logout = () => async (dispatch, getState) => {
const csrfToken = getState().csrf.token;
await csrfFetch('/api/session', {
  method: 'DELETE'
  
}, csrfToken);
 dispatch(removeUser());
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
