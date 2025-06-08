const axios = require("axios");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const cheerio = require("cheerio");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");
const { YtDlp } = require("ytdlp-nodejs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const readline = require("readline");
const ffmpeg = require("fluent-ffmpeg-7");
const NodeID3 = require("node-id3");
const { randomBytes } = require("crypto");
const https = require("https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ytSearch = require("yt-search");
const TikTokSearch = require('tiktok-search');
const { toAudio, toPTT, toVideo } = require("./converter");

let chalk;
import("chalk")
  .then((chalkModule) => {
    chalk = chalkModule.default;
  })
  .catch((error) => {
    console.error("Failed to load chalk:", error);
  });

const ytIdRegex =
  /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;

function getVideoID(url) {
  if (!ytIdRegex.test(url)) throw new Error("is not YouTube URL");
  const match = ytIdRegex.exec(url);
  return match ? match[1] : null;
}

async function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

async function chatGpt(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const anu = await axios.post(
        "https://api.paxsenix.biz.id/ai/gpt4omini",
        JSON.stringify({ messages: [{ role: "user", content: query }] }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!anu.status || !anu.data.ok) {
        reject(new Error("ai sedang sibuk"));
      }
      resolve(anu.data.message);
    } catch (e) {
      reject(e);
    }
  });
}

async function tiktokDl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(
        `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`
      );
      if (data && data.data && data.data.play) {
        resolve({
          status: true,
          title: data.data.title || "TikTok Video",
          author: {
            nickname: data.data.author.nickname || "Unknown",
            id: data.data.author.unique_id || "",
          },
          stats: {
            views: data.data.play_count || "0",
            likes: data.data.digg_count || "0",
          },
          data: [
            {
              type: "video",
              url: data.data.play,
            },
          ],
        });
      } else {
        reject(new Error("Gagal mendapatkan video dari SnapTik (tikwm.com)."));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function facebookDl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(
        "https://getmyfb.com/process",
        new URLSearchParams({
          id: decodeURIComponent(url),
          locale: "en",
        }),
        {
          headers: {
            "hx-current-url": "https://getmyfb.com/",
            "hx-request": "true",
            "hx-target": url.includes("share")
              ? "#private-video-downloader"
              : "#target",
            "hx-trigger": "form",
            "hx-post": "/process",
            "hx-swap": "innerHTML",
          },
        }
      );
      const $ = cheerio.load(data);
      resolve({
        caption:
          $(".results-item-text").length > 0
            ? $(".results-item-text").text().trim()
            : "",
        preview: $(".results-item-image").attr("src") || "",
        results: $(".results-list-item")
          .get()
          .map((el) => ({
            quality: parseInt($(el).text().trim()) || "",
            type: $(el).text().includes("HD") ? "HD" : "SD",
            url: $(el).find("a").attr("href") || "",
          })),
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function instaDl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const homepage = await axios.get("https://igramio-app.net/");
      const visolixApiMatch = homepage.data.match(
        /var visolix_api\s*=\s*(\{[\s\S]*?\});/
      );
      if (!visolixApiMatch)
        return reject(new Error("Gagal ambil visolix_api dari homepage."));
      const visolixApi = JSON.parse(visolixApiMatch[1]);
      const nonce = visolixApi.nonce;
      const downloadUrl = visolixApi.download_url;
      if (!nonce || !downloadUrl)
        return reject(new Error("Gagal ambil nonce atau endpoint download."));
      const { data } = await axios.post(
        downloadUrl,
        { url, format: "", captcha_response: "" },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Visolix-Nonce": nonce,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            Referer: "https://igramio-app.net/",
          },
        }
      );
      let html = data;
      if (typeof data === "object" && data.data) {
        html = data.data;
      }
      const cheerio = require("cheerio");
      const $ = cheerio.load(html);
      const results = [];
      $("a.visolix-download-media").each((i, el) => {
        const mediaUrl = $(el).attr("href");
        if (
          mediaUrl &&
          (mediaUrl.includes("dl.php?id=") ||
            mediaUrl.includes(".mp4") ||
            mediaUrl.includes(".jpg"))
        ) {
          results.push({ url: mediaUrl });
        }
      });
      if (results.length === 0) {
        reject(new Error("No media found"));
      } else {
        resolve(results);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function instaDownload(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = [];
      const { data } = await axios.post(
        "https://v3.igdownloader.app/api/ajaxSearch",
        new URLSearchParams({
          recaptchaToken: "",
          q: url,
          t: "media",
          lang: "en",
        }),
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        }
      );
      const $ = cheerio.load(data.data);
      $("ul.download-box li").each((a, b) => {
        const media = [];
        $(b)
          .find(".photo-option select option")
          .each((c, d) => {
            media.push({
              resolution: $(d).text(),
              url: $(d).attr("value"),
            });
          });
        const thumb = $(b).find(".download-items__thumb img").attr("src");
        const download = $(b).find(".download-items__btn a").attr("href");
        result.push({ thumb, media, download });
      });
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
}

async function instaStory(name) {
  return new Promise(async (resolve, reject) => {
    try {
      const results = [];
      const formData = new FormData();
      const key = await axios.get("https://storydownloader.app/en");
      const $$ = cheerio.load(key.data);
      const cookie = key.headers["set-cookie"];
      const token = $$('input[name="_token"]').attr("value");
      const headers = {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        cookie: cookie,
        origin: "https://storydownloader.app",
        referer: "https://storydownloader.app/en",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
        "X-CSRF-TOKEN": token,
      };
      formData.append("username", name);
      formData.append("_token", token);
      const res = await axios.post(
        "https://storydownloader.app/request",
        formData,
        {
          headers: {
            ...headers,
            ...formData.getHeaders(),
          },
        }
      );
      const $ = cheerio.load(res.data.html);
      const username = $("h3.card-title").text();
      const profile_url = $("img.card-avatar").attr("src");
      $("div.row > div").each(function () {
        const _ = $(this);
        const url = _.find("a").attr("href");
        const thumbnail = _.find("img").attr("src");
        const type = /video_dashinit\.mp4/i.test(url) ? "video" : "image";
        if (thumbnail && url) {
          results.push({
            thumbnail,
            url,
            type,
          });
        }
      });
      const data = {
        username,
        profile_url,
        results,
      };
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

async function getSavefromMp4(url) {
  try {
    const res = await axios.get(
      `https://worker.sf-tools.com/savefrom/api/convert`,
      {
        params: { url },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Referer: "https://en.savefrom.net/1/",
        },
      }
    );
    if (res.data && res.data.url && res.data.meta) {
      return {
        url: res.data.url,
        title: res.data.meta.title || "Unknown Title",
        thumbnail: res.data.meta.cover || null,
      };
    }
    throw new Error("No video url from savefrom");
  } catch (e) {
    console.error("savefrom fallback error:", e.message);
    return null;
  }
}

async function ytMp4(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const videoId = getVideoID(url);
      if (!videoId) throw new Error("URL YouTube tidak valid");
      let title = "Unknown Title";
      let channel = "Unknown Channel";
      let views = "N/A";
      let likes = "-";
      let thumbnail = null;
      try {
        const info = await ytdl.getInfo(url);
        title = info.videoDetails.title || title;
        channel = info.videoDetails.author.name || channel;
        views = info.videoDetails.viewCount || views;
        likes =
          info.videoDetails.likes && info.videoDetails.likes !== "N/A"
            ? info.videoDetails.likes
            : likes;
        if (
          info.videoDetails.thumbnails &&
          info.videoDetails.thumbnails.length > 0
        ) {
          thumbnail =
            info.videoDetails.thumbnails[
              info.videoDetails.thumbnails.length - 1
            ].url;
        }
      } catch (e) {
        console.error("Gagal ambil metadata YouTube (ytdl-core):", e);  
        try {
          const search = await ytSearch({ videoId: videoId });
          if (search && search.title) title = search.title;
          if (search && search.author && search.author.name)
            channel = search.author.name;
          if (search && search.views) views = search.views;
          if (search && search.image) thumbnail = search.image;
          if (search && search.likes) likes = search.likes;
        } catch (e2) {
          console.error("Fallback yt-search gagal:", e2);
        }
      }
      const ytdlp = new YtDlp();
      let output;
      try {
        output = await ytdlp.exec(url, {
          format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
          output: "-",
        });
      } catch (e) {
        output = null;
      }
      let videoBuffer = null;
      if (output && Buffer.isBuffer(output)) {
        videoBuffer = output;
      } else {
        const sf = await getSavefromMp4(url);
        if (sf && sf.url) {
          const res = await axios.get(sf.url, { responseType: "arraybuffer" });
          videoBuffer = Buffer.from(res.data);
          resolve({
            result: videoBuffer,
            title: sf.title,
            channel: "-",
            views: "-",
            likes: "-",
            size: await bytesToSize(videoBuffer.length),
            thumbnail: sf.thumbnail,
          });
          return;
        } else {
          reject(new Error("Gagal download video (yt-dlp & savefrom)"));
          return;
        }
      }
      const size = await bytesToSize(videoBuffer.length);
      resolve({
        title,
        channel,
        views,
        likes,
        size,
        result: videoBuffer,
        thumbnail,
      });
    } catch (error) {
      console.error("Error di ytMp4:", error);
      reject(
        new Error(
          `Maaf, terjadi kesalahan saat mengunduh video YouTube. Error: ${error.message} 😥`
        )
      );
    }
  });
}

async function ytMp3(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const videoId = getVideoID(url);
      if (!videoId) throw new Error("URL YouTube tidak valid");

      let title = "Unknown Title";
      let channel = "Unknown Channel";
      try {
        const info = await ytdl.getInfo(url);
        title = info.videoDetails.title || title;
        channel = info.videoDetails.author.name || channel;
      } catch (e) {
        console.error("Gagal ambil metadata YouTube (ytdl-core):", e);
        try {
          const search = await ytSearch({ videoId: videoId });
          if (search && search.title) title = search.title;
          if (search && search.author && search.author.name)
            channel = search.author.name;
        } catch (e2) {
          console.error("Fallback yt-search gagal:", e2);
        }
      }

      const ytdlp = new YtDlp();
      let output = await ytdlp.exec(url, {
        extractAudio: true,
        audioFormat: "mp3",
        audioQuality: 0,
        output: "-",
      });

      let mp3Buffer = null;
      const isAudioFile = (filePath) =>
        /\.(mp3|m4a|webm|opus|wav|aac|ogg)$/i.test(filePath) &&
        !filePath.includes("yt-dlp.exe");

      if (
        output &&
        typeof output === "object" &&
        typeof output.stdout === "object" &&
        typeof output.stdout.on === "function"
      ) {
        const chunks = [];
        output.stdout.on("data", (chunk) => chunks.push(chunk));
        output.stdout.on("end", async () => {
          try {
            mp3Buffer = Buffer.concat(chunks);
            if (
              !(
                mp3Buffer[0] === 0x49 &&
                mp3Buffer[1] === 0x44 &&
                mp3Buffer[2] === 0x33
              )
            ) {
              mp3Buffer = await toAudio(mp3Buffer, "mp4");
            }
            resolve({
              title,
              channel,
              size: bytesToSize(mp3Buffer.length),
              result: mp3Buffer,
            });
          } catch (err) {
            reject(
              new Error("Gagal menggabungkan stream audio: " + err.message)
            );
          }
        });
        output.stdout.on("error", (err) => {
          reject(new Error("Gagal membaca stream audio: " + err.message));
        });
        return;
      }

      if (Buffer.isBuffer(output)) {
        mp3Buffer = output;
      } else if (typeof output === "string" && fs.existsSync(output)) {
        mp3Buffer = fs.readFileSync(output);
        if (isAudioFile(output)) fs.unlinkSync(output);
      } else if (typeof output === "object" && output !== null) {
        const possibleKeys = Object.keys(output).filter(
          (k) =>
            typeof output[k] === "string" &&
            fs.existsSync(output[k]) &&
            isAudioFile(output[k])
        );
        if (possibleKeys.length > 0) {
          mp3Buffer = fs.readFileSync(output[possibleKeys[0]]);
          if (isAudioFile(output[possibleKeys[0]]))
            fs.unlinkSync(output[possibleKeys[0]]);
        }
      }
      if (!mp3Buffer) {
        throw new Error("Gagal mendapatkan audio dari YouTube");
      }
      if (
        !(
          mp3Buffer[0] === 0x49 &&
          mp3Buffer[1] === 0x44 &&
          mp3Buffer[2] === 0x33
        )
      ) {
        mp3Buffer = await toAudio(mp3Buffer, "mp4");
      }

      resolve({
        title,
        channel,
        size: bytesToSize(mp3Buffer.length),
        result: mp3Buffer,
      });
    } catch (error) {
      console.error("Error di ytMp3:", error);
      reject(
        new Error(
          `Maaf, terjadi kesalahan saat mengunduh audio YouTube. Error: ${error.message} 😥`
        )
      );
    }
  });
}

async function allDl(url, options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(
        "https://api.cobalt.tools/api/json",
        { url, ...options },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Referer: "https://cobalt.tools/",
          },
        }
      );
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

async function quotedLyo(teks, name, profile, reply, color = "#FFFFFF") {
  return new Promise(async (resolve, reject) => {
    const { url, options } = reply || {};
    const str = {
      type: "quote",
      format: "png",
      backgroundColor: color,
      width: 512,
      height: 768,
      scale: 2,
      messages: [
        {
          entities: [],
          ...(url ? { media: { url } } : {}),
          avatar: true,
          from: {
            id: 1,
            name,
            photo: {
              url: profile,
            },
          },
          ...(options ? options : {}),
          text: teks,
          replyMessage: {},
        },
      ],
    };

    try {
      const { data } = await axios.post(
        "https://bot.lyo.su/quote/generate",
        JSON.stringify(str, null, 2),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

async function cekKhodam(name) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(
        "https://khodam.vercel.app/v2?nama=" + encodeURIComponent(name)
      );
      const $ = cheerio.load(data);
      const res = $(
        ".__className_cad559.text-3xl.font-bold.text-rose-600"
      ).text();
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}

async function simi(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const isi = new URLSearchParams();
      isi.append("text", query);
      isi.append("lc", "id");
      isi.append("=", "");
      const { data } = await axios.post("https://simsimi.vn/web/simtalk", isi, {
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

async function mediafireDownload(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const { default: fetch } = await import("node-fetch");
      const res = await fetch("https://r.jina.ai/" + url, {
        headers: {
          "x-return-format": "html",
        },
      });
      const data = await res.text();
      const $ = cheerio.load(data);
      const link = $("a#downloadButton").attr("href");
      const size = $("a#downloadButton")
        .text()
        .replace("Download", "")
        .replace("(", "")
        .replace(")", "")
        .trim();
      const upload_date = $(".dl-info .details li")
        .last()
        .find("span")
        .text()
        .trim();
      const name = $("div.dl-btn-label").attr("title") || link.split("/")[5];
      const type = name.split(".").pop().toLowerCase();
      resolve({ name, type, upload_date, size, link });
    } catch (e) {
      reject(e);
    }
  });
}

async function wallpaper(title, page = "1") {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`
      );
      const $ = cheerio.load(response);
      const hasil = [];
      $("div.grid-item").each(function (a, b) {
        hasil.push({
          title: $(b).find("div.info > p").attr("title"),
          type: $(b).find("div.info > a:nth-child(2)").text(),
          source:
            "https://www.besthdwallpaper.com" + $(b).find("a").attr("href"),
          image: [
            $(b).find("picture > img").attr("data-src") ||
              $(b).find("picture > img").attr("src"),
            $(b).find("picture > source:nth-child(1)").attr("srcset"),
            $(b).find("picture > source:nth-child(2)").attr("srcset"),
          ],
        });
      });
      resolve(hasil);
    } catch (e) {
      reject(e);
    }
  });
}

async function cariresep(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://masak-apa.tomorisakura.vercel.app/api/recipe/${encodeURIComponent(
          query
        )}`
      );

      if (response.data && response.data.results) {
        resolve(response.data.results);
      } else {
        reject(new Error("No recipes found"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function detailresep(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://masak-apa.tomorisakura.vercel.app/api/recipe/${encodeURIComponent(
          url
        )}`
      );

      if (response.data) {
        resolve(response.data);
      } else {
        reject(new Error("Recipe details not found"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function Steam(search) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
          search
        )}&l=english&cc=us`
      );

      if (response.data && response.data.items) {
        resolve(response.data.items);
      } else {
        reject(new Error("No games found"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function Steam_Detail(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${url}`
      );

      if (response.data && response.data[url] && response.data[url].success) {
        resolve(response.data[url].data);
      } else {
        reject(new Error("Game details not found"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function tiktokNoWM(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        "https://api.tikmate.online/api/lookup",
        {
          url: url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        }
      );

      if (response.data && response.data.video) {
        const videoData = response.data.video;
        resolve({
          status: true,
          title: videoData.title || "TikTok Video",
          author: {
            nickname: videoData.author || "Unknown",
            id: videoData.author_id || "0",
          },
          stats: {
            views: videoData.views || "0",
            likes: videoData.likes || "0",
          },
          data: [
            {
              type: "video",
              url: videoData.download_url,
            },
          ],
        });
      } else {
        reject(new Error("Tidak dapat menemukan data video"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function instagramVideo(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const results = [];
      const input = new URLSearchParams({
        action: "ajax_insta_url",
        input: url,
      });
      const { data } = await axios.post(
        "https://igram.bar/wp-admin/admin-ajax.php",
        input,
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "upgrade-insecure-requests": "1",
            referer: "https://igram.bar",
            "referrer-policy": "strict-origin-when-cross-origin",
          },
        }
      );
      const $ = cheerio.load(data);
      $("script").each((i, e) => {
        const text = $(e).html();
        const matchedUrl = text?.match(/location.href = "(.*?)"/)?.[1];
        if (matchedUrl) {
          results.push({ url: matchedUrl });
        }
      });
      const uniqueData = Array.from(
        new Set(results.map((item) => item.url))
      ).map((_hurl) => {
        return results.find((item) => item.url === _hurl);
      });
      resolve(uniqueData);
    } catch (e) {
      reject(e);
    }
  });
}

async function facebookVideo(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(
        "https://getmyfb.com/process",
        new URLSearchParams({
          id: decodeURIComponent(url),
          locale: "en",
        }),
        {
          headers: {
            "hx-current-url": "https://getmyfb.com/",
            "hx-request": "true",
            "hx-target": url.includes("share")
              ? "#private-video-downloader"
              : "#target",
            "hx-trigger": "form",
            "hx-post": "/process",
            "hx-swap": "innerHTML",
          },
        }
      );
      const $ = cheerio.load(data);
      resolve({
        caption:
          $(".results-item-text").length > 0
            ? $(".results-item-text").text().trim()
            : "",
        preview: $(".results-item-image").attr("src") || "",
        results: $(".results-list-item")
          .get()
          .map((el) => ({
            quality: parseInt($(el).text().trim()) || "",
            type: $(el).text().includes("HD") ? "HD" : "SD",
            url: $(el).find("a").attr("href") || "",
          })),
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function searchWallpaper(query, page = "1") {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${query}`
      );
      const $ = cheerio.load(response);
      const hasil = [];
      $("div.grid-item").each(function (a, b) {
        hasil.push({
          title: $(b).find("div.info > p").attr("title"),
          type: $(b).find("div.info > a:nth-child(2)").text(),
          source:
            "https://www.besthdwallpaper.com" + $(b).find("a").attr("href"),
          image: [
            $(b).find("picture > img").attr("data-src") ||
              $(b).find("picture > img").attr("src"),
            $(b).find("picture > source:nth-child(1)").attr("srcset"),
            $(b).find("picture > source:nth-child(2)").attr("srcset"),
          ],
        });
      });
      resolve(hasil);
    } catch (e) {
      reject(e);
    }
  });
}

async function searchRecipe(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://masak-apa.tomorisakura.vercel.app/api/recipe/${query}`
      );
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
}

async function getRecipeDetail(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://masak-apa.tomorisakura.vercel.app/api/recipe/${url}`
      );
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
}

async function searchSteamGame(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
          query
        )}&l=english&cc=us`
      );
      if (response.data && response.data.items) {
        resolve(response.data.items);
      } else {
        reject(new Error("Tidak ada game yang ditemukan"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function getSteamGameDetail(appId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${appId}`
      );
      if (
        response.data &&
        response.data[appId] &&
        response.data[appId].success
      ) {
        resolve(response.data[appId].data);
      } else {
        reject(new Error("Detail game tidak ditemukan"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function jadwalSholatAPI(city, country = "") {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    let apiUrl = `http://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${encodeURIComponent(
      city
    )}`;

    const targetCountry = country || "indonesia";
    apiUrl += `&country=${encodeURIComponent(targetCountry)}`;

    apiUrl += `&method=11`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.code === 200 && data.status === "OK") {
      const timings = data.data.timings;
      return {
        subuh: timings.Fajr,
        duha: timings.Dhuhr,
        zuhur: timings.Dhuhr,
        asar: timings.Asr,
        magrib: timings.Maghrib,
        isya: timings.Isha,
      };
    } else {
      throw new Error(data.status || "Gagal mendapatkan data dari API");
    }
  } catch (error) {
    console.error("Error fetching prayer times from API:", error);
    if (error.response && error.response.status === 404) {
      throw new Error("Nama kota atau negara tidak ditemukan.");
    } else {
      throw new Error(
        "Gagal mengambil data jadwal sholat dari API. Coba lagi nanti."
      );
    }
  }
}

async function telegramStalk(username) {
  console.log(`Melakukan stalk Telegram untuk: ${username}`);
  try {
    const response = await axios.get(
      `https://api.telegramstalk.com/stalk?username=${username}`
    );
    if (response.data && response.data.user) {
      return {
        username: response.data.user.username,
        userId: response.data.user.id,
        bio: response.data.user.bio,
        status: response.data.user.status,
        profilePicUrl: response.data.user.profile_pic_url,
      };
    } else {
      throw new Error("Pengguna tidak ditemukan");
    }
  } catch (error) {
    console.error("Error in telegramStalk API call:", error);
    throw new Error(`Gagal mendapatkan data profil Telegram untuk ${username}`);
  }
}
async function tiktokStalk(username) {
  try {
    const response = await axios.get(
      `https://www.tiktok.com/@${username}?_t=ZS-8tHANz7ieoS&_r=1`
    );
    const html = response.data;
    const $ = cheerio.load(html);
    const scriptData = $("#__UNIVERSAL_DATA_FOR_REHYDRATION__").html();
    const parsedData = JSON.parse(scriptData);

    const userDetail = parsedData.__DEFAULT_SCOPE__?.["webapp.user-detail"];
    if (!userDetail) {
      throw new Error("user tidak ditemukan");
    }

    const userInfo = userDetail.userInfo?.user;
    const stats = userDetail.userInfo?.stats;

    const metadata = {
      userInfo: {
        id: userInfo?.id || null,
        username: userInfo?.uniqueId || null,
        nama: userInfo?.nickname || null,
        avatar: userInfo?.avatarLarger || null,
        bio: userInfo?.signature || null,
        verifikasi: userInfo?.verified || false,
        totalfollowers: stats?.followerCount || 0,
        totalmengikuti: stats?.followingCount || 0,
        totaldisukai: stats?.heart || 0,
        totalvideo: stats?.videoCount || 0,
        totalteman: stats?.friendCount || 0,
      },
    };

    return metadata;
  } catch (error) {
    return error.message;
  }
}

async function genshinStalk(uid) {
  console.log(`Melakukan stalk Genshin Impact untuk UID: ${uid}`);
  try {
    const response = await axios.get(
      `https://api.genshinstalker.com/stalk?uid=${uid}`
    );
    if (response.data && response.data.player) {
      return response.data.player;
    } else {
      throw new Error("UID tidak ditemukan atau data tidak tersedia");
    }
  } catch (error) {
    console.error("Error in genshinStalk API call:", error);
    throw new Error(
      `Gagal mendapatkan data profil Genshin Impact untuk UID ${uid}`
    );
  }
}

async function bk9Ai(query) {
  console.log(`Memanggil BK9 AI dengan query: ${query}`);
  try {
    const response = await axios.post(`https://api.bk9ai.com/ask`, {
      prompt: query,
    });
    if (response.data && response.data.answer) {
      return response.data.answer;
    } else {
      throw new Error("Gagal mendapatkan jawaban dari BK9 AI");
    }
  } catch (error) {
    console.error("Error in bk9Ai API call:", error);
    throw new Error(`Gagal memproses permintaan dengan BK9 AI`);
  }
}

async function spotifyDl(url) {
  console.log(`Mengunduh dari Spotify URL: ${url}`);
  try {
    const response = await axios.get(
      `https://api.spotifydl.com/download?url=${encodeURIComponent(url)}`
    );
    if (response.data && response.data.url) {
      return {
        title: response.data.title || "Spotify Track",
        artist: response.data.artist || "Unknown Artist",
        url: response.data.url,
      };
    } else {
      throw new Error("Gagal mengunduh dari Spotify");
    }
  } catch (error) {
    console.error("Error in spotifyDl API call:", error);
    throw new Error(`Gagal mengunduh dari Spotify URL ${url}`);
  }
}

async function NvlGroup(query) {
  console.log(`Memanggil NvlGroup dengan query: ${query}`);
  try {
    const response = await axios.post(`https://api.nvlgroup.com/process`, {
      input: query,
    });
    if (response.data && response.data.result) {
      return response.data.result;
    } else {
      throw new Error("Gagal mendapatkan hasil dari NvlGroup");
    }
  } catch (error) {
    console.error("Error in NvlGroup API call:", error);
    throw new Error(`Gagal memproses permintaan dengan NvlGroup`);
  }
}

async function yanzGpt(query) {
  console.log(`Memanggil YanzGpt dengan query: ${query}`);
  try {
    const response = await axios.post(`https://api.yanzgpt.com/ask`, {
      question: query,
    });
    if (response.data && response.data.answer) {
      return response.data.answer;
    } else {
      throw new Error("Gagal mendapatkan jawaban dari YanzGpt");
    }
  } catch (error) {
    console.error("Error in YanzGpt API call:", error);
    throw new Error(`Gagal memproses permintaan dengan YanzGpt`);
  }
}

async function youSearch(query) {
  try {
    const result = await ytSearch(query);
    if (!result || !result.videos || result.videos.length === 0) {
      throw new Error("Gagal mendapatkan hasil dari YouTube Search");
    }
    return result.videos.slice(0, 5).map((v) => ({
      title: v.title,
      channel: v.author.name,
      url: v.url,
      duration: v.timestamp,
    }));
  } catch (error) {
    console.error("Error in youSearch (yt-search):", error);
    throw new Error("Gagal mencari dengan YouTube Search (yt-search)");
  }
}
async function gptLogic(messages = [], prompt) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(
        "https://chateverywhere.app/api/chat",
        {
          model: {
            id: "gpt-3.5-turbo-0613",
            name: "GPT-3.5",
            maxLength: 12000,
            tokenLimit: 4000,
          },
          prompt,
          messages,
        },
        {
          headers: {
            "content-type": "application/json",
            cookie:
              "_ga=GA1.1.34196701.1707462626; _ga_ZYMW9SZKVK=GS1.1.1707462625.1.0.1707462625.60.0.0; ph_phc_9n85Ky3ZOEwVZlg68f8bI3jnOJkaV8oVGGJcoKfXyn1_posthog=%7B%22distinct_id%22%3A%225aa4878d-a9b6-40fb-8345-3d686d655483%22%2C%22%24sesid%22%3A%5B1707462733662%2C%22018d8cb4-0217-79f9-99ac-b77f18f82ac8%22%2C1707462623766%5D%7D",
            origin: "https://chateverywhere.app",
            referer: "https://chateverywhere.app/id",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "x-forwarded-for": Array(4)
              .fill()
              .map(() => Math.floor(Math.random() * 256))
              .join("."),
          },
        }
      );
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

async function savetube(url, format) {
  console.log(`Mengunduh dari SaveTube URL: ${url} dengan format: ${format}`);
  try {
    const response = await axios.get(
      `https://api.savetube.com/download?url=${encodeURIComponent(
        url
      )}&format=${encodeURIComponent(format)}`
    );
    if (response.data && response.data.url) {
      return {
        title: response.data.title || "SaveTube Download",
        url: response.data.url,
        size: response.data.size || "N/A",
      };
    } else {
      throw new Error("Gagal mengunduh dari SaveTube");
    }
  } catch (error) {
    console.error("Error in savetube API call:", error);
    throw new Error(`Gagal mengunduh dari SaveTube URL ${url}`);
  }
}

async function mlstalk(id, zoneId) {
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        "https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store",
        new URLSearchParams(
          Object.entries({
            productId: "1",
            itemId: "2",
            catalogId: "57",
            paymentId: "352",
            gameId: id,
            zoneId: zoneId,
            product_ref: "REG",
            product_ref_denom: "AE",
          })
        ),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "https://www.duniagames.co.id/",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        resolve(response.data.data.gameDetail);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function hitamkan(buffer, filter = "hitam") {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(
        "https://negro.consulting/api/process-image",
        JSON.stringify({
          imageData: Buffer.from(buffer).toString("base64"),
          filter,
        }),
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (data && data.status === "success") {
        resolve(Buffer.from(data.processedImageUrl.split(",")[1], "base64"));
      }
    } catch (e) {
      reject(e);
    }
  });
}

async function getWeatherData(city) {
  const apiKey = "060a6bcfa19809c2cd4d97a212b19273";

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${apiKey}&lang=id`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data && response.data.main && response.data.weather) {
      return response.data;
    } else {
      throw new Error("Data cuaca tidak lengkap dari API.");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    if (error.response && error.response.status === 404) {
      throw new Error("Kota tidak ditemukan. Pastikan nama kota sudah benar.");
    } else {
      throw new Error(`Gagal mengambil data cuaca. Error: ${error.message}`);
    }
  }
}

async function fetchWaifuNeko(type = "sfw", category = "waifu") {
  const apiUrl = `https://api.waifu.pics/${type}/${category}`;
  try {
    const response = await axios.get(apiUrl);
    if (response.data && response.data.url) {
      return response.data.url;
    } else {
      throw new Error("Gagal mendapatkan URL gambar dari Waifu.pics API.");
    }
  } catch (error) {
    console.error(
      `Error fetching ${category} (${type}) from Waifu.pics:`,
      error.message
    );
    throw new Error(
      `Yah, gagal nih ambil gambar ${category}. Error: ${error.message}`
    );
  }
}

async function tiktokSearchScrape(keyword, count = 10) {
  try {
    const searchId = Math.floor(Math.random() * 1e12).toString();
    const response = await axios.get('https://tiktok-api23.p.rapidapi.com/api/search/video', {
      params: {
        keyword,
        cursor: 0,
        search_id: searchId
      },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
      }
    });

    const videos = response.data.item_list || [];
    if (!Array.isArray(videos) || videos.length === 0) {
      throw new Error('No results found');
    }

    return videos.slice(0, 5).map(video => ({
      id: video.id,
      desc: video.desc || '-',
      author: {
        uniqueId: video.author?.unique_id || video.author?.username || video.author?.nickname || '-',
        nickname: video.author?.nickname || video.author?.unique_id || video.author?.username || '-'
      },
      stats: {
        playCount:
          video.stats?.play_count ||
          video.stats?.playCount ||
          video.statistics?.play_count ||
          video.statistics?.playCount ||
          video.play_count ||
          video.playCount ||
          0,
        diggCount:
          video.stats?.digg_count ||
          video.stats?.likeCount ||
          video.stats?.likes ||
          video.statistics?.digg_count ||
          video.statistics?.likeCount ||
          video.statistics?.likes ||
          video.statistics?.heart_count ||
          video.statistics?.heartCount ||
          video.digg_count ||
          video.likeCount ||
          video.likes ||
          video.heart ||
          video.heart_count ||
          video.heartCount ||
          0
      },
      url: `https://www.tiktok.com/@${video.author?.unique_id || video.author?.username || video.author?.nickname || '-'}/video/${video.id}`,
      thumbnail: video.video?.cover || video.video?.originCover || '',
      videoUrl: video.video?.playAddr || '',
      downloadUrl: video.video?.downloadAddr || ''
    }));
  } catch (error) {
    if (error.response) {
      console.error('Error in tiktokSearchScrape:', error.response.status, error.response.data);
    } else {
      console.error('Error in tiktokSearchScrape:', error);
    }
    throw new Error('Failed to search TikTok videos');
  }
}

async function getFlvtoMp4(youtubeUrl) {
  const videoId = youtubeUrl.split("v=")[1].split("&")[0];
  const apiUrl = `https://api.flvto.online/@api/search/YouTube/${videoId}`;
  const { data } = await axios.get(apiUrl);
  if (!data.items || !data.items.length) throw new Error("No items found");
  const item = data.items[0];
  return item;
}

async function downloadYtMp4WithYtdlp(url) {
  const { spawn, execSync } = require("child_process");
  const fs = require("fs");
  const path = require("path");
  return new Promise((resolve, reject) => {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const isWindows = process.platform === "win32";
    const ytdlpCmd = isWindows ? "yt-dlp.exe" : "yt-dlp";

    let title = null;
    try {
      title = execSync(`${ytdlpCmd} --print title "${url}"`, {
        encoding: "utf8",
      }).trim();
    } catch (e) {
      title = null;
    }
    if (!title) title = "Video_YouTube";
    const safeTitle = title.replace(/[^a-zA-Z0-9-_ ]/g, "_");

    const infoJsonPath = path.join(tmpDir, `${safeTitle}.json`);
    try {
      fs.writeFileSync(infoJsonPath, JSON.stringify({ title }, null, 2));
    } catch (e) {}

    const outTemplate = path.join(tmpDir, `${safeTitle}.%(ext)s`);

    const ytdlp = spawn(ytdlpCmd, [
      url,
      "-o",
      outTemplate,
      "-f",
      "best[ext=mp4]/best",
      "--merge-output-format",
      "mp4",
      "--no-playlist",
      "--no-check-certificate",
      "--no-warnings",
      "--rm-cache-dir",
    ]);

    ytdlp.stdout.on("data", (data) => {
      console.log(`[yt-dlp] ${data}`);
    });

    ytdlp.stderr.on("data", (data) => {
      console.log(`[yt-dlp] ${data}`);
    });

    ytdlp.on("close", (code) => {
      if (code === 0) {
        const files = fs
          .readdirSync(tmpDir)
          .filter((f) => f.startsWith(safeTitle) && f !== `${safeTitle}.json`);

        if (files.length > 0) {
          const filePath = path.join(tmpDir, files[0]);
          resolve({ filePath, title });
        } else {
          reject(new Error("Gagal mendapatkan file output"));
        }
      } else {
        reject(new Error(`yt-dlp error code ${code}`));
      }
    });
  });
}

module.exports = {
  chatGpt,
  tiktokDl,
  facebookDl,
  instaDl,
  instaDownload,
  instaStory,
  ytMp4,
  ytMp3,
  allDl,
  quotedLyo,
  cekKhodam,
  simi,
  mediafireDownload,
  wallpaper,
  cariresep,
  detailresep,
  Steam,
  Steam_Detail,
  tiktokNoWM,
  instagramVideo,
  facebookVideo,
  searchWallpaper,
  searchRecipe,
  getRecipeDetail,
  searchSteamGame,
  getSteamGameDetail,
  jadwalSholatAPI,
  telegramStalk,
  tiktokStalk,
  genshinStalk,
  bk9Ai,
  spotifyDl,
  NvlGroup,
  yanzGpt,
  youSearch,
  gptLogic,
  savetube,
  bytesToSize,
  mlstalk,
  hitamkan,
  getWeatherData,
  fetchWaifuNeko,
  toAudio,
  toPTT,
  toVideo,
  tiktokSearchScrape,
  getFlvtoMp4,
  downloadYtMp4WithYtdlp,
};
