import React, { useMemo, useEffect, useRef } from 'react';
import { ScanHistoryItem, RiskLevel } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { ShieldCheck, AlertOctagon, Activity, MailQuestion, ChevronRight, User, Wifi } from 'lucide-react';

interface DashboardProps {
  history: ScanHistoryItem[];
  userEmail: string;
  onNavigateToScan: () => void;
  onViewReport: (item: ScanHistoryItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, userEmail, onNavigateToScan, onViewReport }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Dynamic Stat Calculation
  const threats = history.filter(h => h.result.riskLevel === RiskLevel.MALICIOUS).length;
  const suspicious = history.filter(h => h.result.riskLevel === RiskLevel.SUSPICIOUS).length;
  const safe = history.filter(h => h.result.riskLevel === RiskLevel.SAFE).length;

  // Auto-scroll to top of list when new items arrive
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
    }
  }, [history.length]);

  // Calculate Chart Data (Last 7 Days)
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = new Array(7).fill(0).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return { 
            name: days[d.getDay()],
            dateStr: d.toDateString(),
            threats: 0,
            safe: 0 
        };
    });

    history.forEach(item => {
        const itemDate = new Date(item.timestamp).toDateString();
        const dataPoint = data.find(d => d.dateStr === itemDate);
        if (dataPoint) {
            if (item.result.riskLevel === RiskLevel.MALICIOUS) {
                dataPoint.threats++;
            } else {
                dataPoint.safe++;
            }
        }
    });
    return data;
  }, [history]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <User size={16} className="text-emerald-500" />
            </div>
            <span className="text-sm font-mono text-emerald-500">{userEmail}</span>
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                <Wifi size={10} className="animate-pulse" />
                <span className="text-xs">Live Stream Active</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Security Overview</h1>
          <p className="text-slate-400 mt-1">Monitoring incoming traffic for {userEmail}...</p>
        </div>
        <button 
          onClick={onNavigateToScan}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-emerald-900/20"
        >
          New Manual Scan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Active Threats Blocked</p>
            <h3 className="text-3xl font-bold text-rose-500 mt-1">{threats}</h3>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-lg">
            <AlertOctagon className="text-rose-500" size={24} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">AI-Generated Campaigns</p>
            <h3 className="text-3xl font-bold text-amber-500 mt-1">{Math.round((threats / (threats + safe + suspicious || 1)) * 100)}%</h3>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <Activity className="text-amber-500" size={24} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Safe Emails Verified</p>
            <h3 className="text-3xl font-bold text-emerald-500 mt-1">{safe}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <ShieldCheck className="text-emerald-500" size={24} />
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-sm font-medium">Pending Review</p>
                <h3 className="text-3xl font-bold text-slate-100 mt-1">{suspicious}</h3>
            </div>
            <div className="p-3 bg-slate-700/30 rounded-lg">
                <MailQuestion className="text-slate-400" size={24} />
            </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Threat Detection Trends (Live)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} 
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" name="Threats" />
                <Area type="monotone" dataKey="safe" stroke="#10b981" fillOpacity={1} fill="url(#colorSafe)" name="Safe Traffic" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl overflow-hidden flex flex-col h-[350px]">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center justify-between">
            <span>Live Inbox Stream</span>
            <span className="text-[10px] text-emerald-500 font-mono animate-pulse">● RECIEVING</span>
          </h3>
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar scroll-smooth">
            {[...history].reverse().map((item) => (
              <div 
                key={item.id} 
                onClick={() => onViewReport(item)}
                className="group p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between animate-in slide-in-from-left-2 fade-in duration-300"
              >
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            item.result.riskLevel === RiskLevel.MALICIOUS ? 'bg-rose-500/20 text-rose-400' :
                            item.result.riskLevel === RiskLevel.SUSPICIOUS ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                        }`}>{item.result.riskLevel}</span>
                        <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <h4 className="text-sm font-medium text-slate-200 truncate group-hover:text-emerald-400 transition-colors">{item.subject}</h4>
                    <p className="text-xs text-slate-500 truncate">{item.sender}</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;