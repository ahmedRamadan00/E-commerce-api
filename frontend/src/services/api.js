const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const request = async (method, endpoint, body = null) => {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
};

export const usersAPI = {
  getAll: () => request('GET', '/users'),
  getById: (id) => request('GET', `/users/${id}`),
  create: (data) => request('POST', '/users', data),
  update: (id, data) => request('PUT', `/users/${id}`, data),
  delete: (id) => request('DELETE', `/users/${id}`),
};

export const productsAPI = {
  getAll: () => request('GET', '/products'),
  getById: (id) => request('GET', `/products/${id}`),
  create: (data) => request('POST', '/products', data),
  update: (id, data) => request('PUT', `/products/${id}`, data),
  delete: (id) => request('DELETE', `/products/${id}`),
};

export const ordersAPI = {
  getById: (id) => request('GET', `/orders/${id}`),
  create: (data) => request('POST', '/orders', data),
  update: (id, data) => request('PUT', `/orders/${id}`, data),
  delete: (id) => request('DELETE', `/orders/${id}`),
};
