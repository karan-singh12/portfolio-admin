import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../../config/constants';

const dsaAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.DSA.ROOT, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.DSA.ROOT}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.DSA.ROOT, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.DSA.ROOT}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.DSA.ROOT}/${id}`),
  changeStatus: (id, status) => axiosInstance.patch(`${API_ENDPOINTS.DSA.ROOT}/${id}/status`, { status }),
};

export default dsaAPI;
