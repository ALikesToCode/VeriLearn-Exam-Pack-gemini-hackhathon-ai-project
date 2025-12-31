import { buildBlueprint } from "./verimap";
import { generateNotes } from "./verinotes";
import { generateQuestionBank } from "./veribank";
import { verifyNotes, verifyQuestion } from "./veriverify";
import { buildExam } from "./veriexam";
import { fetchTranscriptSegments, buildTranscriptText } from "./transcript";
import {
  buildLecturesFromLines,
  buildLecturesFromPlaylist,
  extractPlaylistId,
  extractVideoId,
  hydrateLectureDurations
} from "./youtube";
import { createMasteryRecord } from "./mastery";
import { delay, makeId } from "./utils";
import { getJob, setJob, setPack, updateJob } from "./store";
import { buildResearchReport, fetchResearchSources } from "./research";
import { GeneratePackOptions, JobStatus, Pack, TranscriptSegment } from "./types";

export type PipelineInputs = {
  input: string;
  youtubeApiKey: string;
  geminiApiKey: string;
  models: {
    pro: string;
    flash: string;
  };
  examDate?: string;
  vaultNotes?: string;
  researchSources?: string[];
  options: GeneratePackOptions;
};

export function normalizeOptions(options?: Partial<GeneratePackOptions>): GeneratePackOptions {
  return {
    examSize: options?.examSize ?? 12,
    formats: options?.formats ?? ["pdf", "csv"],
    language: options?.language ?? "en",
    includeResearch: options?.includeResearch ?? false,
    includeCoach: options?.includeCoach ?? true,
    includeAssist: options?.includeAssist ?? false,
    simulateDelayMs: options?.simulateDelayMs ?? 150
  };
}

export async function createJob(): Promise<JobStatus> {
  const now = new Date().toISOString();
  const job: JobStatus = {
    id: makeId("job"),
    status: "queued",
    step: "Queued",
    progress: 0,
    totalLectures: 0,
    completedLectures: 0,
    errors: [],
    createdAt: now,
    updatedAt: now
  };

  await setJob(job);
  return job;
}

async function resolveLectures(input: string, youtubeApiKey: string) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const playlistId = extractPlaylistId(input);
  if (playlistId) {
    return buildLecturesFromPlaylist(youtubeApiKey, playlistId);
  }

  if (lines.length > 1) {
    const parsed = buildLecturesFromLines(lines);
    const hydrated = await hydrateLectureDurations(youtubeApiKey, parsed.lectures);
    return { title: parsed.title, lectures: hydrated };
  }

  const videoId = extractVideoId(lines[0] ?? "");
  if (videoId) {
    const single = buildLecturesFromLines([lines[0] ?? videoId]);
    const hydrated = await hydrateLectureDurations(youtubeApiKey, single.lectures);
    return { title: single.title, lectures: hydrated };
  }

  throw new Error("Could not parse playlist or video input");
}

async function verifyNoteWithRetry(
  note: any,
  transcript: TranscriptSegment[],
  apiKey: string,
  flashModel: string,
  proModel: string,
  extraContext?: string
) {
  const verified = await verifyNotes(note, transcript, apiKey, flashModel);
  if (verified.verified) {
    return verified;
  }

  const retried = await generateNotes(
    {
      id: note.lectureId,
      title: note.lectureTitle,
      url: note.lectureUrl,
      videoId: note.videoId,
      durationSeconds: 0,
      order: 0
    },
    transcript,
    apiKey,
    proModel,
    extraContext
  );

  return verifyNotes(retried, transcript, apiKey, flashModel);
}

export async function runPackPipeline(jobId: string, inputs: PipelineInputs) {
  const job = await getJob(jobId);
  if (!job) return;
  let jobErrors = job.errors ?? [];

  try {
    await updateJob(jobId, {
      status: "processing",
      step: "Mapping playlist",
      progress: 0.05
    });

    const { title, lectures } = await resolveLectures(
      inputs.input,
      inputs.youtubeApiKey
    );

    await updateJob(jobId, {
      totalLectures: lectures.length,
      completedLectures: 0,
      currentLecture: undefined,
      progress: 0.1
    });

    const blueprint = buildBlueprint(title, lectures);
    let researchReport;

    if (inputs.options.includeResearch && inputs.researchSources?.length) {
      await updateJob(jobId, {
        step: "Building research blueprint",
        progress: 0.15
      });

      const sources = await fetchResearchSources(inputs.researchSources);
      researchReport = await buildResearchReport(
        title,
        sources,
        inputs.geminiApiKey,
        inputs.models.pro
      );
    }

    await updateJob(jobId, {
      step: "Generating evidence-backed notes",
      progress: 0.2
    });

    const notes = [] as Pack["notes"];
    const transcripts: Record<string, TranscriptSegment[]> = {};
    const extraContext = [inputs.vaultNotes, inputs.examDate ? `Exam date: ${inputs.examDate}` : ""]
      .filter(Boolean)
      .join("\n");

    for (let index = 0; index < lectures.length; index += 1) {
      const lecture = lectures[index];
      try {
        await updateJob(jobId, {
          currentLecture: lecture.title,
          step: `Transcribing ${lecture.title}`
        });

        const segments = await fetchTranscriptSegments(
          lecture.videoId,
          inputs.options.language
        );
        transcripts[lecture.id] = segments;

        await updateJob(jobId, {
          step: `Generating notes for ${lecture.title}`
        });

        const note = await generateNotes(
          lecture,
          segments,
          inputs.geminiApiKey,
          inputs.models.pro,
          extraContext
        );

        const verified = await verifyNoteWithRetry(
          note,
          segments,
          inputs.geminiApiKey,
          inputs.models.flash,
          inputs.models.pro,
          extraContext
        );

        notes.push(verified);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        jobErrors = [...jobErrors, `Lecture ${lecture.title} failed: ${message}`];
        await updateJob(jobId, {
          errors: jobErrors,
          step: `Skipped ${lecture.title}`
        });
        notes.push({
          lectureId: lecture.id,
          lectureTitle: lecture.title,
          lectureUrl: lecture.url,
          videoId: lecture.videoId,
          summary: "Transcript unavailable or generation failed.",
          sections: [],
          keyTakeaways: [],
          citations: [],
          verified: false,
          verificationNotes: [message]
        });
      }

      await updateJob(jobId, {
        completedLectures: index + 1,
        progress: 0.2 + ((index + 1) / lectures.length) * 0.4
      });
      await delay(inputs.options.simulateDelayMs);
    }

    await updateJob(jobId, {
      step: "Building question bank",
      progress: 0.65
    });

    const questions = await generateQuestionBank(
      notes,
      inputs.geminiApiKey,
      inputs.models.pro,
      4,
      extraContext
    );

    const transcriptContext = notes
      .map((note) => buildTranscriptText(transcripts[note.lectureId] ?? []))
      .join("\n");

    const verifiedQuestions: Pack["questions"] = [];
    for (const question of questions) {
      const verified = await verifyQuestion(
        question,
        transcriptContext,
        inputs.geminiApiKey,
        inputs.models.flash
      );
      verifiedQuestions.push(verified);
    }

    await updateJob(jobId, {
      step: "Assembling mock exam",
      progress: 0.78
    });

    const exam = buildExam(
      verifiedQuestions,
      inputs.options.examSize,
      `${title} Mock Exam`
    );

    const mastery: Pack["mastery"] = {};
    blueprint.topics.forEach((topic) => {
      mastery[topic.id] = createMasteryRecord(topic.id);
    });

    const packId = makeId("pack");
    const pack: Pack = {
      id: packId,
      title: `${title} Exam Pack`,
      input: inputs.input,
      createdAt: new Date().toISOString(),
      blueprint,
      notes,
      questions: verifiedQuestions,
      exam,
      mastery,
      researchReport,
      exports: {}
    };

    await setPack(pack);
    await updateJob(jobId, {
      status: "completed",
      step: "Ready",
      progress: 1,
      packId,
      currentLecture: undefined
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await updateJob(jobId, {
      status: "failed",
      step: "Failed",
      errors: [...jobErrors, message]
    });
  }
}
