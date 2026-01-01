import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { makeId } from "../../../lib/utils";

const DEFAULT_LIVE_MODEL = "gemini-live-2.5-flash-preview";
const API_VERSION = "v1alpha";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const traceId = makeId("trace");
  const json = (body: unknown, init?: ResponseInit) => {
    const response = NextResponse.json(body, init);
    response.headers.set("x-request-id", traceId);
    return response;
  };

  const body = await request.json().catch(() => null);
  const apiKey = typeof body?.geminiApiKey === "string" ? body.geminiApiKey : "";
  if (!apiKey) {
    return json({ error: "Missing geminiApiKey" }, { status: 400 });
  }

  const model =
    typeof body?.model === "string" && body.model.trim()
      ? body.model.trim()
      : DEFAULT_LIVE_MODEL;
  const responseModalities = Array.isArray(body?.responseModalities)
    ? body.responseModalities
    : ["TEXT"];

  const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const newSessionExpireTime = new Date(Date.now() + 60 * 1000).toISOString();

  const client = new GoogleGenAI({ apiKey });

  const token = await (client as any).authTokens.create({
    config: {
      uses: 1,
      expireTime,
      newSessionExpireTime,
      liveConnectConstraints: {
        model,
        config: {
          responseModalities,
          sessionResumption: {}
        }
      },
      httpOptions: { apiVersion: API_VERSION }
    }
  });

  if (!token?.name) {
    return json({ error: "Failed to provision ephemeral token" }, { status: 502 });
  }

  return json({
    token: token.name,
    expireTime: token.expireTime ?? expireTime,
    newSessionExpireTime: token.newSessionExpireTime ?? newSessionExpireTime
  });
}
