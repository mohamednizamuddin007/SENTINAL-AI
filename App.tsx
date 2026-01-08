import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import ExtensionPopup from './components/ExtensionPopup';
import SecurityAdvisor from './components/SecurityAdvisor';
import DownloadSection from './components/DownloadSection';
import Settings from './components/Settings';
import AnalysisResultCard from './components/AnalysisResult';
import { AppView, ScanHistoryItem, RiskLevel } from './types';
import { ShieldCheck, AlertTriangle, X, CheckCircle, Info, Loader2, ArrowLeft, Chrome, Mail, Key, Eye, EyeOff, Lock } from 'lucide-react';

// --- Utility to Generate Mock History based on current date ---
const generateInitialHistory = (userEmail: string): ScanHistoryItem[] => {
    const history: ScanHistoryItem[] = [];
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    // Generate some past scans for the chart
    for (let i = 0; i < 8; i++) {
        const timeOffset = Math.floor(Math.random() * 7) * day + Math.floor(Math.random() * day);
        const isSafe = Math.random() > 0.3;
        
        history.push({
            id: `init-${i}`,
            timestamp: now - timeOffset,
            subject: isSafe ? "Project Update: Q3 Roadmap" : "URGENT: Verify your account",
            sender: isSafe ? "sarah.team@company.com" : "security@update-verify-now.net",
            type: 'text',
            result: {
                riskScore: isSafe ? 10 : 85 + Math.floor(Math.random() * 10),
                riskLevel: isSafe ? RiskLevel.SAFE : RiskLevel.MALICIOUS,
                summary: isSafe ? "Safe internal email." : "Phishing detected.",
                threats: { nlp: [], url: [], visual: [] },
                technicalDetails: { spfDkimCheck: isSafe ? "PASS" : "FAIL", domainAge: "Unknown", aiProbability: 0 }
            }
        });
    }
    return history.sort((a, b) => a.timestamp - b.timestamp);
};

// --- DYNAMIC LOGIN VIEW ---
const LoginView: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [step, setStep] = useState<'form' | 'authenticating' | 'consent'>('form');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        setError("Please enter a valid email address.");
        return;
    }

    // 1. Start Authentication Simulation
    setStep('authenticating');
    setStatus("Contacting Google Identity Platform...");

    setTimeout(() => {
        setStatus("Verifying credentials...");
        setTimeout(() => {
            // Success - Move to Consent Screen
            setStep('consent');
        }, 1500);
    }, 1500);
  };

  const handleConsent = () => {
      // 2. User Grants Permission
      onLogin(email);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-600/10 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full p-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl relative z-10 mx-4 animate-in fade-in zoom-in duration-500">
        
        {/* Logo Header */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6 ring-1 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {step === 'authenticating' ? (
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                ) : step === 'consent' ? (
                    <Chrome className="w-10 h-10 text-blue-500" />
                ) : (
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SENTINEL<span className="text-emerald-500">AI</span></h1>
            <p className="text-slate-400 text-sm">Enterprise Phishing Defense Platform</p>
        </div>

        {/* STEP 1: CREDENTIALS FORM */}
        {step === 'form' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative group">
                        <Key className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-10 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                        <AlertTriangle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <button 
                    type="submit"
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    Verify & Connect
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                    <Lock size={12} />
                    <span>Credentials encrypted via SSL/TLS before transmission</span>
                </div>
            </form>
        )}

        {/* STEP 2: AUTHENTICATING STATE */}
        {step === 'authenticating' && (
            <div className="space-y-6 py-4 animate-in fade-in duration-500">
                 <div className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <h3 className="text-white font-medium">Authenticating with Google...</h3>
                        <span className="text-xs font-mono text-slate-400">{status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-blue-500 animate-progress origin-left w-full duration-[3000ms] transition-all"></div>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 3: OAUTH CONSENT SCREEN */}
        {step === 'consent' && (
            <div className="animate-in fade-in slide-in-from-right-4">
                <div className="bg-white text-slate-900 rounded-xl p-6 shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <Chrome className="text-slate-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Sign in with Google</h3>
                            <p className="text-xs text-slate-500">SentinelAI wants access to your Google Account</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                {email.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">{email}</p>
                                <p className="text-xs text-slate-500">user</p>
                            </div>
                        </div>

                        <p className="text-sm font-medium mt-4">This will allow SentinelAI to:</p>
                        <ul className="text-sm text-slate-600 space-y-2 pl-1">
                            <li className="flex items-start gap-2">
                                <Info size={16} className="mt-0.5 text-blue-600 shrink-0" />
                                <span>Read your email metadata and headers to detect phishing patterns.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Info size={16} className="mt-0.5 text-blue-600 shrink-0" />
                                <span>View your email address for identity verification.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={() => setStep('form')}
                            className="flex-1 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConsent}
                            className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md"
                        >
                            Allow
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-500 mt-4">
                    By clicking Allow, you agree to the SentinelAI Terms of Service and Privacy Policy.
                </p>
            </div>
        )}

      </div>
    </div>
  );
};

interface AlertToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);
  const [toasts, setToasts] = useState<AlertToast[]>([]);

  // --- Real-time Email Simulation Engine ---
  useEffect(() => {
    if (!userEmail) return;

    const interval = setInterval(() => {
        // Random chance to receive an email (20% chance every 8 seconds)
        if (Math.random() > 0.8) {
            const isPhishing = Math.random() > 0.7; // 30% chance it's bad
            const newMail: ScanHistoryItem = {
                id: `live-${Date.now()}`,
                timestamp: Date.now(),
                subject: isPhishing ? "Account Suspended: Immediate Action" : "Weekly Digest",
                sender: isPhishing ? "support@google-security-verify.com" : "newsletter@techworld.com",
                type: 'text',
                result: {
                    riskScore: isPhishing ? 92 : 5,
                    riskLevel: isPhishing ? RiskLevel.MALICIOUS : RiskLevel.SAFE,
                    summary: isPhishing ? "Phishing detected via Live Stream." : "Safe incoming mail.",
                    threats: { nlp: [], url: [], visual: [] },
                    technicalDetails: { spfDkimCheck: isPhishing ? "FAIL" : "PASS", domainAge: "Unknown", aiProbability: 0 }
                }
            };
            
            // Update history
            setHistory(prev => [...prev, newMail]);
            
            // Notify User
            if(isPhishing) {
                addToast("Threat Blocked", `Malicious email from ${newMail.sender} intercepted.`, 'error');
            }
        }
    }, 8000);

    return () => clearInterval(interval);
  }, [userEmail]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setHistory(generateInitialHistory(email));
    
    setTimeout(() => {
        addToast("Permission Granted", `SentinelAI API access enabled for ${email}`, "success");
    }, 500);
  };

  const handleScanComplete = (item: ScanHistoryItem) => {
    setHistory(prev => [...prev, item]);
    if (item.result.riskLevel === RiskLevel.MALICIOUS) {
        addToast("Threat Detected", "Malicious content blocked successfully.", "error");
    } else if (item.result.riskLevel === RiskLevel.SAFE) {
        addToast("Scan Verified", "Content appears safe.", "success");
    } else {
        addToast("Warning", "Suspicious elements detected.", "warning");
    }
  };

  const addToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
        removeToast(id);
    }, 6000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleExtensionThreat = useCallback((details: { title: string; message: string; severity: string }) => {
    addToast(details.title, details.message, 'error');
  }, [addToast]);

  const handleViewReport = (item: ScanHistoryItem) => {
      setSelectedScan(item);
      setCurrentView(AppView.REPORT);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            history={history} 
            userEmail={userEmail || "Guest"}
            onNavigateToScan={() => setCurrentView(AppView.SCANNER)} 
            onViewReport={handleViewReport}
          />
        );
      case AppView.SCANNER:
        return <Scanner onScanComplete={handleScanComplete} />;
      case AppView.ADVISOR:
        return <SecurityAdvisor />;
      case AppView.EXTENSION_SIM:
        return <ExtensionPopup onThreatDetected={handleExtensionThreat} />;
      case AppView.DOWNLOAD:
        return <DownloadSection />;
      case AppView.SETTINGS:
        // Pass dynamic userEmail to Settings
        return <Settings userEmail={userEmail || "Guest"} />;
      case AppView.REPORT:
        if (!selectedScan) return <Dashboard history={history} userEmail={userEmail || "Guest"} onNavigateToScan={() => setCurrentView(AppView.SCANNER)} onViewReport={handleViewReport} />;
        return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                    onClick={() => setCurrentView(AppView.DASHBOARD)}
                    className="mb-6 flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <div className="mb-4">
                     <h2 className="text-2xl font-bold text-slate-100">{selectedScan.subject}</h2>
                     <p className="text-slate-500 font-mono text-sm mt-1">From: {selectedScan.sender}</p>
                </div>
                <AnalysisResultCard result={selectedScan.result} />
            </div>
        );
      default:
        return <Dashboard history={history} userEmail={userEmail || "Guest"} onNavigateToScan={() => setCurrentView(AppView.SCANNER)} onViewReport={handleViewReport} />;
    }
  };

  if (!userEmail) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans selection:bg-emerald-500/30 animate-in fade-in duration-700">
      <Sidebar currentView={currentView} onChangeView={(view) => {
          if (view !== AppView.REPORT) setSelectedScan(null);
          setCurrentView(view);
      }} />
      
      <main className="flex-1 overflow-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 relative">
        <div className="h-full w-full p-6 md:p-8 max-w-7xl mx-auto">
            {renderContent()}
        </div>

        {/* Toast Container */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div 
                    key={toast.id} 
                    className="pointer-events-auto w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl shadow-black/50 p-4 flex items-start gap-3 animate-in slide-in-from-right fade-in duration-300 relative overflow-hidden group"
                >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        toast.type === 'error' ? 'bg-rose-500' : 
                        toast.type === 'warning' ? 'bg-amber-500' : 
                        toast.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="shrink-0 mt-0.5">
                        {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                        {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold mb-0.5 ${
                             toast.type === 'error' ? 'text-rose-400' : 
                             toast.type === 'warning' ? 'text-amber-400' : 
                             toast.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
                        }`}>
                            {toast.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{toast.message}</p>
                    </div>
                    <button 
                        onClick={() => removeToast(toast.id)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
      </main>

      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 z-50"></div>
    </div>
  );
};

export default App;