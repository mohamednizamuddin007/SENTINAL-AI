import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { AlertTriangle, CheckCircle, XCircle, Terminal, Eye, Link as LinkIcon, Cpu, ThumbsUp, ThumbsDown, AlertOctagon, FileDown, ChevronDown, FileText, FileImage, FileCode, Presentation, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';

interface AnalysisResultProps {
  result: AnalysisResult;
}

const AnalysisResultCard: React.FC<AnalysisResultProps> = ({ result }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.MALICIOUS: return 'text-rose-400 bg-rose-500/5 border-rose-500/20';
      case RiskLevel.SUSPICIOUS: return 'text-amber-400 bg-amber-500/5 border-amber-500/20';
      case RiskLevel.SAFE: return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20';
    }
  };
  
  const getGradientBorder = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.MALICIOUS: return 'from-rose-900 via-red-900 to-orange-900';
      case RiskLevel.SUSPICIOUS: return 'from-amber-900 via-orange-900 to-yellow-900';
      case RiskLevel.SAFE: return 'from-emerald-900 via-teal-900 to-green-900';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.MALICIOUS: return <XCircle className="w-20 h-20 text-rose-500" />;
      case RiskLevel.SUSPICIOUS: return <AlertTriangle className="w-20 h-20 text-amber-500" />;
      case RiskLevel.SAFE: return <CheckCircle className="w-20 h-20 text-emerald-500" />;
    }
  };

  const getRecommendation = (level: RiskLevel) => {
      switch (level) {
          case RiskLevel.MALICIOUS:
              return {
                  text: "CRITICAL ACTION: Block immediately. Do not interact.",
                  bg: "bg-rose-950/30 border-rose-500/20",
                  icon: <AlertOctagon className="text-rose-500" size={24} />
              };
          case RiskLevel.SUSPICIOUS:
              return {
                  text: "CAUTION: Verify source via secondary channel.",
                  bg: "bg-amber-950/30 border-amber-500/20",
                  icon: <ThumbsDown className="text-amber-500" size={24} />
              };
          case RiskLevel.SAFE:
              return {
                  text: "SAFE: No malicious indicators detected.",
                  bg: "bg-emerald-950/30 border-emerald-500/20",
                  icon: <ThumbsUp className="text-emerald-500" size={24} />
              };
      }
  };

  const rec = getRecommendation(result.riskLevel);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  // --- Export Functions ---

  const handleExportText = () => {
    const filename = `SentinelAI_Report_${result.riskLevel}_${timestamp}.txt`;
    const reportContent = `
SENTINEL AI - THREAT INTELLIGENCE REPORT
========================================
Generated: ${new Date().toLocaleString()}
Risk Level: ${result.riskLevel}
Confidence Score: ${result.riskScore}/100

EXECUTIVE SUMMARY
-----------------
${result.summary}

THREAT VECTORS DETECTED
-----------------------
[NLP / Cognitive Analysis]
${result.threats.nlp.length ? result.threats.nlp.map(t => `- ${t}`).join('\n') : '- No anomalies detected.'}

[URL / Link Forensics]
${result.threats.url.length ? result.threats.url.map(t => `- ${t}`).join('\n') : '- No suspicious links detected.'}

[Visual / Structure Analysis]
${result.threats.visual.length ? result.threats.visual.map(t => `- ${t}`).join('\n') : '- No visual anomalies detected.'}

TECHNICAL TELEMETRY
-------------------
Source Verification (SPF/DKIM): ${result.technicalDetails.spfDkimCheck}
Domain Age / Entropy: ${result.technicalDetails.domainAge}
AI Generation Probability: ${result.technicalDetails.aiProbability}%

RECOMMENDATION
--------------
${rec.text}
`.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
        const element = document.getElementById('analysis-report');
        if (!element) return;
        
        const canvas = await html2canvas(element, {
            backgroundColor: '#020617', // Match app background (slate-950)
            scale: 2,
            useCORS: true,
            logging: false
        });
        
        const link = document.createElement('a');
        link.download = `SentinelAI_Report_${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        console.error("Image export failed", e);
    } finally {
        setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
        const element = document.getElementById('analysis-report');
        if (!element) return;

        const canvas = await html2canvas(element, {
            backgroundColor: '#020617', // Dark background for PDF to match app theme
            scale: 2,
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add a dark background rect to PDF before adding image (failsafe)
        pdf.setFillColor(2, 6, 23); // #020617
        pdf.rect(0, 0, pdfWidth, 297, 'F');

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`SentinelAI_Report_${timestamp}.pdf`);
    } catch (e) {
        console.error("PDF export failed", e);
    } finally {
        setIsExporting(false);
    }
  };

  const handleExportWord = () => {
    const filename = `SentinelAI_Report_${timestamp}.doc`;
    
    // HTML with inline Dark Mode Styles for Word
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Report</title></head>
      <body style="font-family: sans-serif; background-color: #020617; color: #cbd5e1;">
        <div style="background-color: #0f172a; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
            <h1 style="color: #ffffff; font-size: 24px; border-bottom: 2px solid #334155; padding-bottom: 15px;">SentinelAI Threat Report</h1>
            <p style="color: #94a3b8;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            
            <div style="margin-top: 20px; padding: 15px; background-color: ${result.riskLevel === 'MALICIOUS' ? '#4c0519' : result.riskLevel === 'SUSPICIOUS' ? '#451a03' : '#064e3b'}; border-radius: 8px; border: 1px solid ${result.riskLevel === 'MALICIOUS' ? '#f43f5e' : result.riskLevel === 'SUSPICIOUS' ? '#f59e0b' : '#10b981'};">
                <h2 style="margin:0; color: #ffffff;">RISK LEVEL: ${result.riskLevel}</h2>
                <p style="margin:5px 0 0 0; color: #e2e8f0;">Confidence Score: <strong>${result.riskScore}/100</strong></p>
            </div>
            
            <h3 style="color: #f8fafc; border-bottom: 1px solid #334155; padding-bottom: 5px; margin-top: 25px;">Executive Summary</h3>
            <p style="line-height: 1.6;">${result.summary}</p>
            
            <h3 style="color: #f8fafc; border-bottom: 1px solid #334155; padding-bottom: 5px; margin-top: 25px;">Threat Indicators</h3>
            
            <h4 style="color: #a78bfa;">Cognitive NLP Analysis</h4>
            <ul style="background-color: #1e293b; padding: 15px 30px; border-radius: 8px;">${result.threats.nlp.length ? result.threats.nlp.map(t => `<li style="margin-bottom: 5px;">${t}</li>`).join('') : '<li>No anomalies detected.</li>'}</ul>
            
            <h4 style="color: #22d3ee;">Link Forensics</h4>
            <ul style="background-color: #1e293b; padding: 15px 30px; border-radius: 8px;">${result.threats.url.length ? result.threats.url.map(t => `<li style="margin-bottom: 5px;">${t}</li>`).join('') : '<li>No suspicious links detected.</li>'}</ul>
            
            <h4 style="color: #fbbf24;">Visual Analysis</h4>
            <ul style="background-color: #1e293b; padding: 15px 30px; border-radius: 8px;">${result.threats.visual.length ? result.threats.visual.map(t => `<li style="margin-bottom: 5px;">${t}</li>`).join('') : '<li>No visual anomalies detected.</li>'}</ul>
            
            <h3 style="color: #f8fafc; border-bottom: 1px solid #334155; padding-bottom: 5px; margin-top: 25px;">Technical Details</h3>
            <div style="background-color: #1e293b; padding: 15px; border-radius: 8px;">
                <p><strong>SPF/DKIM:</strong> ${result.technicalDetails.spfDkimCheck}</p>
                <p><strong>Domain Age:</strong> ${result.technicalDetails.domainAge}</p>
                <p><strong>AI Probability:</strong> ${result.technicalDetails.aiProbability}%</p>
            </div>
            
            <div style="background-color: #1e293b; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 30px; border-radius: 4px;">
                <strong style="color: #ffffff;">Recommendation:</strong> <span style="color: #e2e8f0;">${rec.text}</span>
            </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  const handleExportPPT = async () => {
      setIsExporting(true);
      try {
          const pres = new PptxGenJS();
          pres.layout = 'LAYOUT_16x9';

          // Slide 1: Title
          let slide = pres.addSlide();
          slide.background = { color: '0f172a' }; // Dark Slate
          slide.addText("SentinelAI Threat Report", { x: 1, y: 1.5, fontSize: 36, color: '38bdf8', bold: true });
          slide.addText(`Scan Date: ${new Date().toLocaleDateString()}`, { x: 1, y: 2.5, fontSize: 18, color: '94a3b8' });
          slide.addText(`Risk Level: ${result.riskLevel}`, { 
              x: 1, y: 3.5, fontSize: 24, 
              color: result.riskLevel === 'MALICIOUS' ? 'f43f5e' : result.riskLevel === 'SUSPICIOUS' ? 'fbbf24' : '34d399',
              bold: true 
          });

          // Slide 2: Details
          let slide2 = pres.addSlide();
          slide2.background = { color: '0f172a' };
          slide2.addText("Executive Summary", { x: 0.5, y: 0.5, fontSize: 24, color: 'ffffff', bold: true });
          slide2.addText(result.summary, { x: 0.5, y: 1.0, w: '90%', fontSize: 16, color: 'cbd5e1' });
          
          slide2.addText("Threat Vectors", { x: 0.5, y: 2.5, fontSize: 20, color: '38bdf8', bold: true });
          const threats = [
              ...result.threats.nlp.map(t => `• NLP: ${t}`),
              ...result.threats.url.map(t => `• URL: ${t}`),
              ...result.threats.visual.map(t => `• Visual: ${t}`)
          ];
          slide2.addText(threats.join('\n'), { x: 0.5, y: 3.0, fontSize: 14, color: 'cbd5e1' });

          await pres.writeFile({ fileName: `SentinelAI_Report_${timestamp}.pptx` });
      } catch (e) {
          console.error("PPT export failed", e);
      } finally {
          setIsExporting(false);
          setShowExportMenu(false);
      }
  };

  return (
    <div id="analysis-report" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 relative">
      
      {/* 1. Summary Header */}
      <div className="relative group rounded-[2rem] perspective-1000">
        {/* Reduced opacity */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${getGradientBorder(result.riskLevel)} rounded-[2rem] opacity-20 blur-md group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt`}></div>
        
        <div className={`relative rounded-[2rem] border border-white/5 bg-black/95 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 overflow-hidden backdrop-blur-xl ${getRiskColor(result.riskLevel)}`}>
            
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            
            {/* Scanning Laser Beam Overlay */}
            <div className="absolute inset-0 w-full h-[1px] bg-white/10 blur-sm animate-scan-beam z-10 pointer-events-none"></div>

            <div className="shrink-0 animate-bounce delay-700 relative z-20">
                {getRiskIcon(result.riskLevel)}
            </div>
            
            <div className="flex-1 relative z-20 text-center md:text-left w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <div>
                         <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">{result.riskLevel}</h2>
                         <p className="text-sm font-mono opacity-60 mt-1 uppercase tracking-widest text-slate-400">Confidence Score</p>
                    </div>
                    
                    <div className="flex items-center gap-6 relative">
                        <div className="relative">
                             <div className="text-6xl font-black font-mono tracking-tighter text-white">{result.riskScore}</div>
                             <div className="text-xs text-right opacity-60 text-slate-400">/ 100</div>
                        </div>
                        <div className="w-px h-16 bg-white/10 hidden md:block"></div>
                        
                        {/* Download Menu - Added data-html2canvas-ignore to hide during export */}
                        <div className="relative hidden md:block" data-html2canvas-ignore="true">
                            <button 
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="flex flex-col items-center justify-center w-24 h-16 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all hover:scale-105 active:scale-95 group/btn"
                            >
                                {isExporting ? (
                                    <Loader2 size={24} className="mb-1 text-emerald-400 animate-spin" />
                                ) : (
                                    <FileDown size={24} className="mb-1 text-slate-400 group-hover/btn:text-emerald-400 transition-colors" />
                                )}
                                <span className="text-[10px] font-bold uppercase text-slate-500 group-hover/btn:text-slate-300 flex items-center gap-1">
                                    Export <ChevronDown size={10} />
                                </span>
                            </button>

                            {/* Dropdown */}
                            {showExportMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                                        <FileText size={16} className="text-rose-400" />
                                        <span className="text-sm font-medium">Download PDF</span>
                                    </button>
                                    <button onClick={handleExportImage} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border-t border-slate-800">
                                        <FileImage size={16} className="text-purple-400" />
                                        <span className="text-sm font-medium">Save as Image</span>
                                    </button>
                                    <button onClick={handleExportWord} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border-t border-slate-800">
                                        <FileCode size={16} className="text-blue-400" />
                                        <span className="text-sm font-medium">Export to Word</span>
                                    </button>
                                    <button onClick={handleExportPPT} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border-t border-slate-800">
                                        <Presentation size={16} className="text-orange-400" />
                                        <span className="text-sm font-medium">Export to PPT</span>
                                    </button>
                                    <button onClick={handleExportText} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border-t border-slate-800">
                                        <Terminal size={16} className="text-emerald-400" />
                                        <span className="text-sm font-medium">Raw Text (.txt)</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-md">
                    <p className="text-lg leading-relaxed font-light text-slate-300">{result.summary}</p>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Action Recommendation Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-4 shadow-lg relative overflow-hidden ${rec.bg}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
        <div className="shrink-0 p-3 bg-black/40 rounded-full backdrop-blur-sm relative z-10">
            {rec.icon}
        </div>
        <span className="font-bold text-xl text-slate-200 tracking-wide relative z-10 text-center md:text-left">{rec.text}</span>
      </div>

      {/* 3. Detailed Forensic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* NLP Analysis */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all shadow-sm hover:shadow-lg backdrop-blur-md group">
          <div className="flex items-center gap-3 mb-6 text-purple-400">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/10">
                <Terminal size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-200">Cognitive Analysis</h3>
          </div>
          <div className="space-y-3">
            {result.threats.nlp.length > 0 ? (
              result.threats.nlp.map((threat, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-300 bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-rose-500 mt-0.5 font-bold">✕</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3 text-emerald-500/80">
                  <CheckCircle size={20} />
                  <span className="font-medium">No psychological triggers found.</span>
              </div>
            )}
          </div>
        </div>

        {/* URL / Source Analysis */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all shadow-sm hover:shadow-lg backdrop-blur-md group">
          <div className="flex items-center gap-3 mb-6 text-cyan-400">
             <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/10">
                <LinkIcon size={24} />
             </div>
            <h3 className="font-bold text-xl text-slate-200">Link Forensics</h3>
          </div>
          <div className="space-y-3">
            {result.threats.url.length > 0 ? (
              result.threats.url.map((threat, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-300 bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-rose-500 mt-0.5 font-bold">✕</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
               <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3 text-emerald-500/80">
                  <CheckCircle size={20} />
                  <span className="font-medium">Domain structure verified safe.</span>
              </div>
            )}
          </div>
        </div>

         {/* Visual Analysis */}
         <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all shadow-sm hover:shadow-lg backdrop-blur-md group">
          <div className="flex items-center gap-3 mb-6 text-amber-400">
             <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/10">
                <Eye size={24} />
             </div>
            <h3 className="font-bold text-xl text-slate-200">Visual & Structure</h3>
          </div>
          <div className="space-y-3">
            {result.threats.visual.length > 0 ? (
              result.threats.visual.map((threat, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-300 bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-rose-500 mt-0.5 font-bold">✕</span>
                  <span>{threat}</span>
                </div>
              ))
            ) : (
               <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3 text-emerald-500/80">
                  <CheckCircle size={20} />
                  <span className="font-medium">No visual anomalies detected.</span>
              </div>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-lg backdrop-blur-md group">
          <div className="flex items-center gap-3 mb-6 text-emerald-400">
             <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/10">
                <Cpu size={24} />
             </div>
            <h3 className="font-bold text-xl text-slate-200">Technical Telemetry</h3>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-slate-400 font-medium">Source Verification</span>
                <span className={`font-mono px-3 py-1 rounded-lg text-xs font-bold ${result.technicalDetails.spfDkimCheck.includes('FAIL') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {result.technicalDetails.spfDkimCheck}
                </span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-slate-400 font-medium">Domain Entropy / Age</span>
                <span className="font-mono text-slate-200 font-bold">{result.technicalDetails.domainAge}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">AI Generation Probability</span>
                <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className={`h-full transition-all duration-1000 ${result.technicalDetails.aiProbability > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{width: `${result.technicalDetails.aiProbability}%`}}
                        ></div>
                    </div>
                    <span className={`font-mono font-bold ${result.technicalDetails.aiProbability > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>{result.technicalDetails.aiProbability}%</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResultCard;