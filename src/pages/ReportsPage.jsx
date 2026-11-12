// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { getWells, getDashboardStats } from '../api';
import { FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
  const [wells, setWells] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([getWells(), getDashboardStats()])
      .then(([w, s]) => {
        setWells(w);
        setStats(s);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-sky-500" />
            Groundwater Intelligence Reports
          </h2>
          <p className="text-xs text-slate-500">Automated audit summaries and well performance analytics.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center text-xs bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF / Print
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-semibold text-slate-800">
          Monitoring Wells Audit Ledger
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Well Name</th>
                <th className="p-4">Zone</th>
                <th className="p-4">Latitude / Longitude</th>
                <th className="p-4">Depth to Water</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wells.map((well) => (
                <tr key={well.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono text-xs">{well.id}</td>
                  <td className="p-4 font-medium text-slate-800">{well.name}</td>
                  <td className="p-4">{well.zone}</td>
                  <td className="p-4 text-xs font-mono">{well.latitude?.toFixed(4)}, {well.longitude?.toFixed(4)}</td>
                  <td className="p-4 font-semibold text-slate-800">{well.currentLevel} m</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      well.status === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      well.status === 'VULNERABLE' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {well.status}
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

