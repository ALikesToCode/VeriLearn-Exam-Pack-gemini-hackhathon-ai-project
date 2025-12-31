import { spawn } from "child_process";
import ytdl from "ytdl-core";

const MAX_CAPTURE_SECONDS = 600;

function canCapture() {
  return Boolean(process.env.ENABLE_FRAME_CAPTURE);
}

export async function captureFrame(options: {
  videoId: string;
  timestampSeconds: number;
}) {
  if (!canCapture()) return null;
  if (options.timestampSeconds > MAX_CAPTURE_SECONDS) return null;

  const videoUrl = `https://www.youtube.com/watch?v=${options.videoId}`;
  const ffmpegPath = process.env.FFMPEG_PATH ?? "ffmpeg";

  return new Promise<string | null>((resolve) => {
    const stream = ytdl(videoUrl, { quality: "lowestvideo" });
    const args = [
      "-i",
      "pipe:0",
      "-ss",
      String(Math.max(options.timestampSeconds, 0)),
      "-frames:v",
      "1",
      "-f",
      "image2",
      "-vcodec",
      "mjpeg",
      "pipe:1"
    ];

    const ffmpeg = spawn(ffmpegPath, args, { stdio: ["pipe", "pipe", "ignore"] });
    const chunks: Buffer[] = [];

    ffmpeg.stdout.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    ffmpeg.on("close", (code) => {
      if (code !== 0 || !chunks.length) {
        resolve(null);
        return;
      }
      const buffer = Buffer.concat(chunks);
      const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
      resolve(dataUrl);
    });

    stream.on("error", () => resolve(null));
    ffmpeg.on("error", () => resolve(null));
    stream.pipe(ffmpeg.stdin);
  });
}
