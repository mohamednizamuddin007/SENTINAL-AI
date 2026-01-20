import React from 'react';
import { Shield, FileText, Globe, Key, Eye, Cpu, Lock, Zap, CheckCircle2, User, Mail, Code2, Terminal, Palette, Box, Layers } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-500 pb-12">
      
      {/* Hero / Mission Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <Shield className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Defending Against the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI Phishing Era</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          SentinelAI was built to counter a new generation of cyber threats. As attackers leverage Generative AI to craft perfect, personalized, and grammatically flawless phishing campaigns, traditional rule-based filters are failing. 
          <br/><br/>
          We use <strong>Google's Gemini 3 Pro</strong> to perform cognitive analysis on emails, visually inspect screenshots for brand impersonation, and detect subtle linguistic anomalies that signal synthetic fraud.
        </p>
      </div>

      {/* The 4 Detection Engines */}
      <div>
        <div className="flex items-center gap-4 mb-8">
             <div className="h-px bg-slate-800 flex-1"></div>
             <h2 className="text-xl font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Cpu size={20} className="text-blue-500" />
                Core Detection Engines
             </h2>
             <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. NLP / Text Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-emerald-500/30 transition-colors group">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                    <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">1. Cognitive NLP Analysis</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    We don't just look for "bad words." The AI analyzes the <strong>intent</strong> and <strong>psychological triggers</strong> of a message. It detects urgency, fear appeals, and synthetic sentence structures typical of AI-generated text.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                        <span>Detects "CEO Fraud" & tone impersonation</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                        <span>Identifies AI-generated writing artifacts</span>
                    </li>
                </ul>
            </div>

            {/* 2. Visual Forensics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-purple-500/30 transition-colors group">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/10 transition-colors">
                    <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">2. Computer Vision (OCR)</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Phishers often hide text inside images to bypass spam filters. Our visual engine "sees" the email like a human does, checking for blurry logos, fake login buttons, and brand mismatches (e.g., a Microsoft logo on a Gmail background).
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-purple-500 mt-0.5" />
                        <span>Analyzes screenshots & image-only emails</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-purple-500 mt-0.5" />
                        <span>Detects fake login overlays</span>
                    </li>
                </ul>
            </div>

            {/* 3. URL & Domain Forensics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-blue-500/30 transition-colors group">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/10 transition-colors">
                    <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3. Domain Structure Analysis</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    We break down URLs to spot typosquatting (e.g., g0ogle.com), punycode attacks, and suspicious subdomains. The AI evaluates the "reputation entropy" of the link structure.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-blue-500 mt-0.5" />
                        <span>Unmasks obscured redirects</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-blue-500 mt-0.5" />
                        <span>Checks TLD reputation (.xyz, .top)</span>
                    </li>
                </ul>
            </div>

            {/* 4. Secret & Key Detection */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-amber-500/30 transition-colors group">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors">
                    <Key className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">4. Data Leak Prevention</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Developers often accidentally paste API keys or private tokens into emails or tickets. SentinelAI scans for high-entropy strings that look like AWS, Stripe, or OpenAI keys to prevent accidental exposure.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-amber-500 mt-0.5" />
                        <span>Regex + AI pattern matching</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-amber-500 mt-0.5" />
                        <span>Identifies provider-specific formats</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div>
        <div className="flex items-center gap-4 mb-8">
             <div className="h-px bg-slate-800 flex-1"></div>
             <h2 className="text-xl font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Layers size={20} className="text-purple-500" />
                Built With
             </h2>
             <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col items-center text-center gap-2 hover:border-slate-600 transition-colors">
                <Code2 className="text-blue-400" size={24} />
                <span className="font-bold text-slate-200">React + TypeScript</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col items-center text-center gap-2 hover:border-slate-600 transition-colors">
                <Palette className="text-cyan-400" size={24} />
                <span className="font-bold text-slate-200">Tailwind CSS</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col items-center text-center gap-2 hover:border-slate-600 transition-colors">
                <Terminal className="text-emerald-400" size={24} />
                <span className="font-bold text-slate-200">Google Gemini API</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col items-center text-center gap-2 hover:border-slate-600 transition-colors">
                <Box className="text-amber-400" size={24} />
                <span className="font-bold text-slate-200">Lucide Icons</span>
            </div>
        </div>
      </div>

      {/* Creators Section */}
      <div>
        <div className="flex items-center gap-4 mb-8">
             <div className="h-px bg-slate-800 flex-1"></div>
             <h2 className="text-xl font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <User size={20} className="text-emerald-500" />
                The Architects
             </h2>
             <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Creator 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-all hover:-translate-y-1">
                <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-slate-700">
                    <User size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">MOHAMED NIZAMUDDIN A</h3>
                <p className="text-slate-500 text-sm mb-4">Lead Developer & AI Integration</p>
                <a href="mailto:nizamuddinmohamed550@gmail.com" className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950 py-2 rounded-full border border-slate-800 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                    <Mail size={12} />
                    <span>nizamuddinmohamed550@gmail.com</span>
                </a>
            </div>

            {/* Creator 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-all hover:-translate-y-1">
                <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-slate-700">
                    <User size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">YASHWANT K</h3>
                <p className="text-slate-500 text-sm mb-4">Security Architect & Frontend</p>
                <a href="mailto:kalpanakyashwanthk@gmail.com" className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950 py-2 rounded-full border border-slate-800 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                    <Mail size={12} />
                    <span>kalpanakyashwanthk@gmail.com</span>
                </a>
            </div>

            {/* Creator 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-all hover:-translate-y-1">
                <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-slate-700">
                    <User size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">THILAK RAJ . P</h3>
                <p className="text-slate-500 text-sm mb-4">Full Stack Engineer</p>
                <a href="mailto:thilakr401@gmail.com" className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950 py-2 rounded-full border border-slate-800 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                    <Mail size={12} />
                    <span>thilakr401@gmail.com</span>
                </a>
            </div>

        </div>
      </div>

    </div>
  );
};

export default About;