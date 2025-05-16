// frontend/src/store/csrf.js

import Cookies from 'js-cookie';

export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}

export async function csrfFetch(url, options = {}) {
  options.method = options.method || 'GET';
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }

  const baseUrl = import.meta.env.VITE_API_URL || '';
  const res = await window.fetch(`${baseUrl}${url}`, options);

  if (res.status >= 400) throw res;


  return res;
}