import { generateJson } from "./gemini";
import { getGenAIClient } from "./genaiClient";
import { delay } from "./utils";
import { ResearchReport, ResearchSource } from "./types";

const REPORT_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          url: { type: "string" },
          excerpt: { type: "string" }
        },
        required: ["title", "url", "excerpt"]
      }
    }
  },
  required: ["summary", "sources"]
};

const DEEP_RESEARCH_AGENT = "deep-research-pro-preview-12-2025";

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html: string) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match?.[1]?.trim() ?? "Source";
}

export async function fetchResearchSources(
  urls: string[],
  fallbackSources: ResearchSource[] = []
): Promise<ResearchSource[]> {
  const sources: ResearchSource[] = [];
  const fallbackMap = new Map<string, ResearchSource>(
    fallbackSources.map((source) => [source.url, source])
  );

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const title = extractTitle(html);
      const text = stripHtml(html).slice(0, 2000);
      sources.push({ title, url, excerpt: text });
    } catch {
      const fallback = fallbackMap.get(url);
      sources.push(
        fallback ?? { title: "Source", url, excerpt: "Unavailable" }
      );
    }
  }

  return sources;
}

export async function searchResearchSources(
  query: string,
  apiKey: string,
  maxResults = 5
): Promise<ResearchSource[]> {
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey
    },
    body: JSON.stringify({ q: query })
  });

  if (!response.ok) {
    throw new Error("Research search failed");
  }

  const data = await response.json();
  const results = (data.organic ?? []).slice(0, maxResults);
  return results.map((item: { title?: string; link?: string; snippet?: string }) => ({
    title: item.title ?? "Source",
    url: item.link ?? "",
    excerpt: item.snippet ?? ""
  })).filter((item: ResearchSource) => item.url);
}

export async function buildResearchReport(
  courseTitle: string,
  sources: ResearchSource[],
  apiKey: string,
  model: string
): Promise<ResearchReport> {
  const prompt = `Summarize the following sources into a blueprint-style research memo for ${courseTitle}.
Focus on syllabus themes, exam expectations, and key topics. Cite sources in the summary.
Sources:\n${sources
    .map((source) => `Title: ${source.title}\nURL: ${source.url}\nExcerpt: ${source.excerpt}`)
    .join("\n\n")}
Return JSON matching the schema.`;

  const response = await generateJson<ResearchReport>({
    apiKey,
    model,
    prompt,
    config: {
      responseSchema: REPORT_SCHEMA,
      maxOutputTokens: 1200,
      retry: { maxRetries: 2, baseDelayMs: 700 }
    }
  });

  return response;
}

function extractInteractionText(outputs?: Array<{ type?: string; text?: string }>) {
  if (!outputs?.length) return "";
  return outputs
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("");
}

function extractJsonBlock(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const match = text.match(/\{[\s\S]*\}/);
  return match?.[0] ?? "";
}

function normalizeSources(raw: unknown): ResearchSource[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      title: typeof item?.title === "string" ? item.title : "Source",
      url: typeof item?.url === "string" ? item.url : "",
      excerpt: typeof item?.excerpt === "string" ? item.excerpt : ""
    }))
    .filter((item) => item.url);
}

export async function buildDeepResearchReport(options: {
  courseTitle: string;
  apiKey: string;
  prompt?: string;
  agent?: string;
  pollIntervalMs?: number;
  timeoutMs?: number;
  onPoll?: (status: string) => void | Promise<void>;
}): Promise<ResearchReport> {
  const ai = getGenAIClient(options.apiKey);
  const prompt =
    options.prompt ??
    `Research the syllabus and past papers for ${options.courseTitle}.
Summarize the core topics, exam focus areas, and study priorities.
Return JSON with summary and sources (title, url, excerpt) matching the schema.`;

  // @ts-ignore
  const initial = await ai.interactions.create({
    agent: options.agent ?? DEEP_RESEARCH_AGENT,
    input: prompt,
    background: true
  });

  const start = Date.now();
  let current = initial;
  const timeoutMs = options.timeoutMs ?? 6 * 60 * 1000;
  const pollIntervalMs = options.pollIntervalMs ?? 10_000;

  while (current.status && current.status !== "completed") {
    if (current.status === "failed" || current.status === "cancelled") {
      throw new Error(`Deep research ${current.status}.`);
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error("Deep research timed out.");
    }
    if (options.onPoll) {
      await options.onPoll(current.status);
    }
    await delay(pollIntervalMs);
    // @ts-ignore
    current = await ai.interactions.get(initial.id);
  }

  const text = extractInteractionText(current.outputs as Array<{ type?: string; text?: string }>);
  const jsonBlock = extractJsonBlock(text);
  let parsed: ResearchReport | null = null;
  if (jsonBlock) {
    try {
      parsed = JSON.parse(jsonBlock) as ResearchReport;
    } catch {
      parsed = null;
    }
  }

  const summary = parsed?.summary?.trim() || text.trim();
  const sources = normalizeSources(parsed?.sources);
  return {
    summary,
    sources
  };
}
