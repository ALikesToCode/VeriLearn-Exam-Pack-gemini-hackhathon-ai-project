import { generateJson } from "./gemini";
import { TranscriptSegment } from "./types";

const VIDEO_UNDERSTANDING_SCHEMA = {
  type: "object",
  properties: {
    segments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          timestamp: { type: "string" },
          summary: { type: "string" },
          concepts: { type: "array", items: { type: "string" } }
        },
        required: ["timestamp", "summary", "concepts"]
      }
    },
    keyframes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          timestamp: { type: "string" },
          description: { type: "string" }
        },
        required: ["timestamp", "description"]
      }
    }
  },
  required: ["segments"]
};

type VideoSegment = {
  timestamp: string;
  summary: string;
  concepts: string[];
};

function parseTimestamp(timestamp: string) {
  const parts = timestamp.split(":").map((value) => Number(value));
  if (!parts.length || parts.some((value) => Number.isNaN(value))) return null;
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  return parts[0] ?? null;
}

function buildSegmentText(segment: VideoSegment) {
  const concepts = segment.concepts?.length
    ? `Concepts: ${segment.concepts.join(", ")}`
    : "";
  return [segment.summary.trim(), concepts].filter(Boolean).join(" ");
}

export async function buildVideoTranscriptFromUnderstanding(options: {
  videoUrl: string;
  lectureTitle: string;
  apiKey: string;
  model: string;
  maxSegments?: number;
}): Promise<TranscriptSegment[]> {
  const maxSegments = Math.max(4, Math.min(options.maxSegments ?? 8, 14));
  const prompt = `Analyze this lecture video and extract ${maxSegments} timeline segments.
For each segment, provide:
- timestamp (mm:ss)
- 1-2 sentence summary of what is taught
- 3-6 key concepts (short noun phrases)
Also provide 2-3 keyframes with timestamps and descriptions (if useful).
Lecture title: ${options.lectureTitle}
Return JSON matching the schema.`;

  const response = await generateJson<{
    segments: VideoSegment[];
  }>({
    apiKey: options.apiKey,
    model: options.model,
    prompt: "",
    parts: [
      { file_data: { file_uri: options.videoUrl } },
      { text: prompt }
    ],
    config: {
      responseSchema: VIDEO_UNDERSTANDING_SCHEMA,
      maxOutputTokens: 1400,
      temperature: 1.0,
      retry: { maxRetries: 2, baseDelayMs: 900 }
    }
  });

  const segments = response.segments ?? [];
  const normalized = segments
    .map((segment) => {
      const start = parseTimestamp(segment.timestamp);
      if (start === null) return null;
      return {
        start,
        timestamp: segment.timestamp,
        text: buildSegmentText(segment)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.start - b!.start) as Array<{ start: number; timestamp: string; text: string }>;

  const transcript = normalized.map((segment, index) => {
    const nextStart = normalized[index + 1]?.start;
    const duration = nextStart ? Math.max(20, Math.min(120, nextStart - segment.start)) : 60;
    return {
      start: segment.start,
      duration,
      end: segment.start + duration,
      text: segment.text,
      timestamp: segment.timestamp
    } satisfies TranscriptSegment;
  });

  if (!transcript.length) {
    throw new Error("Video understanding returned no usable segments.");
  }

  return transcript;
}
