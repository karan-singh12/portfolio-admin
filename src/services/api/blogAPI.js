import axiosInstance from './axiosInstance';

export const blogAPI = {
  getAll: (params) =>
    axiosInstance.get('/blogs', { params }),
  
  getById: (id) =>
    axiosInstance.get(`/blogs/${id}`),
  
  create: (data) =>
    axiosInstance.post('/blogs', data),
  
  update: (id, data) =>
    axiosInstance.put(`/blogs/${id}`, data),
  
  delete: (id) =>
    axiosInstance.delete(`/blogs/${id}`),
  
  changeStatus: (id, status) =>
    axiosInstance.patch(`/blogs/${id}/status`, { status }),
};
