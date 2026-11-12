// src/hooks/useAquaVisionData.js
// --------------------------------------------------------------
// Custom React hook — fetches all dashboard data in parallel.
// Drop this single hook into App.jsx to replace all dummy arrays.
// --------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';
import {
  fetchKpis,
  fetchWellGeo,
  fetchTimeSeries,
  fetchShapValues,
} from '../api/aquavisionApi';

const DEFAULT_WELL_ID = 1;

export function useAquaVisionData() {
  const [kpis,       setKpis]       = useState(null);
  const [wells,      setWells]      = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const [shapData,   setShapData]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiData, wellData, tsData, shapRaw] = await Promise.all([
        fetchKpis(),
        fetchWellGeo(),
        fetchTimeSeries(DEFAULT_WELL_ID),
        fetchShapValues(DEFAULT_WELL_ID),
      ]);
      setKpis(kpiData);
      setWells(wellData);
      setTimeSeries(tsData);
      setShapData(shapRaw);
    } catch (err) {
      setError('Failed to load dashboard data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  return { kpis, wells, timeSeries, shapData, loading, error, reload: loadAll };
}

