// src/api/aquavisionApi.js
// --------------------------------------------------------------
// Centralised service functions — one function per API endpoint.
// Every component imports from here, never calls axios directly.
// --------------------------------------------------------------
import apiClient from './apiClient';

/** Fetch KPI summary: total wells, avg depth, GHI score */
export const fetchKpis = () =>
  apiClient.get('/kpi').then((res) => res.data);

/** Fetch all well locations for the Leaflet map */
export const fetchWellGeo = () =>
  apiClient.get('/wells/geo').then((res) => res.data);

/**
 * Fetch merged historical + predicted time-series for Recharts.
 * @param {number} wellId - defaults to 1 (primary monitoring well)
 */
export const fetchTimeSeries = (wellId = 1) =>
  apiClient.get(`/timeseries/${wellId}`).then((res) => res.data);

/**
 * Fetch SHAP feature importance list for Recharts horizontal bar chart.
 * @param {number} wellId
 */
export const fetchShapValues = (wellId = 1) =>
  apiClient.get(`/shap/${wellId}`).then((res) => res.data);

