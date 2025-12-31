import { generateJson } from "./gemini";
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

export async function fetchResearchSources(urls: string[]): Promise<ResearchSource[]> {
  const sources: ResearchSource[] = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const title = extractTitle(html);
      const text = stripHtml(html).slice(0, 2000);
      sources.push({ title, url, excerpt: text });
    } catch {
      sources.push({ title: "Source", url, excerpt: "Unavailable" });
    }
  }

  return sources;
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
      temperature: 0.4
    }
  });

  return response;
}
