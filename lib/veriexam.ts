import { Exam, GradeResult, MasteryRecord, Question } from "./types";
import { normalizeAnswer } from "./utils";
import { createMasteryRecord, updateMastery } from "./mastery";

export function buildExam(questions: Question[], size: number, title: string): Exam {
  const selected = questions.slice(0, Math.max(3, Math.min(size, questions.length)));

  return {
    id: `exam_${Math.random().toString(36).slice(2, 8)}`,
    title,
    totalTimeMinutes: Math.ceil(
      selected.reduce((sum, question) => sum + question.timeSeconds, 0) / 60
    ),
    sections: [
      {
        title: "Mixed Practice",
        questionIds: selected.map((question) => question.id),
        timeMinutes: Math.ceil(
          selected.reduce((sum, question) => sum + question.timeSeconds, 0) / 60
        )
      }
    ]
  };
}

export function gradeAnswer(
  question: Question,
  answer: string,
  mastery: Record<string, MasteryRecord>,
  topicId: string
): GradeResult {
  const normalizedAnswer = normalizeAnswer(answer);
  let isCorrect = false;

  if (question.type === "mcq" && question.options) {
    const match = question.options.find(
      (option) =>
        normalizeAnswer(option.text) === normalizedAnswer ||
        option.id.toLowerCase() === normalizedAnswer
    );
    isCorrect = match ? match.text === question.answer : false;
  } else if (question.type === "true_false") {
    isCorrect =
      normalizedAnswer === normalizeAnswer(question.answer) ||
      normalizedAnswer === question.answer.toLowerCase();
  } else {
    const expected = normalizeAnswer(question.answer);
    isCorrect = expected.includes(normalizedAnswer) || normalizedAnswer.includes(expected);
  }

  const currentRecord = mastery[topicId] ?? createMasteryRecord(topicId);
  const updated = updateMastery(currentRecord, isCorrect);

  return {
    questionId: question.id,
    correct: isCorrect,
    correctAnswer: question.answer,
    explanation: question.rationale,
    citations: question.citations,
    mastery: updated
  };
}
