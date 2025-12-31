import { generateJson } from "./gemini";
import { Question, NoteDocument, Lecture } from "./types";

const QUESTION_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          difficulty: { type: "string" },
          bloom: { type: "string" },
          timeSeconds: { type: "number" },
          tags: { type: "array", items: { type: "string" } },
          stem: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                text: { type: "string" }
              },
              required: ["id", "text"]
            }
          },
          answer: { type: "string" },
          rationale: { type: "string" },
          citations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                timestamp: { type: "string" },
                snippet: { type: "string" }
              },
              required: ["label", "timestamp", "snippet"]
            }
          }
        },
        required: [
          "type",
          "difficulty",
          "bloom",
          "timeSeconds",
          "tags",
          "stem",
          "answer",
          "rationale",
          "citations"
        ]
      }
    }
  },
  required: ["questions"]
};

function timestampToSeconds(timestamp: string) {
  const [min, sec] = timestamp.split(":").map((part) => Number(part));
  if (Number.isNaN(min) || Number.isNaN(sec)) return 0;
  return min * 60 + sec;
}

function toCitation(lecture: Lecture, item: { label: string; timestamp: string; snippet?: string }) {
  const seconds = timestampToSeconds(item.timestamp);
  return {
    label: item.label,
    timestamp: item.timestamp,
    source: lecture.title,
    url: `${lecture.url}&t=${seconds}s`,
    snippet: item.snippet
  };
}

export async function generateQuestionBank(
  notes: NoteDocument[],
  apiKey: string,
  model: string,
  perLecture = 4,
  extraContext?: string
): Promise<Question[]> {
  const questions: Question[] = [];

  for (const note of notes) {
    const prompt = `Generate ${perLecture} exam questions based strictly on the lecture notes.
Lecture: ${note.lectureTitle}
Notes summary: ${note.summary}
Key takeaways: ${note.keyTakeaways.join(" | ")}
Use the timestamps in citations.
${extraContext ? `Additional context:\n${extraContext}` : ""}
Return JSON matching the schema.`;

    const response = await generateJson<{
      questions: Array<{
        type: Question["type"];
        difficulty: Question["difficulty"];
        bloom: Question["bloom"];
        timeSeconds: number;
        tags: string[];
        stem: string;
        options?: Question["options"];
        answer: string;
        rationale: string;
        citations: { label: string; timestamp: string; snippet?: string }[];
      }>;
    }>({
      apiKey,
      model,
      prompt,
      config: {
        responseSchema: QUESTION_SCHEMA,
        maxOutputTokens: 1800,
        temperature: 0.45
      }
    });

    response.questions.forEach((item, index) => {
      const citations = item.citations.map((citation) =>
        toCitation(
          {
            id: note.lectureId,
            title: note.lectureTitle,
            url: note.lectureUrl,
            videoId: note.videoId,
            durationSeconds: 0,
            order: 0
          },
          citation
        )
      );

      const tags = item.tags.includes(note.lectureTitle)
        ? item.tags
        : [...item.tags, note.lectureTitle];

      questions.push({
        id: `q_${note.lectureId}_${index + 1}`,
        type: item.type,
        difficulty: item.difficulty,
        bloom: item.bloom,
        timeSeconds: item.timeSeconds,
        tags,
        stem: item.stem,
        options: item.options,
        answer: item.answer,
        rationale: item.rationale,
        citations,
        verified: false
      });
    });
  }

  return questions;
}
