const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function ffmpeg(buffer, args = [], ext = "", ext2 = "") {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = path.join(process.cwd(), "tmp", +new Date() + "." + ext);
      let out = tmp + "." + ext2;
      await fs.promises.writeFile(tmp, buffer);
      console.log("[ffmpeg] input:", tmp);
      console.log("[ffmpeg] output:", out);
      const proc = spawn("ffmpeg", ["-y", "-i", tmp, ...args, out]);
      let stderr = "";
      proc.stderr.on("data", (d) => (stderr += d.toString()));
      proc.on("error", (err) => {
        console.error("[ffmpeg] spawn error:", err);
        reject(err);
      });
      proc.on("close", async (code) => {
        try {
          await fs.promises.unlink(tmp);
          if (code !== 0) {
            console.error("[ffmpeg] process failed:", stderr);
            return reject(stderr || code);
          }
          console.log("[ffmpeg] process success, reading output:", out);
          resolve(await fs.promises.readFile(out));
          await fs.promises.unlink(out);
        } catch (e) {
          console.error("[ffmpeg] close/catch error:", e);
          reject(e);
        }
      });
    } catch (e) {
      console.error("[ffmpeg] outer error:", e);
      reject(e);
    }
  });
}

function toAudio(buffer, ext) {
  return ffmpeg(
    buffer,
    ["-vn", "-ac", "2", "-b:a", "128k", "-ar", "44100", "-f", "mp3"],
    ext,
    "mp3"
  );
}

function toPTT(buffer, ext) {
  return ffmpeg(
    buffer,
    [
      "-vn",
      "-c:a",
      "libopus",
      "-b:a",
      "128k",
      "-vbr",
      "on",
      "-compression_level",
      "10",
    ],
    ext,
    "opus"
  );
}

function toVideo(buffer, ext) {
  return ffmpeg(
    buffer,
    [
      "-fflags",
      "+genpts",
      "-c:v",
      "libx264",
      "-profile:v",
      "main",
      "-level",
      "3.1",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ar",
      "44100",
      "-movflags",
      "+faststart",
      "-crf",
      "28",
      "-preset",
      "medium",
      "-shortest",
      "-fps_mode",
      "auto",
    ],
    ext,
    "mp4"
  );
}

async function compressMp3(buffer, bitrate = "128k") {
  return ffmpeg(
    buffer,
    ["-vn", "-ac", "2", "-b:a", bitrate, "-ar", "44100", "-f", "mp3"],
    "mp3",
    "mp3"
  );
}

module.exports = {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
  compressMp3,
};
