import Cookies from 'js-cookie';
const SET_CSRF_TOKEN = 'csrf/SET_CSRF_TOKEN';

export const setCsrfToken = (token) => ({
  type: SET_CSRF_TOKEN,
  token,
});

export const restoreCSRF = () => async (dispatch) => {
  const res = await fetch('/api/csrf/restore');
  const token = Cookies.get('XSRF-TOKEN');
  dispatch(setCsrfToken(token));
  return res;
};

const initialState = {
  token: null,
};

export default function csrfReducer(state = initialState, action) {
switch (action.type) {
  case SET_CSRF_TOKEN:
return { ...state, token: action.token };
default:
return state;
  }
}

export async function csrfFetch(url, options = {}, csrfToken) {
  options.method = options.method || 'GET';
  options.headers = options.headers || {};

if (options.method.toUpperCase() !== 'GET') {
  options.headers['Content-Type'] =
  options.headers['Content-Type'] || 'application/json';
  options.headers['XSRF-Token'] = csrfToken;
}

  const res = await window.fetch(url, options);
  if (res.status >= 400) throw res;
  return res;
}