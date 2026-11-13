// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ModeProvider } from './context/ModeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MLChatbot from './components/MLChatbot';

// Page Views
import CurrentOperations from './pages/CurrentOperations';
import PredictiveIntelligence from './pages/PredictiveIntelligence';
import CurrentAnalytics from './pages/CurrentAnalytics';
import PredictiveAnalytics from './pages/PredictiveAnalytics';
import CurrentMapFull from './pages/CurrentMapFull';
import PredictionMapFull from './pages/PredictionMapFull';
import ShapAnalyticsPage from './pages/ShapAnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {/* Dynamic Mode-Sensitive Sidebar */}
      <Sidebar />

      {/* Main Screen Body */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header with Master Mode Switcher Toggle */}
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* Default Route redirects to Current Dashboard */}
            <Route path="/" element={<Navigate to="/current/dashboard" replace />} />

            {/* ── CURRENT MODE ROUTES ── */}
            <Route path="/current" element={<Navigate to="/current/dashboard" replace />} />
            <Route path="/current/dashboard" element={<CurrentOperations />} />
            <Route path="/current/map" element={<CurrentMapFull />} />
            <Route path="/current/analytics" element={<CurrentAnalytics />} />
            <Route path="/current/shap" element={<ShapAnalyticsPage />} />
            <Route path="/current/reports" element={<ReportsPage />} />

            {/* ── PREDICTION MODE ROUTES ── */}
            <Route path="/prediction" element={<Navigate to="/prediction/dashboard" replace />} />
            <Route path="/prediction/dashboard" element={<PredictiveIntelligence />} />
            <Route path="/prediction/map" element={<PredictionMapFull />} />
            <Route path="/prediction/analytics" element={<PredictiveAnalytics />} />
            <Route path="/prediction/shap" element={<ShapAnalyticsPage />} />

            {/* Common */}
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      {/* Floating ML Chatbot */}
      <MLChatbot />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ModeProvider>
        <AppLayout />
      </ModeProvider>
    </BrowserRouter>
  );
}
