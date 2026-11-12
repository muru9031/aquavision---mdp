// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getDashboardStats, getWells, getWellForecast, getWellShap } from '../api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Droplet, TrendingDown, Activity, AlertCircle, AlertTriangle, CheckCircle, Bell, Loader2 } from 'lucide-react';

const getMarkerColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'SAFE': return '#10b981';
    case 'VULNERABLE': return '#eab308';
    case 'CRITICAL': return '#ef4444';
    default: return '#3b82f6';
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [wells, setWells] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [shapData, setShapData] = useState([]);
  const [selectedWellId, setSelectedWellId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, wellsRes, forecastRes, shapRes] = await Promise.all([
        getDashboardStats(),
        getWells(),
        getWellForecast(selectedWellId),
        getWellShap(selectedWellId),
      ]);

      setStats(statsRes);
      setWells(wellsRes);
      setForecastData(forecastRes);
      setShapData(shapRes);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to connect to Spring Boot backend (:8080). Please ensure Spring Boot is running and MySQL has data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedWellId]);

  if (loading && !stats) {
    return (
      <div className="flex h-full items-center justify-center p-12 text-sky-600">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="font-semibold text-lg">Loading real-time data from Spring Boot...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
          <button 
            onClick={loadData}
            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 mr-4 border border-blue-100">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Monitoring Wells</p>
            <h3 className="text-3xl font-bold text-slate-800">
              {stats?.totalWells ?? 0}
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-4 rounded-2xl bg-cyan-50 text-cyan-600 mr-4 border border-cyan-100">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Avg Depth to Water</p>
            <h3 className="text-3xl font-bold text-slate-800">
              {stats?.avgDepthToWater ?? stats?.averageDepth ?? 0} <span className="text-lg text-slate-500 font-normal">m</span>
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="p-4 rounded-2xl bg-teal-50 text-teal-600 mr-4 border border-teal-100">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Groundwater Health Index</p>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold text-slate-800">
                {stats?.ghiScore ?? 0}<span className="text-lg text-slate-500 font-normal">/100</span>
              </h3>
              <span className="ml-3 mb-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {stats?.ghiLabel ?? stats?.ghiStatus ?? 'Good'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Widget 1: GIS Risk Map */}
        <div className="glass-card bg-white rounded-2xl shadow-sm border border-slate-100 p-0 flex flex-col h-[400px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              GIS Risk Map
              <span className="ml-2 text-xs font-normal text-slate-400">({wells.length} wells)</span>
            </h3>
            <div className="flex space-x-3 text-xs font-medium">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />Safe</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5" />Vulnerable</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5" />Critical</span>
            </div>
          </div>

          <div className="flex-1 relative z-0">
            <MapContainer center={[34.05, -118.25]} zoom={10} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {wells.map((well) => (
                <CircleMarker
                  key={well.id}
                  center={[well.latitude, well.longitude]}
                  radius={well.id === selectedWellId ? 11 : 8}
                  pathOptions={{
                    color: getMarkerColor(well.status),
                    fillColor: getMarkerColor(well.status),
                    fillOpacity: 0.8,
                    weight: well.id === selectedWellId ? 3 : 1
                  }}
                  eventHandlers={{
                    click: () => setSelectedWellId(well.id)
                  }}
                >
                  <Popup>
                    <strong>{well.name}</strong><br />
                    Zone: {well.zone}<br />
                    Depth: {well.currentLevel} m<br />
                    Status: <span className="font-semibold">{well.status}</span>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Widget 2: Predictive Forecasting */}
        <div className="glass-card bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Groundwater Level Trend</h3>
              <p className="text-xs text-slate-400">Past vs Future (Well #{selectedWellId})</p>
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold rounded-full shadow-sm">
              Hybrid LSTM-XGBoost
            </span>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis reversed axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => val != null ? [`${val} m`, ''] : [null]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="level" name="Historical Depth" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="predicted" name="Forecasted Depth" stroke="#f43f5e" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget 3: SHAP Feature Importance */}
        <div className="glass-card bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col h-[350px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Feature Importance</h3>
          <p className="text-xs text-slate-400 mb-6">Why is water depleting? (SHAP Values)</p>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={shapData} margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} width={140} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [`${Number(val).toFixed(1)}%`, 'Impact']}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={28}>
                  {shapData.map((_, i) => (
                    <Cell key={i} fill={['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'][i % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget 4: AI Recommendations */}
        <div className="glass-card bg-white rounded-2xl shadow-sm border border-slate-100 p-0 flex flex-col h-[350px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-white/50">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-sky-500" />
              AI Actionable Recommendations
            </h3>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start">
              <div className="p-2 bg-red-100 rounded-lg text-red-600 mr-4 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900 mb-1">Critical Alert in Zone A</h4>
                <p className="text-xs text-red-700/80 leading-relaxed">
                  Enforce 20% extraction cut immediately. Groundwater levels forecasted to drop below safe threshold within 30 days.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 flex items-start">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 mr-4 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-yellow-900 mb-1">Warning in Zone B</h4>
                <p className="text-xs text-yellow-700/80 leading-relaxed">
                  Industrial extraction has peaked. Recommend scheduling an inspection of primary borewells next week.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 mr-4 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900 mb-1">Safe in Zone C</h4>
                <p className="text-xs text-emerald-700/80 leading-relaxed">
                  Recharge rates are optimal. Continue normal agricultural planning and current extraction quotas.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

