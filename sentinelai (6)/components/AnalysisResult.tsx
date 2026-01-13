import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { AlertTriangle, CheckCircle, XCircle, Terminal, Eye, Link as LinkIcon, Cpu, ThumbsUp, ThumbsDown, AlertOctagon, Download, Printer } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResult;
}

const AnalysisResultCard: React.FC<AnalysisResultProps> = ({ result }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.MALICIOUS: return 'text-rose-500 bg-rose-500/5';
      case RiskLevel.SUSPICIOUS: return 'text-amber-500 bg-amber-500/5';
      case RiskLevel.SAFE: return 'text-emerald-500 bg-emerald-500/5';
    }
  };
  
  const getGradientBorder = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.MALICIOUS: return 'from-rose-500 via-orange-500 to-red-500';
      case RiskLevel.SUSPICIOUS: return 'from-amber-400 via-orange-400 to-yellow-500';
      case RiskLevel.SAFE: return 'from-emerald-400 via-teal-400 to-green-500';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.MALICIOUS: return <XCircle className="w-16 h-16 text-rose-500" />;
      case RiskLevel.SUSPICIOUS: return <AlertTriangle className="w-16 h-16 text-amber-500" />;
      case RiskLevel.SAFE: return <CheckCircle className="w-16 h-16 text-emerald-500" />;
    }
  };

  const getRecommendation = (level: RiskLevel) => {
      switch (level) {
          case RiskLevel.MALICIOUS:
              return {
                  text: "CRITICAL ACTION: Block this sender immediately. Do not click links or download attachments. Report to IT Security.",
                  bg: "bg-rose-950/50 border-rose-900",
                  icon: <AlertOctagon className="text-rose-500" size={20} />
              };
          case RiskLevel.SUSPICIOUS:
              return {
                  text: "CAUTION ADVISED: Verify this request through a secondary channel (e.g. call the sender). Do not input credentials.",
                  bg: "bg-amber-950/50 border-amber-900",
                  icon: <ThumbsDown className="text-amber-500" size={20} />
              };
          case RiskLevel.SAFE:
              return {
                  text: "SAFE TO PROCEED: No malicious indicators detected. Standard security hygiene still applies.",
                  bg: "bg-emerald-950/50 border-emerald-900",
                  icon: <ThumbsUp className="text-emerald-500" size={20} />
              };
      }
  };

  const rec = getRecommendation(result.riskLevel);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="analysis-report" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Summary Header with Animated Gradient Border */}
      <div className="relative group rounded-xl perspective-1000 print:shadow-none print:border-none">
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${getGradientBorder(result.riskLevel)} rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt print:hidden`}></div>
        
        <div className={`relative rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl overflow-hidden ${getRiskColor(result.riskLevel)} print:bg-white print:text-black print:border-black`}>
            
            {/* Scanning Laser Beam Overlay */}
            <div className="absolute inset-0 w-full h-[5px] bg-white/20 blur-md animate-scan-beam z-10 pointer-events-none shadow-[0_0_15px_white] print:hidden"></div>

            <div className="shrink-0 animate-bounce delay-700 relative z-20 print:animate-none">
                {getRiskIcon(result.riskLevel)}
            </div>
            <div className="flex-1 relative z-20 text-center md:text-left">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold tracking-tight">{result.riskLevel}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-black font-mono opacity-80">{result.riskScore}<span className="text-xl font-normal opacity-60">/100</span></div>
                        <button 
                            onClick={handlePrint}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700 print:hidden"
                            title="Download PDF Report"
                        >
                            <Printer size={16} />
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>
                <p className="text-lg opacity-90 leading-relaxed">{result.summary}</p>
            </div>
        </div>
      </div>

      {/* 2. Action Recommendation Banner */}
      <div className={`p-4 rounded-lg border flex items-center gap-3 shadow-lg ${rec.bg} print:bg-gray-100 print:text-black print:border-black`}>
        <div className="shrink-0">
            {rec.icon}
        </div>
        <span className="font-semibold text-slate-200 print:text-black tracking-wide">{rec.text}</span>
      </div>

      {/* 3. Detailed Forensic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:space-y-6">
        
        {/* NLP Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-500/50 transition-colors shadow-lg hover:shadow-purple-900/10 hover:-translate-y-1 duration-300 print:bg-white print:text-black print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4 text-purple-400 print:text-purple-700">
            <Terminal size={20} />
            <h3 className="font-semibold text-slate-200 print:text-black">Analysis Findings</h3>
          </div>
          <div className="space-y-2">
            {result.threats.nlp.length > 0 ? (
              result.threats.nlp.map((threat, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-950/50 p-2 rounded border border-slate-800/50 print:bg-gray-50 print:text-black print:border-gray-200">
                  <span className="text-rose-500 mt-1">×</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-500 text-sm italic flex items-center gap-2 print:text-gray-600">
                  <CheckCircle size={14} className="text-emerald-500"/> No suspicious indicators found.
              </span>
            )}
          </div>
        </div>

        {/* URL / Source Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors shadow-lg hover:shadow-blue-900/10 hover:-translate-y-1 duration-300 print:bg-white print:text-black print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4 text-blue-400 print:text-blue-700">
            <LinkIcon size={20} />
            <h3 className="font-semibold text-slate-200 print:text-black">Source & Link Inspection</h3>
          </div>
          <div className="space-y-2">
            {result.threats.url.length > 0 ? (
              result.threats.url.map((threat, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-950/50 p-2 rounded border border-slate-800/50 print:bg-gray-50 print:text-black print:border-gray-200">
                  <span className="text-rose-500 mt-1">×</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-500 text-sm italic flex items-center gap-2 print:text-gray-600">
                  <CheckCircle size={14} className="text-emerald-500"/> No suspicious sources found.
              </span>
            )}
          </div>
        </div>

         {/* Visual Analysis (Only show if data exists or not DarkWeb/Text only) */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors shadow-lg hover:shadow-amber-900/10 hover:-translate-y-1 duration-300 print:bg-white print:text-black print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4 text-amber-400 print:text-amber-700">
            <Eye size={20} />
            <h3 className="font-semibold text-slate-200 print:text-black">Visual & Structure Checks</h3>
          </div>
          <div className="space-y-2">
            {result.threats.visual.length > 0 ? (
              result.threats.visual.map((threat, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-950/50 p-2 rounded border border-slate-800/50 print:bg-gray-50 print:text-black print:border-gray-200">
                  <span className="text-rose-500 mt-1">×</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-500 text-sm italic flex items-center gap-2 print:text-gray-600">
                  <CheckCircle size={14} className="text-emerald-500"/> No anomalies detected.
              </span>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-colors shadow-lg hover:shadow-emerald-900/10 hover:-translate-y-1 duration-300 print:bg-white print:text-black print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 print:text-emerald-700">
            <Cpu size={20} />
            <h3 className="font-semibold text-slate-200 print:text-black">Technical Signals</h3>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 print:border-gray-200">
                <span className="text-slate-400 print:text-gray-600">Verification / Source</span>
                <span className={`font-mono px-2 py-0.5 rounded ${result.technicalDetails.spfDkimCheck.includes('FAIL') ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'} print:bg-transparent print:text-black print:font-bold`}>
                    {result.technicalDetails.spfDkimCheck}
                </span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 print:border-gray-200">
                <span className="text-slate-400 print:text-gray-600">Domain Age / Entropy</span>
                <span className="font-mono text-slate-200 print:text-black">{result.technicalDetails.domainAge}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 print:text-gray-600">AI Gen. Probability</span>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden print:hidden">
                        <div 
                            className={`h-full ${result.technicalDetails.aiProbability > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{width: `${result.technicalDetails.aiProbability}%`}}
                        ></div>
                    </div>
                    <span className="font-mono text-slate-200 print:text-black">{result.technicalDetails.aiProbability}%</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResultCard;