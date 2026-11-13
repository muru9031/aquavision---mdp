// src/pages/CurrentOperations.jsx
import React, { useState, useEffect } from 'react';
import { getDashboardStats, getWells, getRainfallCorrelation } from '../api';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Droplet, TrendingDown, Activity, ShieldCheck, CloudRain, PieChart as PieIcon, Loader2, AlertCircle } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'SAFE': return '#10b981';
    case 'VULNERABLE': return '#eab308';
    case 'CRITICAL': return '#ef4444';
    default: return '#3b82f6';
  }
};

const RISK_COLORS = { SAFE: '#10b981', VULNERABLE: '#eab308', CRITICAL: '#ef4444' };

export default function CurrentOperations() {
  const [stats, setStats] = useState(null);
  const [wells, setWells] = useState([]);
  const [selectedWellId, setSelectedWellId] = useState(1);
  const [correlationData, setCorrelationData] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDashboardStats(),
      getWells(),
      getRainfallCorrelation(selectedWellId)
    ]).then(([statsRes, wellsRes, corrRes]) => {
      setStats(statsRes);
      setWells(wellsRes);
      setCorrelationData(corrRes || []);

      // Calculate Current Observed Risk Distribution
      const counts = { SAFE: 0, VULNERABLE: 0, CRITICAL: 0 };
      wellsRes.forEach(w => {
        const s = (w.currentStatus || 'SAFE').toUpperCase();
        if (counts[s] !== undefined) counts[s]++;
        else counts.SAFE++;
      });
      setRiskDistribution([
        { name: 'Safe', value: counts.SAFE, color: RISK_COLORS.SAFE },
        { name: 'Vulnerable', value: counts.VULNERABLE, color: RISK_COLORS.VULNERABLE },
        { name: 'Critical', value: counts.CRITICAL, color: RISK_COLORS.CRITICAL }
      ]);
    }).catch(err => {
      console.error(err);
      setError("Unable to reach Spring Boot telemetry backend (:8080).");
    }).finally(() => setLoading(false));
  }, [selectedWellId]);

  if (loading && !wells.length) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sky-600">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="font-semibold text-lg">Synchronizing Live Tamil Nadu Telemetry...</span>
      </div>
    );
  }

  const selectedWell = wells.find(w => w.id === selectedWellId) || wells[0];
  const criticalCount = wells.filter(w => (w.currentStatus || '').toUpperCase() === 'CRITICAL').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-6 rounded-2xl text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Operational Monitoring</span>
          </div>
          <h2 className="text-2xl font-bold">Current Groundwater Basin Status</h2>
          <p className="text-xs text-slate-300 mt-1">Live telemetric observations recorded across Tamil Nadu aquifer wells.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-md">
          <label className="text-xs font-bold text-slate-200">Selected Basin:</label>
          <select 
            value={selectedWellId} 
            onChange={(e) => setSelectedWellId(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-lg text-xs font-semibold outline-none"
          >
            {wells.map(w => (
              <option key={w.id} value={w.id}>{w.name} ({w.zone}) - {w.currentStatus}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center">
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 mr-4">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Monitored Basins</p>
            <h3 className="text-2xl font-bold text-slate-800">{wells.length} Active Stations</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center">
          <div className="p-4 rounded-2xl bg-cyan-50 text-cyan-600 mr-4">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Current Avg Depth</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats?.avgDepthToWater ?? 19.6} <span className="text-base text-slate-500 font-normal">m</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 mr-4">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Live Health Index</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats?.ghiScore ?? 70}/100 <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold ml-1">{stats?.ghiLabel ?? 'Moderate'}</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Current Map + Current Depletion Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Current Tamil Nadu GIS Map */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[440px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Tamil Nadu Current Telemetry Map
            </h4>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {criticalCount} Basins in Critical State
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
                  radius={well.id === selectedWellId ? 11 : 8}
                  pathOptions={{
                    color: getStatusColor(well.currentStatus),
                    fillColor: getStatusColor(well.currentStatus),
                    fillOpacity: 0.85,
                    weight: well.id === selectedWellId ? 3 : 1.5
                  }}
                  eventHandlers={{ click: () => setSelectedWellId(well.id) }}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="block font-bold text-slate-900">{well.name}</strong>
                      <p className="text-slate-500">Zone: {well.zone}</p>
                      <p className="text-slate-700 font-semibold">Recorded Depth: {well.currentLevel} m</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        well.currentStatus === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        well.currentStatus === 'VULNERABLE' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        Current Status: {well.currentStatus}
                      </span>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right: Current Recharge & Depletion AreaChart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[440px]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                Historical Precipitation vs Aquifer Table (Past 6 Months)
              </h4>
              <p className="text-xs text-slate-400">Direct correlation of rainfall infiltration on {selectedWell?.name} water levels</p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            {correlationData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Awaiting Sensor Telemetry Sync...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={correlationData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="depthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#3b82f6" fillOpacity={1} fill="url(#rainGrad)" />
                  <Area type="monotone" dataKey="waterLevel" name="Observed Depth (m)" stroke="#06b6d4" fillOpacity={1} fill="url(#depthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Current Vulnerability Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-800">
          Live Basin Telemetry Ledger (Direct from MySQL `groundwater_data`)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5">Station</th>
                <th className="p-3.5">Zone</th>
                <th className="p-3.5">GPS Coordinates</th>
                <th className="p-3.5">Current Recorded Depth</th>
                <th className="p-3.5">Telemetry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wells.map(w => (
                <tr key={w.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-slate-800">{w.name}</td>
                  <td className="p-3.5">{w.zone}</td>
                  <td className="p-3.5 font-mono text-[11px]">{w.latitude?.toFixed(4)}, {w.longitude?.toFixed(4)}</td>
                  <td className="p-3.5 font-bold text-slate-900">{w.currentLevel} m</td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      w.currentStatus === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      w.currentStatus === 'VULNERABLE' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {w.currentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

