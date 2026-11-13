// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const getDashboardStats = () => API.get('/dashboard/stats').then(res => res.data);
export const getWells = () => API.get('/wells').then(res => res.data);
export const getLiveWellStatus = () => API.get('/wells/current').then(res => res.data);
export const getPredictedWellStatus = () => API.get('/wells/predictions').then(res => res.data);
export const getWellForecast = (wellId = 1) => API.get(`/wells/${wellId}/forecast`).then(res => res.data);
export const getWellShap = (wellId = 1) => API.get(`/wells/${wellId}/shap`).then(res => res.data);
export const getRainfallCorrelation = (wellId = 1) => API.get(`/analytics/correlation/${wellId}`).then(res => res.data);
export const askChatbot = (query) => API.post('/chat/ask', { query }).then(res => res.data);

export default API;
