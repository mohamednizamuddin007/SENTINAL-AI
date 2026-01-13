import React from 'react';
import { AppView } from '../types';
import { ShieldAlert, LayoutDashboard, ScanLine, Settings, Bot, Info } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.SCANNER, label: 'Deep Scan', icon: ScanLine },
    { id: AppView.ADVISOR, label: 'AI Advisor', icon: Bot },
    { id: AppView.ABOUT, label: 'About Platform', icon: Info },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300">
      <div className="p-6 flex items-center gap-3 text-emerald-400">
        <ShieldAlert size={32} />
        <span className="text-xl font-bold tracking-wider hidden md:block text-white">SENTINEL<span className="text-emerald-500">AI</span></span>
      </div>

      <div className="flex-1 py-6">
        <nav className="space-y-2 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentView === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} />
              <span className="hidden md:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 font-mono hidden md:block">
            SYSTEM STATUS:
            <span className="text-emerald-400 block mt-1">● ONLINE</span>
          </p>
          <div className="md:hidden w-2 h-2 rounded-full bg-emerald-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;