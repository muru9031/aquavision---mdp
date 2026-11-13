// src/components/Header.jsx
import React from 'react';
import { Search, Bell, User, RefreshCw, ShieldCheck, Clock } from 'lucide-react';
import { useMode } from '../context/ModeContext';

export default function Header({ onRefresh }) {
  const { mode, switchMode } = useMode();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
      
      {/* Left: Master Mode Switcher Tabs */}
      <div className="flex items-center gap-2">
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 text-xs font-bold shadow-inner">
          <button
            onClick={() => switchMode('current')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              mode === 'current'
                ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>📡 Current Live Status</span>
          </button>

          <button
            onClick={() => switchMode('prediction')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              mode === 'prediction'
                ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-200" />
            <span>🔮 ML Prediction Forecast</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        <div className="relative max-w-xs w-full hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Tamil Nadu basins..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 rounded-full text-xs outline-none focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh live data"
            className="p-2 text-slate-400 hover:text-sky-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        <button className="relative p-2 text-slate-400 hover:text-sky-600 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-2.5 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-700">Hydrogeologist Admin</p>
            <p className="text-[10px] text-slate-400">Tamil Nadu Basin Authority</p>
          </div>
        </div>
      </div>
    </header>
  );
}
