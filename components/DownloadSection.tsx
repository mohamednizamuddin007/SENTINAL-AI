import React from 'react';
import { Download, Chrome, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const DownloadSection: React.FC = () => {
  
  const handleDownload = () => {
    // Dynamically create a manifest.json and background script to simulate a real extension download
    const manifest = {
      "manifest_version": 3,
      "name": "SentinelAI Phishing Defense",
      "version": "1.0",
      "description": "AI-powered real-time phishing detection for Gmail",
      "permissions": ["activeTab", "storage"],
      "action": {
        "default_popup": "popup.html"
      }
    };

    const readme = `
HOW TO INSTALL SENTINEL AI (DEVELOPER MODE):

1. Extract this zip file (simulated).
2. Open Chrome and go to chrome://extensions
3. Enable "Developer mode" in the top right.
4. Click "Load unpacked" and select this folder.
5. The SentinelAI shield icon will appear in your toolbar.
    `;

    // Create a blob and download it (Simulating the zip package)
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(manifest, null, 2) + "\n\n" + readme], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "sentinel-ai-extension-package.json"; // Using JSON for safety in this demo env
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Protect Your Browser</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Download the SentinelAI Companion Extension to enable real-time overlay detection 
            directly inside Gmail, Outlook, and other webmail providers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Preview Card */}
        <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <Chrome size={64} className="text-slate-700" />
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                        <Shield size={32} className="text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">SentinelAI Defense</h3>
                        <p className="text-slate-400 text-sm">v2.4.0 • Enterprise Grade</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={18} className="text-emerald-500" />
                        <span>Real-time Phishing Overlays</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={18} className="text-emerald-500" />
                        <span>Background Link Scanning</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={18} className="text-emerald-500" />
                        <span>Zero-Day Attack Prevention</span>
                    </div>
                </div>

                <button 
                    onClick={handleDownload}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    <Download size={20} />
                    Add to Chrome
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">
                    Compatible with Chrome, Brave, Edge & Opera
                </p>
            </div>
        </div>

        {/* Instructions */}
        <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-amber-500" size={20} />
                    Installation Guide
                </h3>
                <ol className="space-y-4 text-slate-300 list-decimal pl-5">
                    <li>
                        <span className="text-white font-medium">Download the Package:</span> Click the button to get the extension manifest.
                    </li>
                    <li>
                        <span className="text-white font-medium">Open Extensions Menu:</span> Navigate to <code className="bg-slate-800 px-1 py-0.5 rounded text-xs">chrome://extensions</code>
                    </li>
                    <li>
                        <span className="text-white font-medium">Developer Mode:</span> Toggle the switch in the top-right corner.
                    </li>
                    <li>
                        <span className="text-white font-medium">Load Unpacked:</span> Select the folder containing the downloaded files.
                    </li>
                </ol>
            </div>

            <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400">
                    <span className="text-emerald-400 font-bold">Note:</span> Once installed, the extension will automatically sync with this dashboard using your browser's local storage.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DownloadSection;