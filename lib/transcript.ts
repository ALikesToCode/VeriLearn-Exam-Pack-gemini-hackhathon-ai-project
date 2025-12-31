import { XMLParser } from "fast-xml-parser";
import { decode } from "he";
import { TranscriptSegment } from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "text"
});

function formatTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function parseTranscriptXml(xml: string): TranscriptSegment[] {
  if (!xml.trim()) return [];
  const parsed = parser.parse(xml) as any;
  const entries = parsed?.transcript?.text;
  if (!entries) return [];
  const list = Array.isArray(entries) ? entries : [entries];

  return list.map((entry: any) => {
    const start = Number(entry.start ?? 0);
    const duration = Number(entry.dur ?? 0);
    const text = decode(String(entry.text ?? "").replace(/\n/g, " "));
    const end = start + duration;
    return {
      start,
      duration,
      end,
      text,
      timestamp: formatTimestamp(start)
    } satisfies TranscriptSegment;
  });
}

async function fetchXml(url: string) {
  const response = await fetch(url);
  if (!response.ok) return "";
  return response.text();
}

export async function fetchTranscriptSegments(
  videoId: string,
  language: string
): Promise<TranscriptSegment[]> {
  const base = `https://video.google.com/timedtext?lang=${language}&v=${videoId}`;
  const manual = await fetchXml(base);
  let segments = parseTranscriptXml(manual);

  if (!segments.length) {
    const auto = await fetchXml(`${base}&kind=asr`);
    segments = parseTranscriptXml(auto);
  }

  if (!segments.length) {
    throw new Error("Transcript unavailable");
  }

  return segments;
}

export function buildTranscriptText(segments: TranscriptSegment[]) {
  return segments
    .map((segment) => `[${segment.timestamp}] ${segment.text}`)
    .join("\n");
}

export function chunkTranscript(
  segments: TranscriptSegment[],
  maxChars = 4000
): TranscriptSegment[][] {
  const chunks: TranscriptSegment[][] = [];
  let current: TranscriptSegment[] = [];
  let currentChars = 0;

  segments.forEach((segment) => {
    const piece = `[${segment.timestamp}] ${segment.text}`;
    if (currentChars + piece.length > maxChars && current.length) {
      chunks.push(current);
      current = [];
      currentChars = 0;
    }
    current.push(segment);
    currentChars += piece.length;
  });

  if (current.length) {
    chunks.push(current);
  }

  return chunks;
}
