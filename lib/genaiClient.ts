import { GoogleGenAI } from "@google/genai";

const clientCache = new Map<string, GoogleGenAI>();

export function getGenAIClient(apiKey: string) {
  const cached = clientCache.get(apiKey);
  if (cached) return cached;
  const client = new GoogleGenAI({ apiKey });
  clientCache.set(apiKey, client);
  return client;
}
