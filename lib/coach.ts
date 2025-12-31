import { Pack } from "./types";

export function summarizePack(pack: Pack) {
  const topics = pack.blueprint.topics
    .map((topic) => `${topic.title} (${topic.weight}%)`)
    .join(" | ");
  const takeaways = pack.notes
    .flatMap((note) => note.keyTakeaways.slice(0, 2))
    .slice(0, 8)
    .join(" | ");

  return `Blueprint topics: ${topics}\nKey takeaways: ${takeaways}`;
}

export function buildCoachPrompt(
  pack: Pack,
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  mode: "coach" | "viva" | "assist"
) {
  const base = summarizePack(pack);
  const system = `You are VeriCoach, an exam prep tutor.\n${base}`;
  const modeInstruction =
    mode === "viva"
      ? "Run an oral-viva session: ask a question, wait for the answer, then give feedback and the next question."
      : mode === "assist"
        ? "Assist the learner with explanations, quick checks, and concise worked examples."
        : "Coach the learner: answer questions, quiz them, and point to evidence timestamps.";

  const historyText = history
    .map((turn) => `${turn.role === "user" ? "User" : "Coach"}: ${turn.content}`)
    .join("\n");

  const prompt = `${modeInstruction}\nUse evidence timestamps when possible.\nConversation:\n${historyText}\nUser: ${message}\nCoach:`;

  return { system, prompt };
}
