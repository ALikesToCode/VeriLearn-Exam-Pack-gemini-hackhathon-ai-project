import { NextResponse } from "next/server";
import { makeId } from "../../../lib/utils";

const DEFAULT_TTS_MODEL = "gemini-2.5-flash-preview-tts";
const DEFAULT_VOICE = "Kore";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export async function POST(request: Request) {
  const traceId = makeId("trace");
  const json = (body: unknown, init?: ResponseInit) => {
    const response = NextResponse.json(body, init);
    response.headers.set("x-request-id", traceId);
    return response;
  };

  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const apiKey = typeof body?.geminiApiKey === "string" ? body.geminiApiKey : "";

  if (!text || !apiKey) {
    return json({ error: "Missing text or geminiApiKey" }, { status: 400 });
  }

  const model = typeof body?.model === "string" ? body.model : DEFAULT_TTS_MODEL;
  const voice = typeof body?.voice === "string" ? body.voice : DEFAULT_VOICE;

  const payload = {
    contents: [
      {
        parts: [{ text }]
      }
    ],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice }
        }
      }
    }
  };

  const response = await fetch(
    `${API_BASE}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return json({ error: errorText || "TTS request failed" }, { status: 502 });
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const audioPart = parts.find((part: any) => part?.inlineData || part?.inline_data);
  const inline = audioPart?.inlineData ?? audioPart?.inline_data;

  if (!inline?.data) {
    return json({ error: "Missing audio data in response" }, { status: 502 });
  }

  return json({
    audio: inline.data,
    mimeType: inline.mimeType ?? inline.mime_type ?? "audio/wav"
  });
}
