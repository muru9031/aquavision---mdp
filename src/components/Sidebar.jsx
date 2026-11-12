// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Activity, 
  FileText, 
  Settings, 
  Droplet 
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/gis', label: 'GIS Maps', icon: MapIcon },
  { path: '/shap', label: 'SHAP Analytics', icon: Activity },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <Droplet className="text-teal-400 w-6 h-6 mr-3" />
        <span className="text-xl font-bold text-white tracking-wide">
          AquaVision <span className="text-teal-400">AI</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-sky-600/20 text-teal-400 border border-teal-500/30 shadow-sm font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500 text-center">
        v2.0.0 · Spring Boot + MySQL
      </div>
    </aside>
  );
}

