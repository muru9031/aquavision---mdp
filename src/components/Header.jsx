// src/components/Header.jsx
import React from 'react';
import { Search, Bell, User, RefreshCw } from 'lucide-react';

export default function Header({ onRefresh, title = "Intelligence Terminal" }) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
      <h1 className="text-lg font-semibold text-slate-800 hidden md:block">
        {title}
      </h1>

      <div className="flex items-center space-x-6 flex-1 justify-end">
        <div className="relative max-w-md w-full hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search zones, wells, or reports…"
            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-sky-400 transition-all"
          />
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh live data"
            className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}

        <button className="relative p-2 text-slate-400 hover:text-sky-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-3 font-semibold">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700">Admin Profile</p>
            <p className="text-xs text-slate-500">Hydrogeologist</p>
          </div>
        </div>
      </div>
    </header>
  );
}

