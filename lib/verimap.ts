import { Blueprint, BlueprintTopic, Lecture } from "./types";
import { slugify } from "./utils";

export function buildBlueprint(courseTitle: string, lectures: Lecture[]): Blueprint {
  const totalSeconds = lectures.reduce(
    (sum, item) => sum + Math.max(1, item.durationSeconds),
    0
  );
  const rawWeights = lectures.map(
    (lecture) => (Math.max(1, lecture.durationSeconds) / totalSeconds) * 100
  );
  const rounded = rawWeights.map((weight) => Math.round(weight));
  const diff = 100 - rounded.reduce((sum, weight) => sum + weight, 0);

  if (diff !== 0) {
    const maxIndex = rawWeights.indexOf(Math.max(...rawWeights));
    rounded[maxIndex] += diff;
  }

  const topics: BlueprintTopic[] = lectures.map((lecture, index) => ({
    id: `topic_${slugify(lecture.title)}_${index + 1}`,
    title: lecture.title,
    weight: rounded[index],
    prerequisites: index === 0 ? [] : [lectures[index - 1].title],
    revisionOrder: index + 1
  }));

  const revisionOrder = topics
    .slice()
    .sort((a, b) => a.revisionOrder - b.revisionOrder)
    .map((topic) => topic.id);

  return {
    title: `${courseTitle} Blueprint`,
    topics,
    revisionOrder
  };
}
