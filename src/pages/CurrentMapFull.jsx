// src/pages/CurrentMapFull.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getLiveWellStatus } from '../api';
import { ShieldCheck, Loader2, AlertCircle, Droplet, Radio } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'SAFE': return '#10b981';
    case 'VULNERABLE': return '#eab308';
    case 'CRITICAL': return '#ef4444';
    default: return '#10b981';
  }
};

export default function CurrentMapFull() {
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWell, setSelectedWell] = useState(null);

  useEffect(() => {
    setLoading(true);
    getLiveWellStatus()
      .then(data => {
        setWells(data || []);
        if (data && data.length > 0) setSelectedWell(data[0]);
      })
      .catch(err => {
        console.error(err);
        setError("Unable to connect to live telemetry endpoint (:8080/api/wells/current).");
      })
      .finally(() => setLoading(false));
  }, []);

  const safeCount = wells.filter(w => (w.status || '').toUpperCase() === 'SAFE').length;
  const vulnerableCount = wells.filter(w => (w.status || '').toUpperCase() === 'VULNERABLE').length;
  const criticalCount = wells.filter(w => (w.status || '').toUpperCase() === 'CRITICAL').length;

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4 max-w-7xl mx-auto">
      
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 shrink-0">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Header Info Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              LIVE TELEMETRY GIS (MySQL: groundwater_data)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Tamil Nadu Real-Time Hydrological Basin Map
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Markers display real-time observed water table levels from in-situ telemetry borewells.
          </p>
        </div>

        {/* Status Count Legend Pill */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs font-semibold">
          <span className="flex items-center px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>
            {safeCount} Safe
          </span>
          <span className="flex items-center px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span>
            {vulnerableCount} Vulnerable
          </span>
          <span className="flex items-center px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5"></span>
            {criticalCount} Critical
          </span>
        </div>
      </div>

      {/* Full-Screen Map Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden relative min-h-[450px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-3" />
            <span className="font-semibold text-sm">Streaming Live Basin Telemetry...</span>
          </div>
        ) : (
          <MapContainer center={[11.1271, 78.6569]} zoom={7.2} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {wells.map(well => {
              const status = (well.status || 'SAFE').toUpperCase();
              const isSelected = selectedWell?.id === well.id;

              return (
                <CircleMarker
                  key={well.id}
                  center={[well.latitude, well.longitude]}
                  radius={isSelected ? 13 : 9}
                  pathOptions={{
                    color: getStatusColor(status),
                    fillColor: getStatusColor(status),
                    fillOpacity: 0.85,
                    weight: isSelected ? 3.5 : 2
                  }}
                  eventHandlers={{ click: () => setSelectedWell(well) }}
                >
                  <Popup>
                    <div className="p-1.5 text-xs min-w-[190px]">
                      <div className="flex items-center gap-1.5 mb-1 font-bold text-slate-900 text-sm">
                        <Droplet className="w-4 h-4 text-emerald-600" />
                        {well.name}
                      </div>
                      <p className="text-slate-500 font-medium">Zone: {well.zone}</p>
                      <p className="text-slate-800 font-semibold mt-1">
                        Current Depth: <span className="text-emerald-700 font-bold">{well.currentLevel} m</span>
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-medium">Telemetry Status:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          status === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          status === 'VULNERABLE' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                          'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {status}
                        </span>
                      </div>
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
