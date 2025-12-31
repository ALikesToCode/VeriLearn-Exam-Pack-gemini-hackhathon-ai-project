import { generateJson } from "./gemini";
import { buildTranscriptText } from "./transcript";
import { NoteDocument, Question, TranscriptSegment } from "./types";

const VERIFY_SCHEMA = {
  type: "object",
  properties: {
    supported: { type: "boolean" },
    issues: { type: "array", items: { type: "string" } }
  },
  required: ["supported", "issues"]
};

export async function verifyNotes(
  note: NoteDocument,
  transcript: TranscriptSegment[],
  apiKey: string,
  model: string
): Promise<NoteDocument> {
  const transcriptText = buildTranscriptText(transcript);
  const prompt = `Check whether the following study notes are supported by the transcript.
If unsupported claims exist, list them briefly in issues.
Transcript:
${transcriptText}
Notes:
Summary: ${note.summary}
Sections:
${note.sections
    .map((section) => `- ${section.heading}: ${section.bullets.join(" | ")}`)
    .join("\n")}
Key takeaways: ${note.keyTakeaways.join(" | ")}
Return JSON matching the schema.`;

  const response = await generateJson<{ supported: boolean; issues: string[] }>({
    apiKey,
    model,
    prompt,
    config: {
      responseSchema: VERIFY_SCHEMA,
      temperature: 0.2,
      maxOutputTokens: 600
    }
  });

  return {
    ...note,
    verified: response.supported,
    verificationNotes: response.issues
  };
}

export async function verifyQuestion(
  question: Question,
  context: string,
  apiKey: string,
  model: string
): Promise<Question> {
  const prompt = `Check whether the answer and rationale are supported by the context.
Context:
${context}
Question: ${question.stem}
Answer: ${question.answer}
Rationale: ${question.rationale}
Return JSON matching the schema.`;

  const response = await generateJson<{ supported: boolean; issues: string[] }>({
    apiKey,
    model,
    prompt,
    config: {
      responseSchema: VERIFY_SCHEMA,
      temperature: 0.2,
      maxOutputTokens: 400
    }
  });

  return {
    ...question,
    verified: response.supported,
    verificationNotes: response.issues
  };
}
