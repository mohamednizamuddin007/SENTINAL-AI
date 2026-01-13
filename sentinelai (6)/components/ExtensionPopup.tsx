import React, { useState, useEffect } from 'react';
import { ShieldCheck, Globe, AlertTriangle, Settings, Activity, History, ChevronRight, X } from 'lucide-react';

interface ExtensionPopupProps {
  onThreatDetected?: (details: { title: string; message: string; severity: 'high' | 'medium' | 'low' }) => void;
}

const ExtensionPopup: React.FC<ExtensionPopupProps> = ({ onThreatDetected }) => {
  const [status, setStatus] = useState<'scanning' | 'safe' | 'danger'>('scanning');
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    // Simulate an immediate scan upon opening
    const timer = setTimeout(() => {
        setStatus('danger');
        setRiskScore(88);
        
        if (onThreatDetected) {
            onThreatDetected({
                title: "Phishing Blocked",
                message: "Malicious pattern detected on current tab.",
                severity: "high"
            });
        }
    }, 1500);
    return () => clearTimeout(timer);
  }, [onThreatDetected]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
      
      {/* Widget Container - Modeled after iOS/macOS Control Center style */}
      <div className="w-[340px] bg-[#1e1e1e] rounded-[32px] p-5 shadow-2xl border border-white/5 font-sans relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className={`absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none transition-colors duration-1000 ${
            status === 'danger' ? 'bg-rose-900' : status === 'safe' ? 'bg-emerald-900' : 'bg-blue-900'
        } blur-3xl`}></div>

        {/* Top Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ShieldCheck size={16} className={status === 'danger' ? 'text-rose-400' : 'text-emerald-400'} />
                </div>
                <div>
                    <h3 className="text-white text-sm font-bold leading-none">Sentinel</h3>
                    <p className="text-xs text-white/50">Protection Active</p>
                </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Settings size={14} className="text-white/70" />
            </button>
        </div>

        {/* Main Score Card */}
        <div className="bg-black/40 rounded-[24px] p-6 mb-4 flex flex-col items-center justify-center relative backdrop-blur-md border border-white/5">
            {status === 'scanning' ? (
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-blue-400 font-mono text-xs animate-pulse">SCANNING</span>
                 </div>
            ) : (
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path 
                            className={`${status === 'danger' ? 'text-rose-500' : 'text-emerald-500'} drop-shadow-lg transition-all duration-1000 ease-out`} 
                            strokeDasharray={`${riskScore}, 100`} 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold text-white tracking-tighter">{riskScore}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'danger' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {status === 'danger' ? 'RISK' : 'SAFE'}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="mt-4 text-center">
                <p className="text-white text-sm font-medium">ups-delivery-status.com</p>
                <p className="text-white/40 text-xs mt-1">
                    {status === 'scanning' ? 'Analyzing page content...' : 
                     status === 'danger' ? 'Phishing patterns detected' : 'Domain verified safe'}
                </p>
            </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
            <button className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-[20px] flex flex-col items-start gap-2 border border-white/5 group">
                <Globe size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 text-xs font-medium">Site Report</span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-[20px] flex flex-col items-start gap-2 border border-white/5 group">
                <History size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 text-xs font-medium">History</span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-[20px] flex flex-col items-start gap-2 border border-white/5 group col-span-2 flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity size={20} className="text-emerald-400" />
                    <div className="flex flex-col items-start">
                        <span className="text-white/80 text-xs font-medium">Live Monitoring</span>
                        <span className="text-white/40 text-[10px]">Active on 3 tabs</span>
                    </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </button>
        </div>

        {/* Threat Banner (Conditional) */}
        {status === 'danger' && (
            <div className="mt-4 bg-rose-500/20 border border-rose-500/30 rounded-[18px] p-3 flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle size={16} className="text-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-rose-200 text-xs font-bold">Malicious Content</p>
                    <p className="text-rose-200/60 text-[10px] truncate">Auto-blocked 2 scripts</p>
                </div>
                <button className="text-rose-400 hover:text-rose-300">
                    <ChevronRight size={16} />
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default ExtensionPopup;