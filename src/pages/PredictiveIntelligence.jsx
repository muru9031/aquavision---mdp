// src/pages/PredictiveIntelligence.jsx
import React, { useState, useEffect } from 'react';
import { getPredictedWellStatus, getWellForecast, getWellShap } from '../api';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { Clock, TrendingDown, Sparkles, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'SAFE': return '#10b981';
    case 'VULNERABLE': return '#eab308';
    case 'CRITICAL': return '#ef4444';
    default: return '#3b82f6';
  }
};

export default function PredictiveIntelligence() {
  const [wells, setWells] = useState([]);
  const [selectedWellId, setSelectedWellId] = useState(1);
  const [forecastData, setForecastData] = useState([]);
  const [shapData, setShapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPredictedWellStatus().then(data => setWells(data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getWellForecast(selectedWellId),
      getWellShap(selectedWellId)
    ]).then(([forecastRes, shapRes]) => {
      setForecastData(forecastRes || []);
      setShapData(shapRes || []);
    }).catch(err => {
      console.error(err);
      setError("Unable to retrieve model predictions from Spring Boot backend (:8080).");
    }).finally(() => setLoading(false));
  }, [selectedWellId]);

  if (loading && !forecastData.length) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sky-600">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="font-semibold text-lg">Running Machine Learning Forecasting Inference...</span>
      </div>
    );
  }

  const selectedWell = wells.find(w => w.id === selectedWellId) || wells[0];
  const predictedCriticalCount = wells.filter(w => (w.predictedStatus || '').toUpperCase() === 'CRITICAL').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Predictive Outlook</span>
          </div>
          <h2 className="text-2xl font-bold">6-Month Aquifer Depletion Forecast</h2>
          <p className="text-xs text-slate-300 mt-1">Hybrid LSTM-XGBoost machine learning projection and TreeSHAP attribution.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-md">
          <label className="text-xs font-bold text-slate-200">Selected Basin:</label>
          <select 
            value={selectedWellId} 
            onChange={(e) => setSelectedWellId(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-lg text-xs font-semibold outline-none"
          >
            {wells.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.zone}) - Projected: {w.predictedStatus}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: 6-Month Predictive Map + LSTM-XGBoost Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: 6-Month Predicted Depletion Map */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[440px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/40">
            <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              6-Month Predicted Risk Map (Tamil Nadu)
            </h4>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
              {predictedCriticalCount} Basins Predicted Critical
            </span>
          </div>

          <div className="flex-1 relative z-0">
            <MapContainer center={[11.1271, 78.6569]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {wells.map((well) => (
                <CircleMarker
                  key={well.id}
                  center={[well.latitude, well.longitude]}
                  radius={well.id === selectedWellId ? 11 : 9}
                  pathOptions={{
                    color: getStatusColor(well.predictedStatus),
                    fillColor: getStatusColor(well.predictedStatus),
                    fillOpacity: 0.85,
                    weight: well.id === selectedWellId ? 3 : 1.5
                  }}
                  eventHandlers={{ click: () => setSelectedWellId(well.id) }}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="block font-bold text-slate-900">{well.name}</strong>
                      <p className="text-slate-500">Zone: {well.zone}</p>
                      <p className="text-indigo-900 font-bold">Predicted Depth: {well.predictedLevel} m</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        well.predictedStatus === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        well.predictedStatus === 'VULNERABLE' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        Forecast: {well.predictedStatus}
                      </span>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right: Continuous LSTM-XGBoost LineChart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[440px]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-indigo-600" />
                Continuous Level Projection ({selectedWell?.name})
              </h4>
              <p className="text-xs text-slate-400">Solid Blue = Historical Telemetry | Dashed Red = 6-Month Model Prediction</p>
            </div>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
              LSTM-XGBoost
            </span>
          </div>

          <div className="flex-1 w-full min-h-0">
            {forecastData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Awaiting Model Inference Output...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis reversed tick={{ fill: '#64748b', fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgb(0 0 0 / 0.1)' }}
                    formatter={(val) => val != null ? [`${val} m`, 'Water Depth'] : [null]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="historicalDepth" name="Observed Depth" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="predictedDepth" name="Predicted Future Depth" stroke="#f43f5e" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Bottom: SHAP Feature Attribution for Selected Well */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              SHAP Explainability: Why is {selectedWell?.name} Predicted to Deplete?
            </h4>
            <p className="text-xs text-slate-400">
              Marginal feature attribution percentage computed specifically for this basin from MySQL `predictions`.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
            TreeSHAP
          </span>
        </div>

        <div className="h-[280px] w-full">
          {shapData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Awaiting SHAP feature extraction...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={shapData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" unit="%" />
                <YAxis dataKey="feature" type="category" tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} width={180} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [`${Number(val).toFixed(1)}%`, 'Depletion Contribution']}
                />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={26}>
                  {shapData.map((_, i) => (
                    <Cell key={i} fill={['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'][i % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}

