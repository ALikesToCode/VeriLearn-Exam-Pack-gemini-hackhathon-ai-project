import { NextResponse } from "next/server";
import { coachMessageSchema } from "../../../../../lib/schemas";
import { buildCoachPrompt } from "../../../../../lib/coach";
import { fetchResearchSources } from "../../../../../lib/research";
import { streamText } from "../../../../../lib/gemini";
import {
  deleteCoachSession,
  getCoachSession,
  getPack,
  updateCoachSession
} from "../../../../../lib/store";

export async function GET(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  const session = await getCoachSession(params.sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(session);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  const removed = await deleteCoachSession(params.sessionId);
  if (!removed) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = coachMessageSchema.safeParse({
    ...body,
    sessionId: params.sessionId
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const session = await getCoachSession(parsed.data.sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const pack = await getPack(session.packId);
  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  const history = session.history ?? [];
  const { system, prompt } = buildCoachPrompt(
    pack,
    parsed.data.message,
    history,
    session.mode
  );

  let enrichedPrompt = prompt;
  if (session.mode === "assist") {
    const urls = parsed.data.message.match(/https?:\/\/[^\s]+/g) ?? [];
    if (urls.length) {
      const sources = await fetchResearchSources(urls.slice(0, 2));
      const appendix = sources
        .map((source) => `URL: ${source.url}\nExcerpt: ${source.excerpt}`)
        .join("\n\n");
      enrichedPrompt = `${prompt}\n\nAdditional resources:\n${appendix}`;
    }
  }

  const textStream = await streamText({
    apiKey: parsed.data.geminiApiKey,
    model: parsed.data.model,
    prompt: enrichedPrompt,
    system,
    config: {
      temperature: 0.5,
      maxOutputTokens: 800
    }
  });

  const encoder = new TextEncoder();
  let assistantText = "";
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = textStream.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          assistantText += value;
          controller.enqueue(encoder.encode(value));
        }
      } finally {
        await updateCoachSession(session.id, {
          history: [
            ...history,
            { role: "user", content: parsed.data.message },
            { role: "assistant", content: assistantText }
          ]
        });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
