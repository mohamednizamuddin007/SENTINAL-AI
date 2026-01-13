import React, { useEffect, useState, useRef } from 'react';
import { Globe, AlertOctagon, Shield } from 'lucide-react';

interface ThreatPing {
  id: number;
  x: number;
  y: number;
  type: 'blocked' | 'attack';
  country: string;
}

const LiveThreatMap: React.FC = () => {
  const [pings, setPings] = useState<ThreatPing[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random pings
  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const newPing: ThreatPing = {
        id: Date.now(),
        // Simple random distribution roughly within map bounds
        x: Math.random() * width * 0.8 + (width * 0.1), 
        y: Math.random() * height * 0.7 + (height * 0.15),
        type: Math.random() > 0.3 ? 'blocked' : 'attack',
        country: ['USA', 'CHN', 'RUS', 'DEU', 'BRA', 'IND'][Math.floor(Math.random() * 6)]
      };

      setPings(prev => [...prev.slice(-15), newPing]); // Keep last 15
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950 border-y border-slate-900 py-12 relative overflow-hidden group">
        
      {/* Background World Map SVG (Abstract) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
         <svg viewBox="0 0 1000 500" className="w-full h-full text-slate-500 fill-current">
            <path d="M149,425 Q200,450 250,425 T350,400 Q400,380 450,400 T550,425 Q600,450 650,425 T750,400 Q800,380 850,400 T950,425 V100 H50 V425 Z" />
            <path d="M50,150 Q150,100 250,150 T450,150 Q550,100 650,150 T850,150 Q900,100 950,150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 20"/>
         </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex justify-between items-end mb-8">
            <div>
                <div className="flex items-center gap-2 mb-2">
                     <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <h2 className="text-emerald-400 font-mono text-sm tracking-widest uppercase">Global Threat Pulse</h2>
                </div>
                <h3 className="text-2xl font-bold text-white">Live Attack Interception</h3>
            </div>
            <div className="flex gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span>Threat Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                    <span>Active Attack</span>
                </div>
            </div>
        </div>

        {/* Map Container */}
        <div ref={containerRef} className="h-[300px] w-full bg-slate-900/50 rounded-2xl border border-slate-800 relative shadow-inner backdrop-blur-sm overflow-hidden">
            
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Pings */}
            {pings.map(ping => (
                <div 
                    key={ping.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: ping.x, top: ping.y }}
                >
                    <div className={`relative flex h-4 w-4`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${ping.type === 'blocked' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-4 w-4 ${ping.type === 'blocked' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    </div>
                    <div className="mt-2 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-[10px] text-white font-mono opacity-0 animate-[fadeInOut_2s_ease-in-out_forwards]">
                        {ping.type === 'blocked' ? 'BLOCKED' : 'DETECTED'} • {ping.country}
                    </div>
                </div>
            ))}
            
            {/* Central HUD Data */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex gap-6 backdrop-blur-md">
                <div>
                    <div className="text-xs text-slate-500 uppercase">Requests/Sec</div>
                    <div className="text-xl font-bold text-white font-mono">24,892</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase">Threats Mitigated</div>
                    <div className="text-xl font-bold text-emerald-400 font-mono">1,024</div>
                </div>
            </div>

        </div>
      </div>
      
      <style>{`
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(5px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default LiveThreatMap;