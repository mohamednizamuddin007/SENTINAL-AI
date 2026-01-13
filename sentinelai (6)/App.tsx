import React, { useState, useEffect } from 'react';
import Scanner from './components/Scanner';
import About from './components/About';
import Awareness from './components/Awareness';
import ChatWidget from './components/ChatWidget';
import SecurityAdvisor from './components/SecurityAdvisor';
import { ShieldCheck, Menu, X, Activity, Lock, Globe, ChevronDown, Cpu, Zap } from 'lucide-react';

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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative">
            <ShieldCheck size={32} className="relative z-10 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-emerald-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">SENTINEL<span className="text-emerald-500">AI</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('scanner')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
             Deep Scan Tools
             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
          </button>
          <button onClick={() => scrollTo('advisor')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
             AI Advisor
             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
          </button>
          <button onClick={() => scrollTo('awareness')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
             Phishing Awareness
             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
          </button>
          <button onClick={() => scrollTo('about')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
             How it Works
             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
          </button>
          <button onClick={() => scrollTo('scanner')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95">
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
        <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5">
          <button onClick={() => scrollTo('scanner')} className="text-left text-slate-300 py-2">Deep Scan Tools</button>
          <button onClick={() => scrollTo('advisor')} className="text-left text-slate-300 py-2">AI Advisor</button>
          <button onClick={() => scrollTo('awareness')} className="text-left text-slate-300 py-2">Education</button>
          <button onClick={() => scrollTo('about')} className="text-left text-slate-300 py-2">About Platform</button>
        </div>
      )}
    </nav>
  );
};

const Hero3D: React.FC = () => {
  return (
    <section className="relative min-h-[900px] md:min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden perspective-1000">
      
      {/* 3D Animated Background Grid Floor */}
      <div className="absolute inset-0 cyber-grid-container pointer-events-none opacity-40">
        <div className="cyber-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-left-10 fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-md shadow-lg shadow-emerald-500/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">AI-POWERED THREAT DETECTION v2.4</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                The End of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    Phishing Attacks
                </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                SentinelAI leverages <strong>Google Gemini</strong> to create an impenetrable cognitive shield. We analyze intent, visuals, and code in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button 
                    onClick={() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })} 
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 group"
                >
                    <Zap className="group-hover:fill-current transition-all" size={20} />
                    Analyze Content
                </button>
                <button 
                    onClick={() => document.getElementById('advisor')?.scrollIntoView({ behavior: 'smooth' })} 
                    className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full font-bold text-lg transition-all border border-slate-600 hover:border-slate-500 backdrop-blur-md flex items-center gap-2"
                >
                    <Cpu size={20} />
                    Ask AI Advisor
                </button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-70">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white font-mono">99.9%</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Accuracy</div>
                </div>
                <div className="w-px h-10 bg-slate-800"></div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white font-mono"> &lt; 50ms</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Latency</div>
                </div>
                <div className="w-px h-10 bg-slate-800"></div>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-white font-mono">24/7</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Monitoring</div>
                </div>
            </div>
        </div>

        {/* 3D Visual Element - The "Cyber Core" */}
        <div className="relative h-[500px] w-full flex items-center justify-center animate-float-3d perspective-1000">
             {/* Core Glow */}
             <div className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse"></div>
             
             {/* Spinning Rings (CSS 3D) */}
             <div className="relative w-80 h-80 preserve-3d">
                {/* Ring 1 */}
                <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-spin-slow" style={{ transform: 'rotateX(60deg)' }}></div>
                {/* Ring 2 */}
                <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-spin-reverse-slow" style={{ transform: 'rotateY(60deg)' }}></div>
                {/* Ring 3 */}
                <div className="absolute inset-0 border border-dashed border-emerald-400/50 rounded-full animate-spin-slow" style={{ width: '120%', height: '120%', top: '-10%', left: '-10%' }}></div>
                
                {/* Central Sphere / Shield */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-blue-600/10 rounded-full border border-slate-700/50 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.2)] flex items-center justify-center preserve-3d animate-float-3d">
                    <ShieldCheck size={80} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                    
                    {/* Orbiting particles */}
                    <div className="absolute w-full h-full animate-spin-slow">
                        <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                    </div>
                </div>

                {/* Floating Code Snippets */}
                <div className="absolute top-0 right-[-50px] bg-slate-900/80 border border-slate-700 p-3 rounded-lg backdrop-blur-md shadow-xl animate-float-delayed" style={{ animationDelay: '1s' }}>
                    <div className="flex gap-2 items-center text-xs font-mono text-emerald-400">
                        <Lock size={12} />
                        <span>Encryption: AES-256</span>
                    </div>
                </div>
                 <div className="absolute bottom-10 left-[-40px] bg-slate-900/80 border border-slate-700 p-3 rounded-lg backdrop-blur-md shadow-xl animate-float-delayed" style={{ animationDelay: '2s' }}>
                    <div className="flex gap-2 items-center text-xs font-mono text-blue-400">
                        <Activity size={12} />
                        <span>Threat Level: Low</span>
                    </div>
                </div>
             </div>
        </div>

      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-20">
            <ChevronDown size={24} className="text-slate-400" />
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck size={24} />
          <span className="font-bold">SENTINEL AI</span>
        </div>
        <div className="text-slate-500 text-sm">
          © {new Date().getFullYear()} SentinelAI Defense Platform. All rights reserved.
        </div>
        <div className="flex gap-6">
           <Globe size={20} className="text-slate-600 hover:text-white cursor-pointer transition-colors" />
           <Lock size={20} className="text-slate-600 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">
      <Navbar />
      
      <main>
        {/* Replaced old Hero with Hero3D */}
        <Hero3D />
        
        {/* Deep Scan Section */}
        <section id="scanner" className="py-24 bg-slate-950 relative border-t border-slate-900 z-20">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <Scanner onScanComplete={() => {}} />
          </div>
        </section>

        {/* AI Advisor Section */}
        <section id="advisor" className="py-24 bg-slate-950 border-t border-slate-900 z-20 relative">
             <div className="absolute inset-0 bg-emerald-900/5 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-6 relative">
                <SecurityAdvisor />
            </div>
        </section>

        {/* Awareness / Education Section */}
        <section id="awareness" className="py-24 bg-slate-900/30 z-20 relative">
           <div className="max-w-7xl mx-auto px-6">
              <Awareness />
           </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-slate-950 border-t border-slate-900 z-20 relative">
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