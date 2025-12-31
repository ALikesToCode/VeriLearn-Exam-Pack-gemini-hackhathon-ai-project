import { NextResponse } from "next/server";
import { submitAnswerSchema } from "../../../lib/schemas";
import { gradeAnswer } from "../../../lib/veriexam";
import { getPack, updatePack } from "../../../lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = submitAnswerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const pack = await getPack(parsed.data.packId);
  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  const question = pack.questions.find(
    (item) => item.id === parsed.data.questionId
  );

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const topicMatch = pack.blueprint.topics.find(
    (topic) =>
      question.tags.includes(topic.title) || question.tags.includes(topic.id)
  );
  const topicId = topicMatch?.id ?? pack.blueprint.topics[0]?.id ?? "general";
  const result = gradeAnswer(
    question,
    parsed.data.answer,
    pack.mastery,
    topicId
  );

  if (result.mastery) {
    await updatePack(pack.id, {
      mastery: {
        ...pack.mastery,
        [topicId]: result.mastery
      }
    });
  }

  return NextResponse.json(result);
}
