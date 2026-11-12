// src/pages/SettingsPage.jsx
import React from 'react';
import { Settings, Bell, Database, Cpu } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-sky-500" />
          System & Telemetry Settings
        </h2>
        <p className="text-xs text-slate-500">Configure alert thresholds, ML model synchronization, and database connectivity.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 flex items-center mb-3">
            <Bell className="w-4 h-4 mr-2 text-sky-500" />
            Alert Thresholds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="font-semibold block text-slate-700 mb-1">Critical Water Level Threshold</label>
              <input type="text" defaultValue="20.0 meters" className="w-full bg-white p-2 rounded border border-slate-200 outline-none" />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="font-semibold block text-slate-700 mb-1">Vulnerable Water Level Threshold</label>
              <input type="text" defaultValue="18.0 meters" className="w-full bg-white p-2 rounded border border-slate-200 outline-none" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center mb-3">
            <Database className="w-4 h-4 mr-2 text-sky-500" />
            Spring Boot Backend Status
          </h3>
          <p className="text-xs text-slate-500 mb-3">Target API Endpoint: <code>http://localhost:8080/api</code></p>
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold inline-block">
            ● Connected to MySQL (`aquavision_db`)
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center mb-3">
            <Cpu className="w-4 h-4 mr-2 text-sky-500" />
            Machine Learning Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Model: <strong>Hybrid LSTM-XGBoost</strong> with Daily SHAP Attribution.
          </p>
        </div>
      </div>
    </div>
  );
}

