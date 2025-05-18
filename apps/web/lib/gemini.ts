import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const GEMINI_MODELS = {
  PRO: "gemini-2.5-pro-preview-05-06",
  FLASH: "gemini-2.5-flash-preview-04-17",
} as const;

export type GeminiModel = (typeof GEMINI_MODELS)[keyof typeof GEMINI_MODELS];
