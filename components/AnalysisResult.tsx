import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { AlertTriangle, CheckCircle, XCircle, Terminal, Eye, Link as LinkIcon, Cpu } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResult;
}

const AnalysisResultCard: React.FC<AnalysisResultProps> = ({ result }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.MALICIOUS: return 'text-rose-500 border-rose-500/50 bg-rose-500/5';
      case RiskLevel.SUSPICIOUS: return 'text-amber-500 border-amber-500/50 bg-amber-500/5';
      case RiskLevel.SAFE: return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/5';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.MALICIOUS: return <XCircle className="w-16 h-16 text-rose-500" />;
      case RiskLevel.SUSPICIOUS: return <AlertTriangle className="w-16 h-16 text-amber-500" />;
      case RiskLevel.SAFE: return <CheckCircle className="w-16 h-16 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Summary */}
      <div className={`rounded-xl border p-6 flex items-center gap-6 ${getRiskColor(result.riskLevel)}`}>
        <div className="shrink-0">
          {getRiskIcon(result.riskLevel)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold tracking-tight">{result.riskLevel}</h2>
            <div className="text-4xl font-black font-mono opacity-80">{result.riskScore}<span className="text-xl font-normal text-slate-400">/100</span></div>
          </div>
          <p className="text-lg opacity-90">{result.summary}</p>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* NLP Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-purple-400">
            <Terminal size={20} />
            <h3 className="font-semibold text-slate-200">Psychological & NLP Analysis</h3>
          </div>
          <div className="space-y-2">
            {result.threats.nlp.length > 0 ? (
              result.threats.nlp.map((threat, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-rose-500 mt-1">×</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-500 text-sm italic">No linguistic threats detected.</span>
            )}
          </div>
        </div>

        {/* URL Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <LinkIcon size={20} />
            <h3 className="font-semibold text-slate-200">Domain & URL Inspection</h3>
          </div>
          <div className="space-y-2">
            {result.threats.url.length > 0 ? (
              result.threats.url.map((threat, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-rose-500 mt-1">×</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-500 text-sm italic">No suspicious links found.</span>
            )}
          </div>
        </div>

         {/* Visual Analysis */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <Eye size={20} />
            <h3 className="font-semibold text-slate-200">Computer Vision Checks</h3>
          </div>
          <div className="space-y-2">
            {result.threats.visual.length > 0 ? (
              result.threats.visual.map((threat, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-rose-500 mt-1">×</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-500 text-sm italic">No visual anomalies detected.</span>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Cpu size={20} />
            <h3 className="font-semibold text-slate-200">Technical Signals</h3>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">SPF/DKIM/DMARC</span>
                <span className={`font-mono ${result.technicalDetails.spfDkimCheck.includes('FAIL') ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {result.technicalDetails.spfDkimCheck}
                </span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Domain Age</span>
                <span className="font-mono text-slate-200">{result.technicalDetails.domainAge}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">AI Generation Probability</span>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${result.technicalDetails.aiProbability > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{width: `${result.technicalDetails.aiProbability}%`}}
                        ></div>
                    </div>
                    <span className="font-mono text-slate-200">{result.technicalDetails.aiProbability}%</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResultCard;