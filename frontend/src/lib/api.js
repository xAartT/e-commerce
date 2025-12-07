import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  deleteAccount: () => api.delete('/auth/account'),
  deactivateAccount: () => api.post('/auth/deactivate'),
};

export const productsAPI = {
  list: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  bulkCreate: (products) => api.post('/products/bulk', { products }),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/seller/my-products'),
};

export const favoritesAPI = {
  list: () => api.get('/products/favorites/list'),
  add: (productId) => api.post(`/products/${productId}/favorite`),
  remove: (productId) => api.delete(`/products/${productId}/favorite`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.post('/cart/clear'),
};

export const ordersAPI = {
  create: () => api.post('/orders'),
  list: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
};

export const sellerAPI = {
  getDashboard: () => api.get('/seller/dashboard'),
};

export default api;