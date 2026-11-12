// src/pages/GisMapsPage.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getWells } from '../api';
import { Map as MapIcon, Loader2 } from 'lucide-react';

export default function GisMapsPage() {
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWells()
      .then(data => setWells(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <MapIcon className="w-5 h-5 mr-2 text-sky-500" />
            Full GIS Hydrogeological Mapping
          </h2>
          <p className="text-xs text-slate-500">Live spatial distribution and risk categorization of monitoring wells.</p>
        </div>
        <div className="flex space-x-4 text-xs font-semibold">
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" /> Safe</span>
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5" /> Vulnerable</span>
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1.5" /> Critical</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500 mr-2" />
            <span>Loading geospatial well telemetry...</span>
          </div>
        ) : (
          <MapContainer center={[34.05, -118.25]} zoom={11} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {wells.map(well => (
              <CircleMarker
                key={well.id}
                center={[well.latitude, well.longitude]}
                radius={10}
                pathOptions={{
                  color: well.status === 'CRITICAL' ? '#ef4444' : well.status === 'VULNERABLE' ? '#eab308' : '#10b981',
                  fillColor: well.status === 'CRITICAL' ? '#ef4444' : well.status === 'VULNERABLE' ? '#eab308' : '#10b981',
                  fillOpacity: 0.85,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-1">
                    <h4 className="font-bold text-slate-800">{well.name}</h4>
                    <p className="text-xs text-slate-600">Zone: {well.zone}</p>
                    <p className="text-xs text-slate-600">Depth to Water: {well.currentLevel} m</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                      {well.status}
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

