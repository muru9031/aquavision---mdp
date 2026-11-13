// src/pages/CurrentAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { getWells, getRainfallCorrelation } from '../api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  CloudRain, 
  PieChart as PieIcon, 
  Loader2, 
  Droplet, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Table,
  Waves
} from 'lucide-react';

const RISK_COLORS = {
  SAFE: '#10b981',
  VULNERABLE: '#eab308',
  CRITICAL: '#ef4444'
};

export default function CurrentAnalytics() {
  const [wells, setWells] = useState([]);
  const [selectedWellId, setSelectedWellId] = useState(1);
  const [correlationData, setCorrelationData] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getWells().then(data => {
      setWells(data);
      const counts = { SAFE: 0, VULNERABLE: 0, CRITICAL: 0 };
      data.forEach(w => {
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
      setError("Failed to fetch Tamil Nadu well telemetry.");
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getRainfallCorrelation(selectedWellId)
      .then(res => {
        if (res && res.length > 0) {
          setCorrelationData(res);
        } else {
          setCorrelationData([]);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch historical precipitation correlation.");
      })
      .finally(() => setLoading(false));
  }, [selectedWellId]);

  const selectedWell = wells.find(w => w.id === selectedWellId) || wells[0];

  if (loading && !wells.length) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-emerald-600">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="font-semibold text-lg">Loading Historical Groundwater Telemetry...</span>
      </div>
    );
  }

  const safeCount = riskDistribution.find(d => d.name === 'Safe')?.value || 0;
  const vulnerableCount = riskDistribution.find(d => d.name === 'Vulnerable')?.value || 0;
  const criticalCount = riskDistribution.find(d => d.name === 'Critical')?.value || 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Header Banner & Well Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Telemetry Mode (MySQL: groundwater_data)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <Waves className="w-6 h-6 text-emerald-600" />
            Historical Hydrological Infiltration & Recharge Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating historical aquifer recharge against surface rainfall for <span className="font-semibold text-slate-700">{selectedWell?.name}</span> ({selectedWell?.zone}).
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Select Basin:</label>
          <select 
            value={selectedWellId} 
            onChange={(e) => setSelectedWellId(Number(e.target.value))}
            className="w-full md:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {wells.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.zone}) — {w.currentStatus || 'SAFE'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards: Current Observed Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Selected Basin Depth</span>
            <Droplet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-2">
            {selectedWell?.currentLevel ? `${selectedWell.currentLevel} m` : '16.5 m'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Recorded water table depth</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Current Basin Status</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
              selectedWell?.currentStatus === 'CRITICAL' 
                ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                : selectedWell?.currentStatus === 'VULNERABLE'
                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}>
              {selectedWell?.currentStatus || 'SAFE'}
            </span>
            <span className="text-xs text-slate-400">Observed</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Hydrogeological vulnerability</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Monitored Basins</span>
            <CheckCircle className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-2">
            {wells.length} Active Stations
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tamil Nadu primary river basins</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>State Vulnerability Split</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-slate-800 mt-2 flex items-center gap-2">
            <span className="text-emerald-600">{safeCount} Safe</span>
            <span>/</span>
            <span className="text-amber-500">{vulnerableCount} Vuln</span>
            <span>/</span>
            <span className="text-rose-500">{criticalCount} Crit</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on live telemetry data</div>
        </div>
      </div>

      {/* Charts Grid: Historical Telemetry ONLY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Precipitation Infiltration vs Aquifer Table (AreaChart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[420px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                Precipitation Infiltration vs Aquifer Table
              </h4>
              <p className="text-xs text-slate-400">
                Evaluating surface recharge lag on groundwater recovery (Past 6 Months from `groundwater_data`)
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
              Rainfall vs Depth
            </span>
          </div>

          <div className="flex-1 w-full min-h-0">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            ) : correlationData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Awaiting Sensor Telemetry Sync...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={correlationData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rainGradCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="depthGradCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="rainfall" 
                    name="Rainfall (mm)" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#rainGradCurrent)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="waterLevel" 
                    name="Depth to Water (m)" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#depthGradCurrent)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* State Basin Vulnerability Distribution (Pie/Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[420px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-500" />
                State Basin Vulnerability Distribution
              </h4>
              <p className="text-xs text-slate-400">
                Proportion of Tamil Nadu monitoring borewells currently in Safe vs Critical conditions
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
              Live Basin Distribution
            </span>
          </div>

          <div className="flex-1 w-full min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgb(0 0 0 / 0.1)' }} 
                  formatter={(val, name) => [`${val} Basins`, name]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Direct Telemetry Audit Ledger for the Selected Basin */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Historical Observation Ledger for {selectedWell?.name}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Source: `groundwater_data` MySQL Table</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Observation Month</th>
                <th className="px-6 py-3.5">Recorded Water Table Depth (m)</th>
                <th className="px-6 py-3.5">Precipitation Volume (mm)</th>
                <th className="px-6 py-3.5">Soil Moisture Saturation</th>
                <th className="px-6 py-3.5">Infiltration Dynamics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {correlationData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3 text-slate-800 font-semibold">{row.date}</td>
                  <td className="px-6 py-3 font-mono font-bold text-slate-700">{row.waterLevel} m</td>
                  <td className="px-6 py-3 text-blue-600 font-semibold">{row.rainfall} mm</td>
                  <td className="px-6 py-3 text-emerald-600">{row.soilMoisture || 25.0}%</td>
                  <td className="px-6 py-3">
                    {row.rainfall > 30 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        High Surface Percolation
                      </span>
                    ) : row.rainfall > 10 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                        Moderate Infiltration
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Sub-surface Drawdown
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {correlationData.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    No historical observation rows found for this basin in MySQL `groundwater_data`.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
