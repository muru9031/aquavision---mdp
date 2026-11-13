// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  BarChart3, 
  Activity, 
  FileText, 
  Droplet,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { mode, switchMode } = useMode();

  // Menu items for CURRENT mode
  const currentMenus = [
    { path: '/current/dashboard', label: 'Current Dashboard', icon: LayoutDashboard },
    { path: '/current/map', label: 'Live GIS Basin Map', icon: MapIcon },
    { path: '/current/analytics', label: 'Historical Infiltration', icon: BarChart3 },
    { path: '/current/shap', label: 'Observed Depletion SHAP', icon: Activity },
    { path: '/current/reports', label: 'Basin Audit Reports', icon: FileText },
  ];

  // Menu items for PREDICTION mode
  const predictionMenus = [
    { path: '/prediction/dashboard', label: 'Forecast Dashboard', icon: LayoutDashboard },
    { path: '/prediction/map', label: '6-Month Risk Map', icon: MapIcon },
    { path: '/prediction/analytics', label: 'Future Trend Analytics', icon: BarChart3 },
    { path: '/prediction/shap', label: 'Predictive SHAP Model', icon: Sparkles },
  ];

  const activeMenus = mode === 'prediction' ? predictionMenus : currentMenus;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 shrink-0">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <Droplet className="text-teal-400 w-6 h-6 mr-3" />
        <span className="text-xl font-bold text-white tracking-wide">
          AquaVision <span className="text-teal-400">AI</span>
        </span>
      </div>

      {/* Mode Switcher in Sidebar */}
      <div className="p-3 border-b border-slate-800">
        <div className="bg-slate-950 p-1 rounded-xl flex gap-1 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => switchMode('current')}
            className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'current'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Current</span>
          </button>

          <button
            onClick={() => switchMode('prediction')}
            className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'prediction'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Prediction</span>
          </button>
        </div>
      </div>

      {/* Dynamic Sub-Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>{mode === 'prediction' ? '🔮 Prediction Modules' : '📡 Current Operations'}</span>
        </div>

        {activeMenus.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-150 text-xs ${
                isActive
                  ? mode === 'prediction'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`
            }
          >
            <item.icon className="w-4 h-4 mr-2.5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mode Status Footer */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${mode === 'prediction' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
          {mode === 'prediction' ? 'Prediction Mode Active' : 'Current Mode Active'}
        </span>
        <span className="font-mono text-[10px] text-slate-500">v2.2</span>
      </div>

    </aside>
  );
}
