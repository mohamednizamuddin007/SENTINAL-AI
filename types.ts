export enum RiskLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  MALICIOUS = 'MALICIOUS',
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  threats: {
    nlp: string[]; // Psychological triggers or Key format issues
    url: string[]; // Domain issues
    visual: string[]; // Logo/Branding mismatches
  };
  technicalDetails: {
    spfDkimCheck: string; // Simulated header check or Key Provider
    domainAge: string;   // Simulated domain age or Entropy Score
    aiProbability: number; // Likelihood it was AI generated or Leak Probability
  };
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  subject: string;
  sender: string;
  result: AnalysisResult;
  type: 'text' | 'image' | 'url' | 'apikey';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  EXTENSION_SIM = 'EXTENSION_SIM',
  ADVISOR = 'ADVISOR',
  DOWNLOAD = 'DOWNLOAD',
  SETTINGS = 'SETTINGS',
  REPORT = 'REPORT'
}