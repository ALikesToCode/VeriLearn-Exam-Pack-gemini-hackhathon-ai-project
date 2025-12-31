import { Lecture } from "./types";
import { slugify } from "./utils";

const YT_BASE = "https://www.googleapis.com/youtube/v3";

export function extractPlaylistId(input: string) {
  try {
    const url = new URL(input);
    const list = url.searchParams.get("list");
    if (list) return list;
  } catch {
    // not a URL
  }

  if (input.startsWith("PL") || input.startsWith("UU") || input.startsWith("OL")) {
    return input;
  }

  return null;
}

export function extractVideoId(input: string) {
  try {
    const url = new URL(input);
    if (url.hostname === "youtu.be") {
      return url.pathname.replace("/", "");
    }
    const v = url.searchParams.get("v");
    if (v) return v;
  } catch {
    // not a URL
  }

  if (/^[a-zA-Z0-9_-]{10,}$/.test(input)) {
    return input;
  }

  return null;
}

function parseISODuration(duration: string) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `YouTube API error: ${response.status}`);
  }
  return response.json();
}

async function fetchPlaylistTitle(apiKey: string, playlistId: string) {
  const url = new URL(`${YT_BASE}/playlists`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("id", playlistId);
  url.searchParams.set("key", apiKey);

  const data = await fetchJson(url.toString());
  const title = data.items?.[0]?.snippet?.title as string | undefined;
  return title ?? "YouTube Playlist";
}

async function fetchPlaylistItems(apiKey: string, playlistId: string) {
  let pageToken: string | undefined;
  const items: Array<{ videoId: string; title: string }> = [];

  do {
    const url = new URL(`${YT_BASE}/playlistItems`);
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const data = await fetchJson(url.toString());
    data.items?.forEach((item: any) => {
      const videoId = item.contentDetails?.videoId as string | undefined;
      const title = item.snippet?.title as string | undefined;
      if (videoId && title && title !== "Private video" && title !== "Deleted video") {
        items.push({ videoId, title });
      }
    });

    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}

async function fetchVideoDurations(apiKey: string, videoIds: string[]) {
  const durations = new Map<string, number>();

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const url = new URL(`${YT_BASE}/videos`);
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);

    const data = await fetchJson(url.toString());
    data.items?.forEach((item: any) => {
      const id = item.id as string;
      const duration = parseISODuration(item.contentDetails?.duration ?? "");
      durations.set(id, duration);
    });
  }

  return durations;
}

export async function hydrateLectureDurations(apiKey: string, lectures: Lecture[]) {
  const durations = await fetchVideoDurations(
    apiKey,
    lectures.map((lecture) => lecture.videoId)
  );
  return lectures.map((lecture) => ({
    ...lecture,
    durationSeconds: durations.get(lecture.videoId) ?? lecture.durationSeconds
  }));
}

export async function buildLecturesFromPlaylist(
  apiKey: string,
  playlistId: string,
  playlistUrl: string
): Promise<{ title: string; lectures: Lecture[] }> {
  const title = await fetchPlaylistTitle(apiKey, playlistId);
  const items = await fetchPlaylistItems(apiKey, playlistId);
  const durations = await fetchVideoDurations(
    apiKey,
    items.map((item) => item.videoId)
  );

  const lectures: Lecture[] = items.map((item, index) => ({
    id: `lec_${slugify(item.title)}_${index + 1}`,
    title: item.title,
    url: `https://www.youtube.com/watch?v=${item.videoId}&list=${playlistId}`,
    videoId: item.videoId,
    durationSeconds: durations.get(item.videoId) ?? 0,
    order: index + 1
  }));

  return { title, lectures };
}

export function buildLecturesFromLines(lines: string[]): {
  title: string;
  lectures: Lecture[];
} {
  const lectures = lines.map((line, index) => {
    const [rawTitle, rawUrl] = line.includes("|")
      ? line.split("|").map((part) => part.trim())
      : [line, line];
    const url = rawUrl.startsWith("http")
      ? rawUrl
      : `https://www.youtube.com/watch?v=${rawUrl}`;
    const videoId = extractVideoId(url) ?? `custom_${index + 1}`;
    const title = rawTitle.startsWith("http") ? `Lecture ${index + 1}` : rawTitle;

    return {
      id: `lec_${slugify(title)}_${index + 1}`,
      title,
      url,
      videoId,
      durationSeconds: 0,
      order: index + 1
    } satisfies Lecture;
  });

  return { title: "Custom Playlist", lectures };
}
