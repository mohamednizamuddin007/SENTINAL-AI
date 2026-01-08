import { RiskLevel, ScanHistoryItem } from './types';

export const MOCK_HISTORY: ScanHistoryItem[] = [
  {
    id: '1',
    timestamp: Date.now() - 1000 * 60 * 5,
    subject: "URGENT: Delivery Attempt Failed - UPS #99283",
    sender: "no-reply@ups-delivery-status-update.com",
    type: 'text',
    result: {
      riskScore: 88,
      riskLevel: RiskLevel.MALICIOUS,
      summary: "High-confidence phishing attempt using urgency and lookalike domain.",
      threats: {
        nlp: ["Urgency creation ('Immediate action required')", "Fear appeal ('Package will be returned')"],
        url: ["Lookalike domain 'ups-delivery-status-update.com'", "Hidden redirect in button"],
        visual: []
      },
      technicalDetails: {
        spfDkimCheck: "FAIL",
        domainAge: "< 24 hours",
        aiProbability: 92
      }
    }
  },
  {
    id: '2',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    subject: "Your Weekly Team Update",
    sender: "sarah.manager@company.com",
    type: 'text',
    result: {
      riskScore: 12,
      riskLevel: RiskLevel.SAFE,
      summary: "Internal communication appears legitimate.",
      threats: {
        nlp: [],
        url: [],
        visual: []
      },
      technicalDetails: {
        spfDkimCheck: "PASS",
        domainAge: "> 5 years",
        aiProbability: 15
      }
    }
  }
];

export const PRESET_PHISHING_TEXT = `Subject: ACTION REQUIRED: Your Microsoft 365 Password Expires Today
From: Microsoft Security <security@ms-auth-portal-update.net>

Dear User,

Your corporate account password is set to expire in 2 hours. Due to recent security upgrades in our AI-driven defense protocols, all users must manually validate their credentials to prevent account lockout.

Failure to validate immediately will result in a temporary suspension of your inbox and OneDrive access.

[ Click Here to Validate Now ]

Thank you,
Microsoft Security Team`;
