import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

// Use the provided key if process.env.API_KEY is not set (e.g. in local VS Code/Cursor)
const apiKey = process.env.API_KEY || 'AIzaSyCgBRI3jgnpIdMkkp20HetEw6GYzkMLG5w';

// Initialize client
const ai = new GoogleGenAI({ apiKey });

// Helper to clean Markdown code blocks from JSON strings
const cleanAndParseJson = (text: string | undefined): any => {
    if (!text) return {};
    try {
        const cleanText = text
            .replace(/^```json\s*/, '')
            .replace(/^```\s*/, '')
            .replace(/\s*```$/, '')
            .trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse AI response:", text);
        try {
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                const subStr = text.substring(firstBrace, lastBrace + 1);
                return JSON.parse(subStr);
            }
        } catch (e2) {
             console.error("Aggressive parse failed:", e2);
        }
        throw new Error("Invalid JSON format from AI");
    }
};

export const analyzeTextContent = async (
  subject: string,
  sender: string,
  body: string
): Promise<AnalysisResult> => {
  if (!apiKey) {
    console.error("API Key not found.");
    throw new Error("API Key missing.");
  }

  const prompt = `
    Analyze the following email for sophisticated AI-generated phishing attempts.
    
    Sender: ${sender}
    Subject: ${subject}
    Body: ${body}

    Focus on:
    1. Psychological manipulation (urgency, fear, curiosity).
    2. URL/Domain anomalies (lookalike domains).
    3. AI-generation artifacts (unnatural phrasing, generic structure).
    4. Technical likelihood of spoofing based on the sender format.

    Return ONLY a raw JSON object (no markdown formatting) with the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER },
            riskLevel: { type: Type.STRING, enum: ["SAFE", "SUSPICIOUS", "MALICIOUS"] },
            summary: { type: Type.STRING },
            threats: {
              type: Type.OBJECT,
              properties: {
                nlp: { type: Type.ARRAY, items: { type: Type.STRING } },
                url: { type: Type.ARRAY, items: { type: Type.STRING } },
                visual: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            technicalDetails: {
              type: Type.OBJECT,
              properties: {
                spfDkimCheck: { type: Type.STRING },
                domainAge: { type: Type.STRING },
                aiProbability: { type: Type.INTEGER }
              }
            }
          }
        }
      }
    });

    const result = cleanAndParseJson(response.text);
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      riskScore: 50,
      riskLevel: RiskLevel.SUSPICIOUS,
      summary: "Analysis failed or timed out. Treat with caution.",
      threats: { nlp: ["Analysis Error"], url: [], visual: [] },
      technicalDetails: { spfDkimCheck: "UNKNOWN", domainAge: "UNKNOWN", aiProbability: 0 }
    };
  }
};

export const analyzeUrlContent = async (url: string): Promise<AnalysisResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Analyze this specific URL for phishing, fraud, or malicious intent:
    URL: ${url}

    Perform a forensic analysis on the string structure:
    1. Check for Typosquatting (e.g., 'goog1e.com').
    2. Analyze the TLD (Top Level Domain) reputation (e.g., .xyz, .top, .cam often used in spam).
    3. Look for sub-domain masking (e.g., 'paypal.com.account-verify.net').
    4. Check for URL shorteners or obfuscation techniques.
    
    If it looks like a legitimate major brand, mark as SAFE.
    If it looks like a mimic, mark as MALICIOUS.

    Return ONLY raw JSON (no markdown).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER },
            riskLevel: { type: Type.STRING, enum: ["SAFE", "SUSPICIOUS", "MALICIOUS"] },
            summary: { type: Type.STRING },
            threats: {
              type: Type.OBJECT,
              properties: {
                nlp: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Used for keyword analysis in the URL" },
                url: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific URL structural issues" },
                visual: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Leave empty for URL scans" }
              }
            },
            technicalDetails: {
              type: Type.OBJECT,
              properties: {
                spfDkimCheck: { type: Type.STRING, description: "Set to N/A for URL scans" },
                domainAge: { type: Type.STRING, description: "Estimated based on TLD/Structure" },
                aiProbability: { type: Type.INTEGER, description: "Likelihood generated by DGA (Domain Generation Algorithm)" }
              }
            }
          }
        }
      }
    });

    const result = cleanAndParseJson(response.text);
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini URL Analysis Error:", error);
    return {
      riskScore: 50,
      riskLevel: RiskLevel.SUSPICIOUS,
      summary: "URL analysis failed.",
      threats: { nlp: [], url: ["Analysis Error - Please verify API Key"], visual: [] },
      technicalDetails: { spfDkimCheck: "N/A", domainAge: "UNKNOWN", aiProbability: 0 }
    };
  }
};

export const analyzeApiKey = async (keyInput: string): Promise<AnalysisResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Analyze this string to see if it resembles a sensitive API key, private token, or secret credential.
    String: "${keyInput}"

    1. Identify the likely provider based on common prefixes (e.g., 'sk_live_' for Stripe, 'AKIA' for AWS, 'ghp_' for GitHub).
    2. Analyze entropy/randomness.
    3. Determine if it is likely a test key (Safe/Low Risk) or a production key (Critical/Malicious if exposed).
    
    Output JSON ONLY.
    - riskScore: High if it looks like a real production secret.
    - technicalDetails.spfDkimCheck: Use this field to store the "Detected Provider".
    - technicalDetails.domainAge: Use this field to store "Entropy Level" (Low/Medium/High).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.INTEGER },
              riskLevel: { type: Type.STRING, enum: ["SAFE", "SUSPICIOUS", "MALICIOUS"] },
              summary: { type: Type.STRING },
              threats: {
                type: Type.OBJECT,
                properties: {
                  nlp: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Warnings about the key format" },
                  url: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Empty for keys" },
                  visual: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Empty for keys" }
                }
              },
              technicalDetails: {
                type: Type.OBJECT,
                properties: {
                  spfDkimCheck: { type: Type.STRING, description: "Provider Name (e.g. AWS, Stripe)" },
                  domainAge: { type: Type.STRING, description: "Entropy Level" },
                  aiProbability: { type: Type.INTEGER, description: "Probability it is a valid secret" }
                }
              }
            }
          }
      }
    });

    const result = cleanAndParseJson(response.text);
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Key Analysis Error:", error);
    return {
      riskScore: 0,
      riskLevel: RiskLevel.SAFE,
      summary: "Could not analyze key format.",
      threats: { nlp: [], url: [], visual: [] },
      technicalDetails: { spfDkimCheck: "Unknown", domainAge: "Unknown", aiProbability: 0 }
    };
  }
};

export const askSecurityAdvisor = async (query: string): Promise<string> => {
    if (!apiKey) throw new Error("API Key missing");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: query,
            config: {
                systemInstruction: "You are an elite Cybersecurity Consultant for SentinelAI powered by Google Gemini. Provide concise, immediate, and actionable security advice. Keep responses under 200 words and focus on speed and accuracy. Use markdown formatting.",
            }
        });
        return response.text || "I'm unable to provide advice at this moment.";
    } catch (e) {
        console.error(e);
        return "Connection to Security Advisor failed.";
    }
}

export const analyzeImageContent = async (base64Image: string): Promise<AnalysisResult> => {
    if (!apiKey) throw new Error("API Key missing");
  
    const prompt = `
      Analyze this screenshot of an email or message.
      Look for:
      1. Visual brand mismatches (e.g., Apple logo but sender is gmail.com).
      2. Suspicious layout or blurry assets typical of mass-produced phishing.
      3. Fake urgency buttons or overlays.
      
      Return JSON ONLY.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: "application/json" 
        }
      });
  
      const result = cleanAndParseJson(response.text);
      
      return {
        riskScore: result.riskScore || 0,
        riskLevel: result.riskLevel || RiskLevel.SAFE,
        summary: result.summary || "Visual analysis complete.",
        threats: {
            nlp: result.threats?.nlp || [],
            url: result.threats?.url || [],
            visual: result.threats?.visual || result.threats?.visuals || [],
        },
        technicalDetails: {
            spfDkimCheck: "N/A (Image Scan)",
            domainAge: "N/A",
            aiProbability: result.technicalDetails?.aiProbability || 0
        }
      };

    } catch (error) {
      console.error("Gemini Vision Error:", error);
      return {
        riskScore: 50,
        riskLevel: RiskLevel.SUSPICIOUS,
        summary: "Visual analysis failed.",
        threats: { nlp: [], url: [], visual: ["Error processing image"] },
        technicalDetails: { spfDkimCheck: "N/A", domainAge: "N/A", aiProbability: 0 }
      };
    }
  };