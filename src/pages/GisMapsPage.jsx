// src/pages/GisMapsPage.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getWells } from '../api';
import { useMode } from '../context/ModeContext';
import { Map as MapIcon, Loader2, ShieldCheck, Clock } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'SAFE': return '#10b981';
    case 'VULNERABLE': return '#eab308';
    case 'CRITICAL': return '#ef4444';
    default: return '#3b82f6';
  }
};

export default function GisMapsPage() {
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useMode();

  useEffect(() => {
    getWells()
      .then(data => setWells(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isPrediction = mode === 'prediction';

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {isPrediction ? <Clock className="w-5 h-5 text-indigo-600" /> : <ShieldCheck className="w-5 h-5 text-emerald-600" />}
            {isPrediction ? '6-Month Predicted GIS Hydrogeological Risk Map' : 'Current Tamil Nadu GIS Basin Telemetry Map'}
          </h2>
          <p className="text-xs text-slate-500">
            {isPrediction 
              ? 'Basin markers colored strictly according to Hybrid LSTM-XGBoost 6-month forecasted depletion.' 
              : 'Basin markers colored strictly according to real-time recorded sensor water levels.'}
          </p>
        </div>
        <div className="flex space-x-4 text-xs font-semibold">
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" /> Safe</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5" /> Vulnerable</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5" /> Critical</span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
        {loading ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500 mr-2" />
            <span>Loading Tamil Nadu GIS telemetry...</span>
          </div>
        ) : (
          <MapContainer center={[11.1271, 78.6569]} zoom={7} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {wells.map(well => {
              const status = isPrediction ? (well.predictedStatus || well.currentStatus) : well.currentStatus;
              const depth = isPrediction ? well.predictedLevel : well.currentLevel;

              return (
                <CircleMarker
                  key={well.id}
                  center={[well.latitude, well.longitude]}
                  radius={10}
                  pathOptions={{
                    color: getStatusColor(status),
                    fillColor: getStatusColor(status),
                    fillOpacity: 0.85,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <h4 className="font-bold text-slate-800">{well.name}</h4>
                      <p className="text-slate-500">Zone: {well.zone}</p>
                      <p className="text-slate-800 font-semibold">
                        {isPrediction ? 'Predicted Depth (6-Mo):' : 'Current Depth:'} {depth} m
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        status === 'VULNERABLE' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isPrediction ? `Forecast: ${status}` : `Current: ${status}`}
                      </span>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
