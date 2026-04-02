import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, APP_FLAGS } from '@/config/constants';
import { mockDelay } from '@/utils/mockData';

// Single Axios instance for the entire app
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token on each request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle token refresh and global errors
let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  pendingRequests = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Try token refresh on 401 once
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          API_ENDPOINTS.AUTH.REFRESH,
          { refreshToken },
          { baseURL: API_BASE_URL }
        );

        const { token: newToken } = refreshResponse.data || {};
        if (newToken) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }

        processQueue(new Error('No token in refresh response'), null);
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth storage on hard failure
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Mock response helper
const mockResponse = (data, delay = 500) => {
  return mockDelay(delay).then(() => ({
    data,
    status: 200,
    statusText: 'OK',
  }));
};

// Grouped API services with mock mode support
export const AllServices = {
  auth: {
    login: payload => {
      if (APP_FLAGS.ENABLE_MOCK_API) {
        return mockResponse({ token: 'mock_token', user: { id: 1, name: 'Admin', role: 'super_admin' } });
      }
      return api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
    },
    logout: () => {
      if (APP_FLAGS.ENABLE_MOCK_API) return mockResponse({ success: true });
      return api.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
    refresh: refreshToken => {
      if (APP_FLAGS.ENABLE_MOCK_API) return mockResponse({ token: 'new_mock_token' });
      return api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    },
    forgotPassword: email => {
      if (APP_FLAGS.ENABLE_MOCK_API) return mockResponse({ message: 'Password reset link sent' });
      return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    },
    updateProfile: payload => {
      if (APP_FLAGS.ENABLE_MOCK_API) return mockResponse({ success: true, user: MOCK_USER.user });
      return api.post(API_ENDPOINTS.AUTH.UPDATE_PROFILE, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  },

  dashboard: {
    getOverview: params => {
      // Return the data object directly as the component expects it
      return api.get('/admin/dashboard/overview', { params })
        .then(res => res.data.data);
    },
  },

  blogs: {
    list: (params = {}) => {
      return api.post('/admin/blog/getAllBlogs', {
        pageNumber: params.page || 1,
        pageSize: params.pageSize || 10,
        searchItem: params.search || '',
        status: params.status,
      }).then(res => ({
        data: {
          data: (res.data.data.result || []).map(item => ({ ...item, id: item._id })),
          total: res.data.data.totalRecords || 0
        }
      }));
    },
    getById: id => api.get(`/admin/blog/getOneBlog/${id}`).then(res => ({ data: { ...res.data.data, id: res.data.data._id } })),
    create: data => api.post('/admin/blog/addBlog', data),
    update: (id, data) => api.post('/admin/blog/updateBlog', { ...data, id }),
    remove: id => api.post('/admin/blog/deleteBlogs', { ids: [id] }),
    changeStatus: (id, status) => api.post('/admin/blog/changeBlogStatus', { id, status }),
  },

  dsa: {
    list: (params = {}) => {
      return api.post('/admin/dsa/getAllDsa', {
        pageNumber: params.page || 1,
        pageSize: params.pageSize || 10,
        searchItem: params.search || '',
        status: params.status,
      }).then(res => ({
        data: {
          data: (res.data.data.result || []).map(item => ({ ...item, id: item._id })),
          total: res.data.data.totalRecords || 0
        }
      }));
    },
    getById: id => api.get(`/admin/dsa/getOneDsa/${id}`).then(res => ({ data: { ...res.data.data, id: res.data.data._id } })),
    create: data => api.post('/admin/dsa/addDsa', data),
    update: (id, data) => api.post('/admin/dsa/updateDsa', { ...data, id }),
    remove: id => api.post('/admin/dsa/deleteDsa', { ids: [id] }),
  },

  experience: {
    list: (params = {}) => {
      return api.post('/admin/experience/getAllExperience', {
        pageNumber: params.page || 1,
        pageSize: params.pageSize || 10,
        searchItem: params.search || '',
        status: params.status,
      }).then(res => ({
        data: {
          data: (res.data.data.result || []).map(item => ({ ...item, id: item._id })),
          total: res.data.data.totalRecords || 0
        }
      }));
    },
    getById: id => api.get(`/admin/experience/getOneExperience/${id}`).then(res => ({ data: { ...res.data.data, id: res.data.data._id } })),
    create: data => api.post('/admin/experience/addExperience', data),
    update: (id, data) => api.post('/admin/experience/updateExperience', { ...data, id }),
    remove: id => api.post('/admin/experience/deleteExperience', { ids: [id] }),
  },
};

export default AllServices;


