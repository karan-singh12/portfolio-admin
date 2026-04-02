import axiosInstance from './axiosInstance';

export const authAPI = {
  login: (credentials) =>
    axiosInstance.post('/auth/login', credentials),
  
  logout: () =>
    axiosInstance.post('/auth/logout'),
  
  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh', { refreshToken }),
  
  forgotPassword: (email) =>
    axiosInstance.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, password) =>
    axiosInstance.post('/auth/reset-password', { token, password }),
  
  changePassword: (oldPassword, newPassword) =>
    axiosInstance.post('/auth/change-password', {
      oldPassword,
      newPassword,
    }),
};

