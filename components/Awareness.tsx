import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Lock, UserCheck, MessageSquareWarning, MousePointerClick, FileWarning, SearchCheck, CheckCircle2, XCircle, ChevronRight, BrainCircuit, UserX, Mail, Globe, Database, Key } from 'lucide-react';

const Awareness: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center p-2 bg-amber-500/10 rounded-lg text-amber-500 mb-2">
            <AlertTriangle size={20} />
            <span className="ml-2 font-bold text-sm tracking-wide">THREAT INTELLIGENCE</span>
        </div>
        <h2 className="text-4xl font-bold text-white">Understand the Threat Landscape</h2>
        <p className="text-slate-400 text-lg">
          Phishing isn't just about "bad grammar" anymore. Modern attacks use psychological manipulation and technical evasion to trick even experts.
        </p>
      </div>

      {/* NEW: Animated Phishing Simulation */}
      <PhishingProcessAnimation />

      {/* Red Flags Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <SearchCheck className="text-emerald-500" />
                  Red Flags to Watch For
              </h3>
              
              <div className="space-y-6">
                  <div className="flex gap-4 group">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-rose-500/50 transition-colors flex items-center justify-center text-rose-400">
                          <MessageSquareWarning size={24} />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold text-slate-200 group-hover:text-rose-400 transition-colors">Artificial Urgency</h4>
                          <p className="text-slate-400 leading-relaxed text-sm">
                              "Act now or lose access." Attackers create panic to bypass your critical thinking. Legitimate organizations rarely demand immediate action via email.
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-4 group">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-rose-500/50 transition-colors flex items-center justify-center text-rose-400">
                          <UserCheck size={24} />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold text-slate-200 group-hover:text-rose-400 transition-colors">Authority Impersonation</h4>
                          <p className="text-slate-400 leading-relaxed text-sm">
                              Pretending to be a CEO, IT Director, or Vendor. AI can now mimic the writing style and tone of specific executives to make requests seem internal.
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-4 group">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-rose-500/50 transition-colors flex items-center justify-center text-rose-400">
                          <MousePointerClick size={24} />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold text-slate-200 group-hover:text-rose-400 transition-colors">Deceptive Links</h4>
                          <p className="text-slate-400 leading-relaxed text-sm">
                              Typosquatting (ex: <code className="bg-slate-800 px-1 rounded text-xs text-rose-300">microsoft-support.net</code> vs <code className="bg-slate-800 px-1 rounded text-xs text-emerald-300">microsoft.com</code>) and obscured redirects are common. Always hover before clicking.
                          </p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="ml-auto text-xs text-slate-500 font-mono">Suspicious_Email.msg</span>
                  </div>

                  <div className="space-y-4 font-mono text-sm">
                      <div className="flex gap-2">
                          <span className="text-slate-500 w-16 text-right">From:</span>
                          <span className="text-rose-400">IT Support &lt;admin@company-update-portal.com&gt;</span>
                      </div>
                      <div className="flex gap-2">
                          <span className="text-slate-500 w-16 text-right">Subject:</span>
                          <span className="text-white font-bold">URGENT: Password Expiry Warning</span>
                      </div>
                      <div className="mt-6 p-4 bg-slate-950 rounded border border-slate-800 text-slate-300">
                          <p className="mb-4">Dear Employee,</p>
                          <p className="mb-4">Your access will be <span className="text-rose-400 font-bold bg-rose-500/10 px-1 rounded">REVOKED</span> in 15 minutes unless you validate your credentials.</p>
                          <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                              Validate Password Now
                          </button>
                      </div>
                  </div>

                  {/* Annotations */}
                  <div className="absolute top-[110px] right-10 flex items-center gap-2 text-rose-400 text-xs font-bold animate-pulse">
                      <ArrowPointer className="rotate-180" /> External Domain!
                  </div>
                  <div className="absolute bottom-[100px] left-10 flex items-center gap-2 text-rose-400 text-xs font-bold animate-pulse">
                      Artificial Urgency! <ArrowPointer />
                  </div>
              </div>
          </div>
      </div>

      {/* Prevention Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-900">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/30 transition-colors">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 text-emerald-400">
                  <ShieldAlert size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Verify the Source</h4>
              <p className="text-slate-400 text-sm">
                  If an email looks weird, contact the sender through a different channel (Slack, SMS, Phone) to confirm they sent it.
              </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-800 text-center hover:border-blue-500/30 transition-colors">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 text-blue-400">
                  <Lock size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Enable MFA</h4>
              <p className="text-slate-400 text-sm">
                  Multi-Factor Authentication is your best defense. Even if they get your password, they can't access your account without the token.
              </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-800 text-center hover:border-purple-500/30 transition-colors">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 text-purple-400">
                  <FileWarning size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Don't Open Attachments</h4>
              <p className="text-slate-400 text-sm">
                  Never open unexpected attachments, especially .zip, .exe, or office docs with macros enabled, from unknown senders.
              </p>
          </div>
      </div>

      {/* Interactive Quiz Section */}
      <div className="pt-12 border-t border-slate-900">
          <PhishingQuiz />
      </div>

    </div>
  );
};

const PhishingProcessAnimation = () => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group mb-16 shadow-2xl">
      {/* Title */}
      <div className="absolute top-6 left-8 z-20">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
            Attack Lifecycle
        </h3>
        <p className="text-slate-400 text-sm mt-1">Live simulation of a credential harvest</p>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="relative h-[400px] w-full mt-8 md:mt-0">
        
        {/* --- NODES --- */}

        {/* 1. Attacker (Top Left) */}
        <div className="absolute top-[15%] left-[5%] md:left-[10%] flex flex-col items-center z-10">
             <div className="w-16 h-16 bg-slate-900 border-2 border-rose-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                <UserX size={32} className="text-rose-500" />
             </div>
             <div className="mt-3 font-mono text-xs text-rose-400 font-bold bg-rose-950/30 px-2 py-1 rounded border border-rose-500/20">ATTACKER</div>
        </div>

        {/* 2. User (Top Right) */}
        <div className="absolute top-[15%] right-[5%] md:right-[10%] flex flex-col items-center z-10">
             <div className="w-16 h-16 bg-slate-900 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <UserCheck size={32} className="text-emerald-500" />
             </div>
             <div className="mt-3 font-mono text-xs text-emerald-400 font-bold bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20">TARGET USER</div>
        </div>

        {/* 3. Phishing Website (Bottom Center) */}
        <div className="absolute bottom-[20%] left-[50%] -translate-x-1/2 flex flex-col items-center z-10">
             <div className="w-20 h-16 bg-slate-900 border-2 border-amber-500/50 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.1)] relative">
                <div className="w-full h-4 border-b border-amber-500/20 bg-slate-800/50 rounded-t-lg flex items-center px-2 gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                </div>
                <Globe size={24} className="text-amber-500 mt-2" />
             </div>
             <div className="mt-3 font-mono text-xs text-amber-400 font-bold bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20">FAKE WEBSITE</div>
             
             {/* Tag: Malicious URL */}
             <div className="absolute -top-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1 border border-rose-400">
                <ShieldAlert size={12} fill="currentColor" /> MALICIOUS URL DETECTED
             </div>
        </div>

        {/* 4. Private Info (Bottom Left) */}
        <div className="absolute bottom-[10%] left-[5%] md:left-[10%] flex flex-col items-center z-10">
             <div className="w-16 h-16 bg-slate-900 border-2 border-blue-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <Database size={32} className="text-blue-500" />
             </div>
             <div className="mt-3 font-mono text-xs text-blue-400 font-bold bg-blue-950/30 px-2 py-1 rounded border border-blue-500/20">PRIVATE DATA</div>
        </div>


        {/* --- PATHS & ANIMATIONS --- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
                </marker>
            </defs>

            {/* Path 1: Attacker -> User */}
            <path d="M 100 80 L 800 80" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" className="hidden md:block opacity-50" markerEnd="url(#arrowhead)" />
            
            {/* Path 2: User -> Website */}
            <path d="M 830 110 L 500 300" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" className="hidden md:block opacity-50" markerEnd="url(#arrowhead)" />

            {/* Path 3: Website -> Attacker (Collection) */}
            <path d="M 460 300 L 130 110" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" className="hidden md:block opacity-50" markerEnd="url(#arrowhead)" />

             {/* Path 4: Attacker -> Private Data */}
             <path d="M 80 110 L 80 300" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" className="hidden md:block opacity-50" markerEnd="url(#arrowhead)" />
        </svg>

        {/* Animated Particles */}
        
        {/* 1. Email (Attacker -> User) */}
        <div className="absolute top-[16%] left-[12%] animate-attack-phase-1 hidden md:block z-20">
            <div className="bg-slate-900 text-rose-400 p-2 rounded-lg border border-rose-500 shadow-lg flex items-center gap-2">
                <Mail size={16} />
                <span className="text-[10px] font-bold">Phishing Email</span>
            </div>
            {/* AI Generated Tag */}
            <div className="absolute -top-4 -right-4 bg-amber-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded animate-pulse border border-white/20">
                AI GENERATED TEXT
            </div>
        </div>

        {/* 2. Click (User -> Website) */}
        <div className="absolute top-[20%] right-[12%] animate-attack-phase-2 hidden md:block z-20 opacity-0">
             <div className="flex items-center gap-1 text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-emerald-500 shadow-lg">
                <MousePointerClick size={14} />
                <span className="text-[10px] font-bold">User Click</span>
             </div>
        </div>

        {/* 3. Credentials (Website -> Attacker) */}
        <div className="absolute bottom-[35%] left-[50%] animate-attack-phase-3 hidden md:block z-20 opacity-0">
             <div className="flex items-center gap-1 text-amber-400 bg-slate-900 px-2 py-1 rounded border border-amber-500 shadow-lg">
                <Key size={14} />
                <span className="text-[10px] font-bold">Credentials</span>
             </div>
        </div>

        {/* 4. Access (Attacker -> Data) */}
        <div className="absolute top-[30%] left-[8%] animate-attack-phase-4 hidden md:block z-20 opacity-0">
             <div className="flex items-center gap-1 text-rose-400 bg-slate-900 px-2 py-1 rounded border border-rose-500 shadow-lg">
                <Lock size={14} className="text-rose-500" />
                <span className="text-[10px] font-bold">Unauth Access</span>
             </div>
        </div>

      </div>

      <style>{`
        @keyframes attack-phase-1 {
            0% { transform: translate(0, 0); opacity: 0; }
            10% { opacity: 1; }
            30% { transform: translate(650px, 0); opacity: 1; }
            40% { transform: translate(650px, 0); opacity: 0; }
            100% { transform: translate(650px, 0); opacity: 0; }
        }
        @keyframes attack-phase-2 {
            0% { opacity: 0; }
            35% { transform: translate(0, 0); opacity: 0; }
            40% { opacity: 1; }
            60% { transform: translate(-300px, 180px); opacity: 1; }
            65% { opacity: 0; }
            100% { opacity: 0; }
        }
        @keyframes attack-phase-3 {
            0% { opacity: 0; }
            60% { transform: translate(0, 0); opacity: 0; }
            65% { opacity: 1; }
            85% { transform: translate(-350px, -180px); opacity: 1; }
            90% { opacity: 0; }
            100% { opacity: 0; }
        }
        @keyframes attack-phase-4 {
            0% { opacity: 0; }
            85% { transform: translate(0, 0); opacity: 0; }
            90% { opacity: 1; }
            100% { transform: translate(0, 180px); opacity: 1; }
        }

        .animate-attack-phase-1 { animation: attack-phase-1 8s linear infinite; }
        .animate-attack-phase-2 { animation: attack-phase-2 8s linear infinite; }
        .animate-attack-phase-3 { animation: attack-phase-3 8s linear infinite; }
        .animate-attack-phase-4 { animation: attack-phase-4 8s linear infinite; }
      `}</style>
    </div>
  );
}

const ArrowPointer: React.FC<{className?: string}> = ({className}) => (
    <svg className={`w-6 h-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const PhishingQuiz: React.FC = () => {
    const questions = [
        {
            q: "You receive an SMS: 'Your USPS package is on hold. Click bit.ly/23x8s to reschedule'. What should you do?",
            options: [
                "Click the link to check the tracking status.",
                "Reply 'STOP' to unsubscribe.",
                "Do not click. Go directly to USPS.com and enter your tracking number if you have one."
            ],
            correct: 2,
            explanation: "Legitimate delivery services rarely use generic URL shorteners (bit.ly) for tracking. Always navigate to the official site directly."
        },
        {
            q: "You download a 'PDF' invoice, but the file icon looks strange and it ends in '.exe'. What is likely happening?",
            options: [
                "It's a self-extracting zip file, which is safe.",
                "It's malware disguised as a document (Double Extension Attack).",
                "It's just a new format for Adobe Reader."
            ],
            correct: 1,
            explanation: "A classic trick is naming a file 'invoice.pdf.exe'. Windows often hides the last extension, making it look like a PDF. Executables (.exe) can install malware instantly."
        },
        {
            q: "A browser popup appears saying 'Microsoft Windows Detected a Virus! Call 1-800-XXX-XXXX immediately'.",
            options: [
                "Call the number to get technical support.",
                "Close the browser tab immediately. Do not call.",
                "Download the 'antivirus' tool suggested by the popup."
            ],
            correct: 1,
            explanation: "Tech Support Scams use scary popups to panic you. Microsoft/Apple will NEVER ask you to call a phone number via a browser popup."
        }
    ];

    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const handleAnswer = (index: number) => {
        setSelected(index);
        setShowExplanation(true);
        if (index === questions[currentQ].correct) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(c => c + 1);
            setSelected(null);
            setShowExplanation(false);
        } else {
            setCompleted(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQ(0);
        setSelected(null);
        setShowExplanation(false);
        setScore(0);
        setCompleted(false);
    };

    const getPerformanceRating = (score: number, total: number) => {
        const percentage = score / total;
        if (percentage === 1) return { title: "Cybersecurity Sentinel", color: "text-emerald-400", message: "Perfect score! You are extremely vigilant." };
        if (percentage >= 0.6) return { title: "Vigilant User", color: "text-amber-400", message: "Good job, but stay sharp on the details." };
        return { title: "Easy Target", color: "text-rose-400", message: "You are at high risk. Please review the training materials." };
    };

    const rating = completed ? getPerformanceRating(score, questions.length) : null;

    return (
        <div className="max-w-3xl mx-auto bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" 
                    style={{width: `${((currentQ + 1) / questions.length) * 100}%`}}
                ></div>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="text-purple-400" size={28} />
                <h3 className="text-2xl font-bold text-white">Phishing IQ Test</h3>
            </div>

            {!completed ? (
                <div>
                    <h4 className="text-xl text-slate-200 font-medium mb-6 leading-relaxed">
                        <span className="text-slate-500 mr-2">Q{currentQ + 1}:</span>
                        {questions[currentQ].q}
                    </h4>

                    <div className="space-y-3">
                        {questions[currentQ].options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => !showExplanation && handleAnswer(i)}
                                disabled={showExplanation}
                                className={`w-full p-4 rounded-xl text-left border transition-all flex justify-between items-center ${
                                    showExplanation
                                        ? i === questions[currentQ].correct
                                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                                            : i === selected
                                                ? 'bg-rose-500/10 border-rose-500/50 text-rose-300'
                                                : 'bg-slate-950/30 border-slate-800 text-slate-500'
                                        : 'bg-slate-950/30 border-slate-800 text-slate-300 hover:border-blue-500/30 hover:bg-slate-800/50'
                                }`}
                            >
                                <span>{opt}</span>
                                {showExplanation && i === questions[currentQ].correct && <CheckCircle2 size={20} className="text-emerald-500" />}
                                {showExplanation && i === selected && i !== questions[currentQ].correct && <XCircle size={20} className="text-rose-500" />}
                            </button>
                        ))}
                    </div>

                    {showExplanation && (
                        <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                            <div className={`p-4 rounded-lg mb-4 text-sm ${selected === questions[currentQ].correct ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                                <strong>{selected === questions[currentQ].correct ? 'Correct!' : 'Incorrect.'}</strong> {questions[currentQ].explanation}
                            </div>
                            <button 
                                onClick={nextQuestion}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-6 border border-slate-700">
                        {score === questions.length ? (
                            <ShieldAlert className="text-emerald-500 w-12 h-12" />
                        ) : score > 0 ? (
                            <AlertTriangle className="text-amber-500 w-12 h-12" />
                        ) : (
                            <FileWarning className="text-rose-500 w-12 h-12" />
                        )}
                    </div>
                    
                    <h4 className={`text-3xl font-bold mb-2 ${rating?.color}`}>{rating?.title}</h4>
                    <p className="text-slate-300 mb-6 font-medium">{rating?.message}</p>
                    
                    <p className="text-slate-400 mb-8 text-sm">
                        You scored <strong className="text-white">{score} / {questions.length}</strong>
                    </p>
                    
                    <button 
                        onClick={resetQuiz}
                        className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold border border-slate-700 transition-colors"
                    >
                        Retake Quiz
                    </button>
                </div>
            )}
        </div>
    );
}

export default Awareness;