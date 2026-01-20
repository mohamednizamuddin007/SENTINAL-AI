import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

/**
 * Initialize the Google GenAI client.
 * API_KEY is obtained from the environment variable via Vite's 'define' config.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robust JSON extraction.
 * Gemini models sometimes wrap JSON in markdown or add conversational filler.
 * This function extracts only the JSON object.
 */
const cleanAndParseJson = (text: string | undefined): any => {
  if (!text) return {};
  try {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      const jsonStr = text.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonStr);
    }
    return JSON.parse(text.trim());
  } catch (e) {
    console.warn("JSON Parse Warning: Attempting regex recovery.");
    const match = text?.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch (inner) { return {}; }
    }
    return {};
  }
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    riskScore: { type: Type.NUMBER },
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
        aiProbability: { type: Type.NUMBER },
        extractedUrl: { type: Type.STRING }
      }
    }
  },
  required: ["riskScore", "riskLevel", "summary", "threats", "technicalDetails"]
};

// Use 'gemini-3-flash-preview' for high-quota reliability on free tier
const TEXT_MODEL = "gemini-3-flash-preview";
const IMAGE_MODEL = "gemini-2.5-flash-image";

export const analyzeTextContent = async (subject: string, sender: string, body: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `Analyze this email for phishing: Subject: ${subject}, Sender: ${sender}, Body: ${body}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      thinkingConfig: { thinkingBudget: 1024 }
    },
  });
  return mapToSafeResult(cleanAndParseJson(response.text));
};

export const analyzeUrlContent = async (url: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `Analyze this URL for phishing or malicious redirects: ${url}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    },
  });
  return mapToSafeResult(cleanAndParseJson(response.text));
};

export const analyzeApiKey = async (keyInput: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `Check if this is a sensitive API key: "${keyInput}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    },
  });
  return mapToSafeResult(cleanAndParseJson(response.text));
};

export const analyzeSmishing = async (text: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `Analyze this SMS for fraud: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    },
  });
  return mapToSafeResult(cleanAndParseJson(response.text));
};

export const analyzeQrCode = async (base64Image: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: 'Decode the QR code and analyze the destination URL for phishing. Return JSON matching our schema.' }
      ]
    },
  });
  return mapToSafeResult(cleanAndParseJson(response.text));
};

export const analyzeImageContent = async (base64Image: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: 'Inspect this image for phishing UI elements. Return JSON.' }
      ]
    },
  });
  return mapToSafeResult(cleanAndParseJson(response.text));
};

export const analyzeFileContent = async (fileName: string, content: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `Audit file "${fileName}": ${content.slice(0, 15000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    },
  });
  return mapToSafeResult(cleanAndParseJson(response.text));
};

export const askSecurityAdvisor = async (query: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: query,
    config: {
      systemInstruction: "You are an elite Cybersecurity Consultant. Keep answers technical and use bullet points.",
      thinkingConfig: { thinkingBudget: 1024 }
    }
  });
  return response.text || "I cannot provide advice right now.";
};

export const askSiteGuide = async (query: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: query,
    config: {
      systemInstruction: "You are SentinelBot. Help with navigation in plain text.",
    }
  });
  return response.text || "Assistant unavailable.";
};

const mapToSafeResult = (raw: any): AnalysisResult => {
  return {
    riskScore: raw.riskScore ?? 0,
    riskLevel: (raw.riskLevel as RiskLevel) || RiskLevel.SAFE,
    summary: raw.summary || "Analysis complete.",
    threats: {
      nlp: Array.isArray(raw.threats?.nlp) ? raw.threats.nlp : [],
      url: Array.isArray(raw.threats?.url) ? raw.threats.url : [],
      visual: Array.isArray(raw.threats?.visual) ? raw.threats.visual : [],
    },
    technicalDetails: {
      spfDkimCheck: raw.technicalDetails?.spfDkimCheck || "N/A",
      domainAge: raw.technicalDetails?.domainAge || "N/A",
      aiProbability: raw.technicalDetails?.aiProbability || 0,
      extractedUrl: raw.technicalDetails?.extractedUrl
    }
  };
};
