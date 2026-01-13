import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Lock, UserCheck, MessageSquareWarning, MousePointerClick, FileWarning, SearchCheck, CheckCircle2, XCircle, ChevronRight, BrainCircuit } from 'lucide-react';

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

      {/* Anatomy of an Attack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <SearchCheck className="text-emerald-500" />
                  Red Flags to Watch For
              </h3>
              
              <div className="space-y-6">
                  <div className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400">
                          <MessageSquareWarning size={24} />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold text-slate-200">Artificial Urgency</h4>
                          <p className="text-slate-400 leading-relaxed">
                              "Act now or lose access." Attackers create panic to bypass your critical thinking. Legitimate organizations rarely demand immediate action via email.
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400">
                          <UserCheck size={24} />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold text-slate-200">Authority Impersonation</h4>
                          <p className="text-slate-400 leading-relaxed">
                              Pretending to be a CEO, IT Director, or Vendor. AI can now mimic the writing style and tone of specific executives to make requests seem internal.
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400">
                          <MousePointerClick size={24} />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold text-slate-200">Deceptive Links</h4>
                          <p className="text-slate-400 leading-relaxed">
                              Typosquatting (ex: <code className="bg-slate-800 px-1 rounded text-xs text-rose-300">microsoft-support.net</code> vs <code className="bg-slate-800 px-1 rounded text-xs text-emerald-300">microsoft.com</code>) and obscured redirects are common. Always hover before clicking.
                          </p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="order-1 lg:order-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-rose-500/10 rounded-full blur-[80px] group-hover:bg-rose-500/20 transition-all duration-500"></div>
              
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

const ArrowPointer: React.FC<{className?: string}> = ({className}) => (
    <svg className={`w-6 h-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const PhishingQuiz: React.FC = () => {
    const questions = [
        {
            q: "You receive an email from 'Netflix Support' saying your payment failed. The link points to 'netfIix-secure-update.com'. What is the red flag?",
            options: [
                "The email mentions payment failure.",
                "The domain uses a capital 'I' (capital i) instead of 'l' (lowercase L) - Typosquatting.",
                "Netflix doesn't send emails."
            ],
            correct: 1,
            explanation: "Attackers often use lookalike characters (like I vs l) to create domains that look identical at a glance. Always inspect the URL carefully."
        },
        {
            q: "Your CEO emails you asking for your personal cell number to complete a 'discreet gift card purchase' for staff. What should you do?",
            options: [
                "Reply immediately, it's the CEO.",
                "Call the CEO or check verify with a colleague offline.",
                "Buy the gift cards and expense them."
            ],
            correct: 1,
            explanation: "This is a classic 'CEO Fraud' or BEC (Business Email Compromise) attack. Executive requests for gift cards or urgent wire transfers are almost always scams."
        },
        {
            q: "Which of the following is the SAFEST way to check a suspicious link?",
            options: [
                "Click it and close the tab quickly if it looks bad.",
                "Hover over the link to see the actual destination URL.",
                "Forward it to your friend to ask them."
            ],
            correct: 1,
            explanation: "Hovering allows you to see the real destination without executing any malicious code. Never click a link you aren't 100% sure about."
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

    return (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
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
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                                            : i === selected
                                                ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                                                : 'bg-slate-950/50 border-slate-800 text-slate-500'
                                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:bg-slate-800'
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
                    <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-6">
                        {score === questions.length ? (
                            <ShieldAlert className="text-emerald-500 w-12 h-12" />
                        ) : (
                            <AlertTriangle className="text-amber-500 w-12 h-12" />
                        )}
                    </div>
                    <h4 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h4>
                    <p className="text-slate-400 mb-6">You scored <strong className={score === questions.length ? "text-emerald-400" : "text-amber-400"}>{score} / {questions.length}</strong></p>
                    
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