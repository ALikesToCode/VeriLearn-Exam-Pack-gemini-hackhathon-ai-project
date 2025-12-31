import { MasteryRecord } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function createMasteryRecord(topicId: string): MasteryRecord {
  const now = new Date().toISOString();
  return {
    topicId,
    score: 0.3,
    streak: 0,
    lastSeen: now,
    nextReviewAt: new Date(Date.now() + DAY_MS).toISOString()
  };
}

export function updateMastery(
  record: MasteryRecord,
  correct: boolean
): MasteryRecord {
  const nextScore = Math.min(1, Math.max(0, record.score + (correct ? 0.15 : -0.2)));
  const nextStreak = correct ? record.streak + 1 : 0;
  const intervalDays = Math.max(1, Math.round(1 + nextScore * 4 + nextStreak));
  const now = Date.now();

  return {
    ...record,
    score: nextScore,
    streak: nextStreak,
    lastSeen: new Date(now).toISOString(),
    nextReviewAt: new Date(now + intervalDays * DAY_MS).toISOString()
  };
}
