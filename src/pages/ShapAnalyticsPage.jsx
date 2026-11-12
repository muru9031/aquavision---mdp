// src/pages/ShapAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import { getWellShap, getWells } from '../api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Activity, Loader2, Info } from 'lucide-react';

export default function ShapAnalyticsPage() {
  const [wells, setWells] = useState([]);
  const [selectedWellId, setSelectedWellId] = useState(1);
  const [shapData, setShapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWells().then(res => setWells(res)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getWellShap(selectedWellId)
      .then(res => setShapData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedWellId]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-sky-500" />
            SHAP (Shapley Additive exPlanations) Deep Dive
          </h2>
          <p className="text-xs text-slate-500">Explainable AI feature attribution: understanding exact drivers of aquifer depletion.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-500">Select Well:</label>
          <select 
            value={selectedWellId} 
            onChange={(e) => setSelectedWellId(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
          >
            {wells.map(w => (
              <option key={w.id} value={w.id}>{w.name} ({w.zone})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[420px] flex flex-col">
          <h3 className="text-base font-semibold text-slate-800 mb-2">Feature Importance Distribution</h3>
          <p className="text-xs text-slate-400 mb-6">Percentage contribution to predicted depletion</p>

          <div className="flex-1 w-full min-h-0">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={shapData} margin={{ left: 30, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" unit="%" />
                  <YAxis dataKey="feature" type="category" tick={{ fontSize: 13, fill: '#475569' }} width={160} />
                  <Tooltip formatter={(val) => [`${Number(val).toFixed(1)}%`, 'Impact Factor']} />
                  <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={32}>
                    {shapData.map((_, i) => (
                      <Cell key={i} fill={['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'][i % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
              <Info className="w-4 h-4 mr-2 text-sky-500" />
              Model Attribution Notes
            </h3>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Lack of Rainfall:</strong> Dominant factor during summer months, leading to zero natural percolation and lower water table recharge.
              </p>
              <p>
                <strong>High Industrial Extraction:</strong> Significant drawdown pressure observed in industrial zones, requiring immediate quota enforcement.
              </p>
              <p>
                <strong>Soil Permeability:</strong> Dense clay layers impede deep aquifer replenishment even during brief rain events.
              </p>
            </div>
          </div>

          <div className="p-4 bg-sky-50 rounded-xl text-sky-800 text-xs">
            Model: <strong>Hybrid LSTM-XGBoost</strong> with TreeSHAP analysis running daily on fresh observation vectors.
          </div>
        </div>
      </div>
    </div>
  );
}

