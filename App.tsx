import React, { useState, useEffect, useMemo } from 'react';
import Scanner from './components/Scanner';
import About from './components/About';
import Awareness from './components/Awareness';
import ChatWidget from './components/ChatWidget';
import SecurityAdvisor from './components/SecurityAdvisor';
import { ShieldCheck, Menu, X, Activity, Lock, Globe, ChevronDown, Cpu, Zap, Sparkles } from 'lucide-react';

// --- Background Sparks Component ---
const BackgroundSparks = () => {
  // Generate random sparks configuration
  const sparks = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${10 + Math.random() * 10}s`,
    opacity: 0.3 + Math.random() * 0.5,
    size: `${2 + Math.random() * 3}px`
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden sparks-container">
      {sparks.map((style, i) => (
        <div
          key={i}
          className="absolute bottom-[-20px] bg-white rounded-full animate-float-spark shadow-[0_0_10px_white]"
          style={{
            left: style.left,
            animationDelay: style.animationDelay,
            animationDuration: style.animationDuration,
            opacity: style.opacity,
            width: style.size,
            height: style.size,
          }}
        />
      ))}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative">
            <ShieldCheck size={32} className="relative z-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <div className="absolute inset-0 bg-emerald-500/50 blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          </div>
          <span className="text-xl font-bold tracking-wider text-white group-hover:text-emerald-300 transition-colors">SENTINEL<span className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">AI</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['scanner', 'advisor', 'awareness', 'about'].map((id) => (
             <button key={id} onClick={() => scrollTo(id)} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors relative group uppercase tracking-wide">
                {id === 'scanner' ? 'Deep Scan' : id === 'advisor' ? 'AI Advisor' : id === 'awareness' ? 'Education' : 'About'}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 group-hover:w-full box-shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
             </button>
          ))}
          <button onClick={() => scrollTo('scanner')} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 border border-emerald-400/20">
            Start Scanning
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5">
          <button onClick={() => scrollTo('scanner')} className="text-left text-slate-300 py-3 border-b border-white/5">Deep Scan Tools</button>
          <button onClick={() => scrollTo('advisor')} className="text-left text-slate-300 py-3 border-b border-white/5">AI Advisor</button>
          <button onClick={() => scrollTo('awareness')} className="text-left text-slate-300 py-3 border-b border-white/5">Education</button>
          <button onClick={() => scrollTo('about')} className="text-left text-slate-300 py-3">About Platform</button>
        </div>
      )}
    </nav>
  );
};

const Hero3D: React.FC = () => {
  return (
    <section className="relative min-h-[950px] md:min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden perspective-1000">
      
      {/* 3D Animated Background Grid Floor */}
      <div className="absolute inset-0 cyber-grid-container pointer-events-none opacity-50">
        <div className="cyber-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>

      {/* Background Glows - Aesthetic */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
         <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-left-10 fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/40 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:border-emerald-500/50 transition-colors">
                <Sparkles size={14} className="text-emerald-400 animate-spin-slow" />
                <span className="text-xs font-mono text-emerald-300 font-bold tracking-widest uppercase">AI-Powered Threat Defense v2.4</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1] drop-shadow-2xl">
                The End of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-500 drop-shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                    Phishing Attacks
                </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                SentinelAI leverages <strong>Google Gemini</strong> to create an impenetrable cognitive shield. We analyze intent, visuals, and code in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button 
                    onClick={() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })} 
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 flex items-center gap-2 group border border-emerald-400/20"
                >
                    <Zap className="group-hover:fill-current transition-all" size={20} />
                    Analyze Content
                </button>
                <button 
                    onClick={() => document.getElementById('advisor')?.scrollIntoView({ behavior: 'smooth' })} 
                    className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800/80 text-white rounded-full font-bold text-lg transition-all border border-white/10 hover:border-white/30 backdrop-blur-md flex items-center gap-2 shadow-lg"
                >
                    <Cpu size={20} className="text-blue-400" />
                    Ask AI Advisor
                </button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-80">
                <div className="text-center group cursor-default">
                    <div className="text-2xl font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">99.9%</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Accuracy</div>
                </div>
                <div className="w-px h-10 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
                <div className="text-center group cursor-default">
                    <div className="text-2xl font-bold text-white font-mono group-hover:text-blue-400 transition-colors"> &lt; 50ms</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Latency</div>
                </div>
                <div className="w-px h-10 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
                 <div className="text-center group cursor-default">
                    <div className="text-2xl font-bold text-white font-mono group-hover:text-purple-400 transition-colors">24/7</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Monitoring</div>
                </div>
            </div>
        </div>

        {/* 3D Visual Element - The "Cyber Core" */}
        <div className="relative h-[600px] w-full flex items-center justify-center animate-float-3d perspective-1000">
             {/* Core Glow - Super Intense */}
             <div className="absolute w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>
             <div className="absolute w-64 h-64 bg-cyan-400/20 rounded-full blur-[60px] animate-pulse delay-75"></div>
             
             {/* Spinning Rings (CSS 3D) */}
             <div className="relative w-[400px] h-[400px] preserve-3d">
                {/* Ring 1 */}
                <div className="absolute inset-0 border-2 border-emerald-400/40 rounded-full animate-spin-slow shadow-[0_0_15px_rgba(52,211,153,0.3)]" style={{ transform: 'rotateX(60deg)' }}></div>
                {/* Ring 2 */}
                <div className="absolute inset-0 border-2 border-blue-400/40 rounded-full animate-spin-reverse-slow shadow-[0_0_15px_rgba(96,165,250,0.3)]" style={{ transform: 'rotateY(60deg)' }}></div>
                {/* Ring 3 */}
                <div className="absolute inset-0 border border-dashed border-cyan-300/50 rounded-full animate-spin-slow" style={{ width: '120%', height: '120%', top: '-10%', left: '-10%' }}></div>
                
                {/* Central Sphere / Shield */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-blue-600/20 rounded-full border border-white/20 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center preserve-3d animate-float-3d">
                    <ShieldCheck size={100} className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,1)]" />
                    
                    {/* Orbiting particles */}
                    <div className="absolute w-full h-full animate-spin-slow">
                        <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white]"></div>
                    </div>
                     <div className="absolute w-full h-full animate-spin-reverse-slow" style={{ width: '150%', height: '150%' }}>
                        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"></div>
                    </div>
                </div>

                {/* Floating Code Snippets - Glassmorphism */}
                <div className="absolute top-0 right-[-60px] bg-black/60 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-lg shadow-xl animate-float-delayed" style={{ animationDelay: '1s' }}>
                    <div className="flex gap-2 items-center text-xs font-mono text-emerald-300">
                        <Lock size={12} />
                        <span>AES-256 ENCRYPTED</span>
                    </div>
                </div>
                 <div className="absolute bottom-10 left-[-60px] bg-black/60 border border-blue-500/30 p-4 rounded-xl backdrop-blur-lg shadow-xl animate-float-delayed" style={{ animationDelay: '2s' }}>
                    <div className="flex gap-2 items-center text-xs font-mono text-blue-300">
                        <Activity size={12} />
                        <span>THREAT LEVEL: LOW</span>
                    </div>
                </div>
             </div>
        </div>

      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70 z-20">
            <ChevronDown size={32} className="text-white drop-shadow-lg" />
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-50 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <ShieldCheck size={24} className="text-emerald-500" />
          <span className="font-bold tracking-wide">SENTINEL AI</span>
        </div>
        <div className="text-slate-500 text-sm">
          © {new Date().getFullYear()} SentinelAI Defense Platform. All rights reserved.
        </div>
        <div className="flex gap-6">
           <Globe size={20} className="text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors hover:scale-110" />
           <Lock size={20} className="text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors hover:scale-110" />
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="bg-black text-slate-50 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden min-h-screen">
      
      <BackgroundSparks />
      
      <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero3D />
        
        {/* Deep Scan Section */}
        <section id="scanner" className="py-32 relative z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black border-t border-white/5">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <Scanner onScanComplete={() => {}} />
          </div>
        </section>

        {/* AI Advisor Section */}
        <section id="advisor" className="py-32 relative z-20 bg-black border-t border-white/5">
             <div className="absolute inset-0 bg-emerald-900/5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-6 relative">
                <SecurityAdvisor />
            </div>
        </section>

        {/* Awareness / Education Section */}
        <section id="awareness" className="py-32 relative z-20 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-black to-black border-t border-white/5">
           <div className="max-w-7xl mx-auto px-6">
              <Awareness />
           </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 relative z-20 bg-black border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <About />
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Floating Assistant */}
      <ChatWidget />
    </div>
  );
};

export default App;