import React, { useState } from 'react';
import { ScanHistoryItem, RiskLevel } from '../types';
import { analyzeTextContent, analyzeImageContent, analyzeUrlContent, analyzeApiKey } from '../services/geminiService';
import AnalysisResultCard from './AnalysisResult.tsx';
import { PRESET_PHISHING_TEXT } from '../constants';
import { Upload, FileText, Loader2, Play, Globe, Link, Key, AlertCircle } from 'lucide-react';

interface ScannerProps {
  onScanComplete: (item: ScanHistoryItem) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'url' | 'apikey'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanHistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: 'text' | 'image' | 'url' | 'apikey') => {
    setActiveTab(tab);
    setError(null);
    setScanResult(null);
  };

  const handlePreset = () => {
    setTextInput(PRESET_PHISHING_TEXT);
    setError(null);
  };

  const handleUrlPreset = () => {
    setUrlInput("https://secure-login-apple-id.verify-account-updates.com/login");
    setError(null);
  };

  const handleKeyPreset = () => {
    // Fake example key for demonstration
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
        setScanResult(null); // Clear previous result
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseTextInputs = (rawText: string) => {
    // Simple parsing logic for the demo
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

    // Input Validation
    if (activeTab === 'text' && !textInput.trim()) {
        setError("Please enter the email content to analyze.");
        return;
    }
    if (activeTab === 'url' && !urlInput.trim()) {
        setError("Please enter a URL to inspect.");
        return;
    }
    if (activeTab === 'apikey' && !keyInput.trim()) {
        setError("Please enter an API key string to check.");
        return;
    }
    if (activeTab === 'image' && !imagePreview) {
        setError("Please upload an image screenshot first.");
        return;
    }

    setIsLoading(true);
    setScanResult(null);

    try {
      let result;
      let subject = "Manual Scan";
      let sender = "N/A";

      if (activeTab === 'text') {
        const { subject: parsedSubject, sender: parsedSender, body } = parseTextInputs(textInput);
        subject = parsedSubject;
        sender = parsedSender;
        result = await analyzeTextContent(parsedSubject, parsedSender, body);
      } else if (activeTab === 'url') {
        subject = "URL Inspection";
        sender = urlInput;
        result = await analyzeUrlContent(urlInput);
      } else if (activeTab === 'apikey') {
        subject = "Credential Audit";
        sender = "Source Code Scan";
        result = await analyzeApiKey(keyInput);
      } else {
        subject = "Image Scan";
        sender = "Visual Analysis";
        // Strip base64 header for Gemini
        const base64Data = imagePreview!.split(',')[1];
        result = await analyzeImageContent(base64Data);
      }

      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        subject,
        sender,
        type: activeTab,
        result
      };

      setScanResult(historyItem);
      onScanComplete(historyItem);
    } catch (e) {
      console.error(e);
      alert("Scan failed. Check API configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Deep Threat Scanner</h1>
        <p className="text-slate-400 mt-2">
          Manually input email headers, URLs, Keys or upload screenshots for AI-driven forensic analysis.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => handleTabChange('text')}
            className={`flex-1 min-w-[120px] py-4 text-center font-medium transition-colors ${
              activeTab === 'text' ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText size={18} />
              <span className="hidden sm:inline">Text Analysis</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('url')}
            className={`flex-1 min-w-[120px] py-4 text-center font-medium transition-colors ${
              activeTab === 'url' ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe size={18} />
              <span className="hidden sm:inline">URL Inspector</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('apikey')}
            className={`flex-1 min-w-[120px] py-4 text-center font-medium transition-colors ${
              activeTab === 'apikey' ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Key size={18} />
              <span className="hidden sm:inline">Key Leak Check</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('image')}
            className={`flex-1 min-w-[120px] py-4 text-center font-medium transition-colors ${
              activeTab === 'image' ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Upload size={18} />
              <span className="hidden sm:inline">Visual Analysis</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'text' && (
            <div className="space-y-4 animate-in fade-in duration-300">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-300">
                    Raw Email Content (Headers + Body)
                  </label>
                  <button 
                    onClick={handlePreset}
                    className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline"
                  >
                    Load Phishing Example
                  </button>
               </div>
               <textarea
                value={textInput}
                onChange={(e) => {
                    setTextInput(e.target.value);
                    if (error) setError(null);
                }}
                placeholder={`Subject: ...\nFrom: ...\n\nDear User...`}
                className={`w-full h-64 bg-slate-950 border rounded-lg p-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-1 transition-all resize-none ${
                    error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
              />
              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-sm animate-in slide-in-from-top-2 duration-200">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4 animate-in fade-in duration-300">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-300">
                    Suspicious URL
                  </label>
                  <button 
                    onClick={handleUrlPreset}
                    className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline"
                  >
                    Load Malicious Example
                  </button>
               </div>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link size={18} className="text-slate-500" />
                 </div>
                 <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (error) setError(null);
                  }}
                  placeholder="https://example.com"
                  className={`w-full bg-slate-950 border rounded-lg py-3 pl-10 pr-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-1 transition-all ${
                    error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                />
               </div>
               {error ? (
                <div className="flex items-center gap-2 text-rose-400 text-sm animate-in slide-in-from-top-2 duration-200">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
               ) : (
                <p className="text-xs text-slate-500">
                 The AI will analyze the URL structure for typosquatting (e.g., goog1e.com), lookalike domains, and known fraudulent patterns.
                </p>
               )}
            </div>
          )}

          {activeTab === 'apikey' && (
            <div className="space-y-4 animate-in fade-in duration-300">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-300">
                    Potential Secret / API Key
                  </label>
                  <button 
                    onClick={handleKeyPreset}
                    className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline"
                  >
                    Load Example Leaked Key
                  </button>
               </div>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={18} className="text-slate-500" />
                 </div>
                 <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => {
                      setKeyInput(e.target.value);
                      if (error) setError(null);
                  }}
                  placeholder="sk_live_..."
                  className={`w-full bg-slate-950 border rounded-lg py-3 pl-10 pr-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-1 transition-all ${
                    error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                />
               </div>
                {error ? (
                    <div className="flex items-center gap-2 text-rose-400 text-sm animate-in slide-in-from-top-2 duration-200">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                ) : (
                   <p className="text-xs text-slate-500">
                     Analyzes string entropy and known prefixes (e.g., AWS, Stripe, Google) to determine if a string is a sensitive leaked credential.
                   </p>
                )}
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <label className="text-sm font-semibold text-slate-300">
                Upload Email/Message Screenshot
              </label>
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all relative ${
                  error 
                  ? 'border-rose-500/50 bg-rose-500/5 hover:bg-rose-500/10' 
                  : 'border-slate-700 bg-slate-950/50 hover:bg-slate-950 hover:border-emerald-500/50'
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded shadow-lg" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                        <p className="text-white text-sm font-medium">Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className={`space-y-2 ${error ? 'text-rose-400' : 'text-slate-500'}`}>
                    <Upload className="mx-auto w-12 h-12 mb-2 opacity-50" />
                    <p>Drag & drop or click to upload</p>
                    <p className="text-xs">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-sm animate-in slide-in-from-top-2 duration-200">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleScan}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-900/20 active:scale-95 duration-200"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
              {isLoading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {scanResult && (
        <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-slate-500 font-mono text-sm">ANALYSIS REPORT</span>
                <div className="h-px bg-slate-800 flex-1"></div>
            </div>
            <AnalysisResultCard result={scanResult.result} />
        </div>
      )}
    </div>
  );
};

export default Scanner;