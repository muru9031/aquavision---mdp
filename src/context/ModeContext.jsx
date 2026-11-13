// src/context/ModeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ModeContext = createContext();

export function ModeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect mode based on path: /current/* or /prediction/*
  const isPrediction = location.pathname.startsWith('/prediction');
  const [mode, setMode] = useState(isPrediction ? 'prediction' : 'current');

  useEffect(() => {
    if (location.pathname.startsWith('/prediction')) {
      setMode('prediction');
    } else if (location.pathname.startsWith('/current')) {
      setMode('current');
    }
  }, [location.pathname]);

  const switchMode = (newMode) => {
    setMode(newMode);
    // Keep the current sub-page (e.g. /analytics -> /prediction/analytics)
    const segments = location.pathname.split('/').filter(Boolean);
    const subPage = segments.length > 1 ? segments[1] : 'dashboard';
    navigate(`/${newMode}/${subPage}`);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, switchMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);

