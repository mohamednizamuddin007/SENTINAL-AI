import React, { useState, useRef, useEffect } from 'react';
import { ScanHistoryItem } from '../types';
import { analyzeTextContent, analyzeImageContent, analyzeUrlContent, analyzeApiKey, analyzeSmishing, analyzeQrCode, analyzeFileContent } from '../services/geminiService';
import AnalysisResultCard from './AnalysisResult';
import { PRESET_PHISHING_TEXT } from '../constants';
import { Upload, FileText, Loader2, Play, Globe, Link, Key, AlertCircle, ShieldCheck, ScanEye, Search, Lock, X, Sparkles, Smartphone, QrCode, MessageSquare, FileCode, FileWarning } from 'lucide-react';

interface ScannerProps {
  onScanComplete: (item: ScanHistoryItem) => void;
}

type ScannerMode = 'text' | 'url' | 'apikey' | 'image' | 'mobile' | 'file' | null;
type MobileSubMode = 'sms' | 'qr';

const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [activeMode, setActiveMode] = useState<ScannerMode>(null);
  const [mobileMode, setMobileMode] = useState<MobileSubMode>('sms');
  const [isLoading, setIsLoading] = useState(false);
  
  // Inputs
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [smsInput, setSmsInput] = useState('');
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<{name: string, content: string} | null>(null);
  
  const [scanResult, setScanResult] = useState<ScanHistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (scanResult && resultRef.current) {
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [scanResult]);

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleModeSelect = (mode: ScannerMode) => {
    setActiveMode(mode);
    resetScanner();
    // Smooth scroll to the tool area
    setTimeout(() => {
        const toolArea = document.getElementById('active-tool-area');
        if(toolArea) toolArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleBack = () => {
    setActiveMode(null);
    resetScanner();
  };

  // --- Presets ---
  const handlePhishingPreset = () => {
    setTextInput(PRESET_PHISHING_TEXT);
    setError(null);
  };

  const handleSafePreset = () => {
    setTextInput(`Subject: Project Kickoff: Q4 Marketing Campaign
From: sarah.miller@marketing-team.com

Hi Team,

I'm excited to share the brief for our upcoming Q4 campaign. We have a lot of great opportunities to explore this quarter.

Please review the attached document before our meeting on Thursday at 2 PM.

Best regards,
Sarah Miller
Senior Marketing Manager`);
    setError(null);
  };

  const handleUrlPreset = () => {
    setUrlInput("https://secure-login-apple-id.verify-account-updates.com/login");
    setError(null);
  };

  const handleKeyPreset = () => {
    setKeyInput("sk_live_51MzQ8bKj92xlP3n2x9L923k2929210029384"); 
    setError(null);
  };

  const handleSmsPreset = () => {
      setSmsInput("FRM:BankOfAmerica MSG:Your account locked due to suspicious activity. Visit bit.ly/boa-verify immediately to restore access.");
      setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'scan' | 'qr') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'scan') setImagePreview(reader.result as string);
        else setQrPreview(reader.result as string);
        setScanResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 50 * 1024 * 1024) { // 50MB Limit
              setError("File exceeds 50MB limit. Please upload a smaller file.");
              return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
              const text = event.target?.result;
              if (typeof text === 'string') {
                  setFileContent({ name: file.name, content: text });
                  setError(null);
                  setScanResult(null);
              }
          };
          // Reading as text for forensics analysis (source code, logs, scripts)
          reader.readAsText(file);
      }
  };

  const parseTextInputs = (rawText: string) => {
    const lines = rawText.split('\n');
    let subject = "Unknown Subject";
    let sender = "Unknown Sender";
    let body = rawText;

    const subjectLine = lines.find(l => l.toLowerCase().startsWith('subject:'));
    if (subjectLine) subject = subjectLine.replace(/subject:/i, '').trim();

    const fromLine = lines.find(l => l.toLowerCase().startsWith('from:'));
    if (fromLine) sender = fromLine.replace(/from:/i, '').trim();

    return { subject, sender, body };
  };

  const handleScan = async () => {
    setError(null);

    // Validation
    if (activeMode === 'text' && !textInput.trim()) return setError("Please enter content to analyze.");
    if (activeMode === 'url' && !urlInput.trim()) return setError("Please enter a URL.");
    if (activeMode === 'apikey' && !keyInput.trim()) return setError("Please enter a key string.");
    if (activeMode === 'image' && !imagePreview) return setError("Please upload an image.");
    if (activeMode === 'mobile' && mobileMode === 'sms' && !smsInput.trim()) return setError("Please enter SMS text.");
    if (activeMode === 'mobile' && mobileMode === 'qr' && !qrPreview) return setError("Please upload a QR code image.");
    if (activeMode === 'file' && !fileContent) return setError("Please upload a file.");

    setIsLoading(true);
    setScanResult(null);

    try {
      let result;
      let subject = "Manual Scan";
      let sender = "N/A";

      if (activeMode === 'text') {
        const { subject: parsedSubject, sender: parsedSender, body } = parseTextInputs(textInput);
        subject = parsedSubject;
        sender = parsedSender;
        result = await analyzeTextContent(parsedSubject, parsedSender, body);
      } else if (activeMode === 'url') {
        subject = "URL Inspection";
        sender = urlInput;
        result = await analyzeUrlContent(urlInput);
      } else if (activeMode === 'apikey') {
        subject = "Credential Audit";
        sender = "Source Code Scan";
        result = await analyzeApiKey(keyInput);
      } else if (activeMode === 'image') {
        subject = "Image Scan";
        sender = "Visual Analysis";
        const base64Data = imagePreview!.split(',')[1];
        result = await analyzeImageContent(base64Data);
      } else if (activeMode === 'mobile') {
          if (mobileMode === 'sms') {
              subject = "Smishing Analysis";
              sender = "SMS / Message";
              result = await analyzeSmishing(smsInput);
          } else {
              subject = "QR Code Decode";
              sender = "Camera / Image";
              const base64Data = qrPreview!.split(',')[1];
              result = await analyzeQrCode(base64Data);
          }
      } else if (activeMode === 'file') {
          subject = "File Forensics";
          sender = fileContent!.name;
          result = await analyzeFileContent(fileContent!.name, fileContent!.content);
      }

      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        subject,
        sender,
        type: activeMode as any, // Type cast for simplicity in this demo
        result: result!
      };

      setScanResult(historyItem);
      onScanComplete(historyItem);
    } catch (e) {
      console.error(e);
      setError("Scan failed. Please check the API Key configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render: Tool Selection Hub ---
  const getHeaderInfo = () => {
      switch(activeMode) {
          case 'text': return { title: 'Email & Text Scanner', icon: FileText, color: 'text-emerald-400', border: 'border-emerald-500/20' };
          case 'url': return { title: 'URL Inspector', icon: Globe, color: 'text-cyan-400', border: 'border-cyan-500/20' };
          case 'apikey': return { title: 'Secret Key Detector', icon: Key, color: 'text-amber-400', border: 'border-amber-500/20' };
          case 'image': return { title: 'Visual Forensics', icon: ScanEye, color: 'text-purple-400', border: 'border-purple-500/20' };
          case 'mobile': return { title: 'Mobile Guard', icon: Smartphone, color: 'text-orange-400', border: 'border-orange-500/20' };
          case 'file': return { title: 'File Forensics', icon: FileCode, color: 'text-blue-400', border: 'border-blue-500/20' };
          default: return { title: 'Scanner', icon: Search, color: 'text-slate-400', border: 'border-slate-800' };
      }
  };

  const header = getHeaderInfo();

  return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md mb-2">
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Select Your Weapon</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                    Defense <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 filter drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">Matrix</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Choose a detection vector to initialize SentinelAI's neural engines.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 perspective-1000">
                
                {/* 1. Text Scanner - Emerald Theme */}
                <button 
                    onClick={() => handleModeSelect('text')}
                    className={`relative p-8 rounded-[2rem] text-left transition-all duration-300 border flex flex-col gap-6 overflow-hidden group hover:-translate-y-2
                    ${activeMode === 'text' 
                        ? 'bg-gradient-to-br from-emerald-950/80 to-black border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400' 
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 hover:border-emerald-500/50 backdrop-blur-sm'
                    }`}
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/30 transition-all"></div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-all duration-300 ${activeMode === 'text' ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]'}`}>
                        <FileText size={32} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl text-white group-hover:text-emerald-300 transition-colors">Email Scanner</h3>
                        <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">Detects AI-generated phishing & NLP anomalies.</p>
                    </div>
                </button>

                {/* 2. URL Scanner - Cyan Theme */}
                <button 
                    onClick={() => handleModeSelect('url')}
                    className={`relative p-8 rounded-[2rem] text-left transition-all duration-300 border flex flex-col gap-6 overflow-hidden group hover:-translate-y-2
                    ${activeMode === 'url' 
                        ? 'bg-gradient-to-br from-cyan-950/80 to-black border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400' 
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 hover:border-cyan-500/50 backdrop-blur-sm'
                    }`}
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/30 transition-all"></div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-all duration-300 ${activeMode === 'url' ? 'bg-cyan-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'}`}>
                        <Globe size={32} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl text-white group-hover:text-cyan-300 transition-colors">URL Inspector</h3>
                        <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">Forensic analysis of domains & redirection.</p>
                    </div>
                </button>

                {/* 3. API Key Scanner - Amber Theme */}
                <button 
                    onClick={() => handleModeSelect('apikey')}
                    className={`relative p-8 rounded-[2rem] text-left transition-all duration-300 border flex flex-col gap-6 overflow-hidden group hover:-translate-y-2
                    ${activeMode === 'apikey' 
                        ? 'bg-gradient-to-br from-amber-950/80 to-black border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)] ring-1 ring-amber-400' 
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 hover:border-amber-500/50 backdrop-blur-sm'
                    }`}
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/30 transition-all"></div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-all duration-300 ${activeMode === 'apikey' ? 'bg-amber-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]'}`}>
                        <Key size={32} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl text-white group-hover:text-amber-300 transition-colors">Key Detector</h3>
                        <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">Protects high-entropy secrets & tokens.</p>
                    </div>
                </button>

                {/* 4. Visual Scanner - Purple Theme */}
                <button 
                    onClick={() => handleModeSelect('image')}
                    className={`relative p-8 rounded-[2rem] text-left transition-all duration-300 border flex flex-col gap-6 overflow-hidden group hover:-translate-y-2
                    ${activeMode === 'image' 
                        ? 'bg-gradient-to-br from-purple-950/80 to-black border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.3)] ring-1 ring-purple-400' 
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 hover:border-purple-500/50 backdrop-blur-sm'
                    }`}
                >
                     <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/30 transition-all"></div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-all duration-300 ${activeMode === 'image' ? 'bg-purple-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]'}`}>
                        <ScanEye size={32} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl text-white group-hover:text-purple-300 transition-colors">Visual Scan</h3>
                        <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">Computer vision analysis of screenshots.</p>
                    </div>
                </button>

                 {/* 5. Mobile Guard - Orange Theme (NEW) */}
                 <button 
                    onClick={() => handleModeSelect('mobile')}
                    className={`relative p-8 rounded-[2rem] text-left transition-all duration-300 border flex flex-col gap-6 overflow-hidden group hover:-translate-y-2
                    ${activeMode === 'mobile' 
                        ? 'bg-gradient-to-br from-orange-950/80 to-black border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.3)] ring-1 ring-orange-400' 
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 hover:border-orange-500/50 backdrop-blur-sm'
                    }`}
                >
                     <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/30 transition-all"></div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-all duration-300 ${activeMode === 'mobile' ? 'bg-orange-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]'}`}>
                        <Smartphone size={32} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl text-white group-hover:text-orange-300 transition-colors">Mobile Guard</h3>
                        <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">Smishing (SMS) detection & QR code analysis.</p>
                    </div>
                </button>

                 {/* 6. File Forensics - Blue Theme (NEW) */}
                 <button 
                    onClick={() => handleModeSelect('file')}
                    className={`relative p-8 rounded-[2rem] text-left transition-all duration-300 border flex flex-col gap-6 overflow-hidden group hover:-translate-y-2
                    ${activeMode === 'file' 
                        ? 'bg-gradient-to-br from-blue-950/80 to-black border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] ring-1 ring-blue-400' 
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 hover:border-blue-500/50 backdrop-blur-sm'
                    }`}
                >
                     <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-all"></div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-all duration-300 ${activeMode === 'file' ? 'bg-blue-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'}`}>
                        <FileCode size={32} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl text-white group-hover:text-blue-300 transition-colors">File Forensics</h3>
                        <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">Malicious code detection in attachments.</p>
                    </div>
                </button>

            </div>

      {/* ACTIVE SCANNER AREA */}
      {activeMode && (
          <div id="active-tool-area" className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 scroll-mt-32">
            
            {/* Gradient Glow Background */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600 rounded-[2rem] opacity-50 blur-xl animate-pulse print:hidden"></div>
                
                <div className="bg-black/80 border border-slate-700/50 rounded-[2rem] overflow-hidden shadow-2xl relative z-10 backdrop-blur-xl">
                    
                    {/* Close/Reset Button */}
                    <button onClick={handleBack} className="absolute top-6 right-6 p-2 bg-slate-900/50 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all z-20 border border-white/5">
                        <X size={20} />
                    </button>

                    <div className="p-8 md:p-10">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                            <div className={`p-3 rounded-2xl bg-slate-900 border ${header.border} shadow-lg`}>
                                <header.icon size={28} className={header.color} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">{header.title}</h2>
                                <p className="text-sm text-emerald-400 font-mono tracking-wide uppercase">System Online • Ready</p>
                            </div>
                        </div>
                        
                        {/* 1. TEXT SCANNER INPUT */}
                        {activeMode === 'text' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Raw Email Payload</label>
                                    <div className="flex gap-2">
                                        <button onClick={handleSafePreset} className="text-xs font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-full transition-colors border border-emerald-500/20 hover:border-emerald-500/50">
                                            Load Safe
                                        </button>
                                        <button onClick={handlePhishingPreset} className="text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-4 py-2 rounded-full transition-colors border border-rose-500/20 hover:border-rose-500/50">
                                            Load Phishing
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={textInput}
                                    onChange={(e) => { setTextInput(e.target.value); if (error) setError(null); }}
                                    placeholder={`Subject: ...\nFrom: ...\n\nPaste full email headers and body here...`}
                                    className={`w-full h-72 bg-slate-950/80 border rounded-2xl p-6 font-mono text-sm text-emerald-100 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all resize-none shadow-inner ${error ? 'border-rose-500/50 focus:ring-rose-500/50' : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'}`}
                                />
                            </div>
                        )}

                        {/* 2. URL SCANNER INPUT */}
                        {(activeMode === 'url') && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Target URL</label>
                                    <button onClick={handleUrlPreset} className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline">
                                        Load Malicious Example
                                    </button>
                                </div>
                                <div className="relative">
                                    <Link size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" />
                                    <input
                                        type="text"
                                        value={urlInput}
                                        onChange={(e) => { setUrlInput(e.target.value); if (error) setError(null); }}
                                        placeholder="https://suspicious-site.com/login"
                                        className={`w-full bg-slate-950/80 border rounded-2xl py-5 pl-14 pr-6 font-mono text-sm text-cyan-100 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all shadow-inner ${error ? 'border-rose-500/50 focus:ring-rose-500/50' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'}`}
                                    />
                                </div>
                            </div>
                        )}

                         {/* 3. API KEY SCANNER INPUT */}
                        {activeMode === 'apikey' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Secret String</label>
                                    <button onClick={handleKeyPreset} className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline">
                                        Load Leaked Key Example
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" />
                                    <input
                                        type="text"
                                        value={keyInput}
                                        onChange={(e) => { setKeyInput(e.target.value); if (error) setError(null); }}
                                        placeholder="sk_live_..."
                                        className={`w-full bg-slate-950/80 border rounded-2xl py-5 pl-14 pr-6 font-mono text-sm text-amber-100 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all shadow-inner ${error ? 'border-rose-500/50 focus:ring-rose-500/50' : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'}`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 4. VISUAL SCANNER INPUT */}
                        {activeMode === 'image' && (
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Screenshot Analysis</label>
                                <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all relative group overflow-hidden ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-700 bg-slate-950/50 hover:border-purple-500/50 hover:bg-slate-900'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'scan')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {imagePreview ? (
                                        <div className="relative z-20">
                                            <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-xl shadow-2xl border border-slate-700" />
                                            <div className="mt-4 text-purple-400 text-sm font-medium">Click to change image</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 text-slate-400 relative z-20">
                                            <div className="w-20 h-20 rounded-full bg-slate-900 mx-auto flex items-center justify-center border border-slate-700 group-hover:border-purple-500/50 group-hover:text-purple-500 transition-all group-hover:scale-110 shadow-lg">
                                                <Upload className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-white">Drop screenshot here</p>
                                                <p className="text-sm mt-1">or click to browse</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 5. MOBILE GUARD INPUT (NEW) */}
                        {activeMode === 'mobile' && (
                            <div className="space-y-6">
                                {/* Sub-mode Toggle */}
                                <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
                                    <button 
                                        onClick={() => setMobileMode('sms')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${mobileMode === 'sms' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <MessageSquare size={16} /> SMS / Text
                                    </button>
                                    <button 
                                        onClick={() => setMobileMode('qr')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${mobileMode === 'qr' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <QrCode size={16} /> Scan QR
                                    </button>
                                </div>

                                {mobileMode === 'sms' ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Suspicious Message</label>
                                            <button onClick={handleSmsPreset} className="text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline">
                                                Load Smishing Example
                                            </button>
                                        </div>
                                        <textarea
                                            value={smsInput}
                                            onChange={(e) => { setSmsInput(e.target.value); if (error) setError(null); }}
                                            placeholder="Paste the SMS content here..."
                                            className={`w-full h-40 bg-slate-950/80 border rounded-2xl p-6 font-mono text-sm text-orange-100 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all resize-none shadow-inner ${error ? 'border-rose-500/50 focus:ring-rose-500/50' : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'}`}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Upload QR Image</label>
                                        <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all relative group overflow-hidden ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-700 bg-slate-950/50 hover:border-orange-500/50 hover:bg-slate-900'}`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'qr')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            {qrPreview ? (
                                                <div className="relative z-20">
                                                    <img src={qrPreview} alt="QR Preview" className="h-40 mx-auto rounded-lg shadow-2xl border border-slate-700" />
                                                    <div className="mt-4 text-orange-400 text-sm font-medium">Click to change QR</div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 text-slate-400 relative z-20">
                                                    <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto flex items-center justify-center border border-slate-700 group-hover:border-orange-500/50 group-hover:text-orange-500 transition-all shadow-lg">
                                                        <QrCode className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">Upload QR Code</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 6. FILE FORENSICS INPUT (NEW) */}
                        {activeMode === 'file' && (
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Analyze Suspicious File</label>
                                <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all relative group overflow-hidden ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-700 bg-slate-950/50 hover:border-blue-500/50 hover:bg-slate-900'}`}>
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {fileContent ? (
                                        <div className="relative z-20 space-y-4">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 mx-auto flex items-center justify-center border border-blue-500/50 text-blue-400">
                                                <FileCode size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg truncate max-w-xs mx-auto">{fileContent.name}</h3>
                                                <p className="text-sm text-blue-400">Ready for analysis</p>
                                            </div>
                                            <div className="bg-slate-950 p-3 rounded-lg text-left text-xs font-mono text-slate-500 h-24 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 pointer-events-none"></div>
                                                {fileContent.content}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 text-slate-400 relative z-20">
                                            <div className="w-20 h-20 rounded-full bg-slate-900 mx-auto flex items-center justify-center border border-slate-700 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-all group-hover:scale-110 shadow-lg">
                                                <FileWarning className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-white">Drop File Here</p>
                                                <p className="text-xs mt-1 text-slate-500">Supports: All file types (Max 50MB)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 flex items-center gap-3 text-rose-200 text-sm bg-rose-500/10 p-4 rounded-xl border border-rose-500/30 animate-in slide-in-from-top-2 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                                <AlertCircle size={20} className="text-rose-500" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <div className="mt-8">
                            <button
                                onClick={handleScan}
                                disabled={isLoading}
                                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] text-white overflow-hidden relative group border border-white/10
                                ${activeMode === 'text' ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-900/40' : ''}
                                ${activeMode === 'url' ? 'bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 shadow-cyan-900/40' : ''}
                                ${activeMode === 'apikey' ? 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 shadow-amber-900/40' : ''}
                                ${activeMode === 'image' ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-purple-900/40' : ''}
                                ${activeMode === 'mobile' ? 'bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 shadow-orange-900/40' : ''}
                                ${activeMode === 'file' ? 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 shadow-blue-900/40' : ''}
                                `}
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12 print:hidden"></div>
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Play size={24} fill="currentColor" />}
                                {isLoading ? 'PROCESSING NEURAL NET...' : 'INITIATE ANALYSIS'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Result Section */}
            {scanResult && (
                <div ref={resultRef} className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-500 scroll-mt-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent flex-1"></div>
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 px-6 py-2 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <ShieldCheck size={18} />
                            <span className="font-bold text-sm tracking-widest uppercase">Analysis Complete</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent flex-1"></div>
                    </div>
                    
                    <AnalysisResultCard result={scanResult.result} />
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Scanner;