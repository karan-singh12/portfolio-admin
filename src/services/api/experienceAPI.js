import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../../config/constants';

const experienceAPI = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.EXPERIENCE.ROOT, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.EXPERIENCE.ROOT}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.EXPERIENCE.ROOT, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.EXPERIENCE.ROOT}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.EXPERIENCE.ROOT}/${id}`),
  changeStatus: (id, status) => axiosInstance.patch(`${API_ENDPOINTS.EXPERIENCE.ROOT}/${id}/status`, { status }),
};

export default experienceAPI;
