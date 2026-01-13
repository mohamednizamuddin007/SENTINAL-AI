import React, { useState, useRef, useEffect } from 'react';
import { ScanHistoryItem, RiskLevel } from '../types';
import { analyzeTextContent, analyzeImageContent, analyzeUrlContent, analyzeApiKey } from '../services/geminiService';
import AnalysisResultCard from './AnalysisResult';
import { PRESET_PHISHING_TEXT } from '../constants';
import { Upload, FileText, Loader2, Play, Globe, Link, Key, AlertCircle, ShieldCheck, ArrowLeft, ScanEye, Search, Lock, X } from 'lucide-react';

interface ScannerProps {
  onScanComplete: (item: ScanHistoryItem) => void;
}

type ScannerMode = 'text' | 'url' | 'apikey' | 'image' | null;

const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [activeMode, setActiveMode] = useState<ScannerMode>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Inputs
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setScanResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
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

    if (activeMode === 'text' && !textInput.trim()) return setError("Please enter content to analyze.");
    if (activeMode === 'url' && !urlInput.trim()) return setError("Please enter a URL.");
    if (activeMode === 'apikey' && !keyInput.trim()) return setError("Please enter a key string.");
    if (activeMode === 'image' && !imagePreview) return setError("Please upload an image.");

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
      }

      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        subject,
        sender,
        type: activeMode!,
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
          case 'text': return { title: 'Email & Text Scanner', icon: FileText, color: 'text-emerald-500', border: 'border-emerald-500/20' };
          case 'url': return { title: 'URL Inspector', icon: Globe, color: 'text-blue-500', border: 'border-blue-500/20' };
          case 'apikey': return { title: 'Secret Key Detector', icon: Key, color: 'text-amber-500', border: 'border-amber-500/20' };
          case 'image': return { title: 'Visual Forensics', icon: ScanEye, color: 'text-purple-500', border: 'border-purple-500/20' };
          default: return { title: 'Scanner', icon: Search, color: 'text-slate-400', border: 'border-slate-800' };
      }
  };

  const header = getHeaderInfo();

  return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="text-center mb-12 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Select a <span className="text-emerald-500">Defense Engine</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    SentinelAI utilizes specialized detection models. Choose the scanner that matches your threat type to begin a deep forensic analysis.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 perspective-1000">
                {/* 1. Text Scanner Button */}
                <button 
                    onClick={() => handleModeSelect('text')}
                    className={`tilt-card p-6 rounded-2xl text-left transition-all border flex flex-col gap-4 relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-950 ${activeMode === 'text' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-800 hover:border-emerald-500/50'}`}
                >
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${activeMode === 'text' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors'}`}>
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">Email Scanner</h3>
                        <p className="text-sm text-slate-400 mt-1">Detects AI-generated phishing patterns and NLP anomalies.</p>
                    </div>
                </button>

                {/* 2. URL Scanner Button */}
                <button 
                    onClick={() => handleModeSelect('url')}
                    className={`tilt-card p-6 rounded-2xl text-left transition-all border flex flex-col gap-4 relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-950 ${activeMode === 'url' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 hover:border-blue-500/50'}`}
                >
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${activeMode === 'url' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors'}`}>
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">URL Inspector</h3>
                        <p className="text-sm text-slate-400 mt-1">Forensic analysis of domains for typosquatting and fraud.</p>
                    </div>
                </button>

                {/* 3. API Key Scanner Button */}
                <button 
                    onClick={() => handleModeSelect('apikey')}
                    className={`tilt-card p-6 rounded-2xl text-left transition-all border flex flex-col gap-4 relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-950 ${activeMode === 'apikey' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-800 hover:border-amber-500/50'}`}
                >
                    <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${activeMode === 'apikey' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-colors'}`}>
                        <Key size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">Key Detector</h3>
                        <p className="text-sm text-slate-400 mt-1">Prevents accidental leaks of high-entropy API secrets.</p>
                    </div>
                </button>

                {/* 4. Visual Scanner Button */}
                <button 
                    onClick={() => handleModeSelect('image')}
                    className={`tilt-card p-6 rounded-2xl text-left transition-all border flex flex-col gap-4 relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-950 ${activeMode === 'image' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-800 hover:border-purple-500/50'}`}
                >
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${activeMode === 'image' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-purple-500 group-hover:text-white transition-colors'}`}>
                        <ScanEye size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">Visual Scan</h3>
                        <p className="text-sm text-slate-400 mt-1">Computer vision analysis of screenshots and logos.</p>
                    </div>
                </button>
            </div>

      {/* ACTIVE SCANNER AREA */}
      {activeMode && (
          <div id="active-tool-area" className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 scroll-mt-32">
            
            {/* Gradient Glow Background */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl opacity-30 blur-xl animate-pulse"></div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative z-10 backdrop-blur-xl">
                    
                    {/* Close/Reset Button */}
                    <button onClick={handleBack} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors z-20">
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-lg bg-slate-950 border ${header.border}`}>
                                <header.icon size={24} className={header.color} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{header.title}</h2>
                                <p className="text-xs text-slate-400">Deep Analysis Engine Active</p>
                            </div>
                        </div>
                        
                        {/* 1. TEXT SCANNER INPUT */}
                        {activeMode === 'text' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-300">Raw Email Content</label>
                                    <div className="flex gap-2">
                                        <button onClick={handleSafePreset} className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full transition-colors border border-emerald-500/20">
                                            Load Safe Example
                                        </button>
                                        <button onClick={handlePhishingPreset} className="text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded-full transition-colors border border-rose-500/20">
                                            Load Phishing Example
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={textInput}
                                    onChange={(e) => { setTextInput(e.target.value); if (error) setError(null); }}
                                    placeholder={`Subject: ...\nFrom: ...\n\nPaste full email headers and body here...`}
                                    className={`w-full h-64 bg-slate-950 border rounded-xl p-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-2 transition-all resize-none ${error ? 'border-rose-500/50' : 'border-slate-800 focus:border-emerald-500'}`}
                                />
                            </div>
                        )}

                        {/* 2. URL SCANNER INPUT */}
                        {(activeMode === 'url') && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-300">Suspicious Link</label>
                                    <button onClick={handleUrlPreset} className="text-xs text-rose-400 hover:text-rose-300 hover:underline">
                                        Load Malicious Example
                                    </button>
                                </div>
                                <div className="relative">
                                    <Link size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        value={urlInput}
                                        onChange={(e) => { setUrlInput(e.target.value); if (error) setError(null); }}
                                        placeholder="https://..."
                                        className={`w-full bg-slate-950 border rounded-xl py-4 pl-12 pr-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-2 transition-all ${error ? 'border-rose-500/50' : 'border-slate-800 focus:border-blue-500'}`}
                                    />
                                </div>
                            </div>
                        )}

                         {/* 3. API KEY SCANNER INPUT */}
                        {activeMode === 'apikey' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-300">Credential String</label>
                                    <button onClick={handleKeyPreset} className="text-xs text-rose-400 hover:text-rose-300 hover:underline">
                                        Load Leaked Key Example
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        value={keyInput}
                                        onChange={(e) => { setKeyInput(e.target.value); if (error) setError(null); }}
                                        placeholder="sk_live_..."
                                        className={`w-full bg-slate-950 border rounded-xl py-4 pl-12 pr-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-2 transition-all ${error ? 'border-rose-500/50' : 'border-slate-800 focus:border-amber-500'}`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 4. VISUAL SCANNER INPUT */}
                        {activeMode === 'image' && (
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-slate-300">Upload Screenshot</label>
                                <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all relative group ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-800 bg-slate-950 hover:border-purple-500/50'}`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-2xl" />
                                    ) : (
                                        <div className="space-y-3 text-slate-400">
                                            <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto flex items-center justify-center border border-slate-800 group-hover:border-purple-500/50 group-hover:text-purple-500 transition-colors animate-pulse">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="font-medium text-slate-300">Click to upload screenshot</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 animate-in slide-in-from-top-2">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="mt-8">
                            <button
                                onClick={handleScan}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl active:scale-[0.98] text-white overflow-hidden relative group
                                ${activeMode === 'text' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/20' : ''}
                                ${activeMode === 'url' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20' : ''}
                                ${activeMode === 'apikey' ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-900/20' : ''}
                                ${activeMode === 'image' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-900/20' : ''}
                                `}
                            >
                                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Play size={24} />}
                                {isLoading ? 'Analyzing...' : 'Run Analysis'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Result Section */}
            {scanResult && (
                <div ref={resultRef} className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500 scroll-mt-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-slate-800 flex-1"></div>
                        <div className="flex items-center gap-2 text-slate-400 bg-slate-800/50 px-4 py-1 rounded-full border border-slate-700">
                            <ShieldCheck size={16} />
                            <span className="font-bold text-sm tracking-wide uppercase">Report Generated</span>
                        </div>
                        <div className="h-px bg-slate-800 flex-1"></div>
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