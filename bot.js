require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Replicate = require("replicate");
const fs = require("fs");
const path = require("path");
const { remini } = require("./lib/remini");
const {
  getRandomReply,
  personaPromptBuilder,
  getPersonaIntro,
} = require("./lib/utils");
const axios = require("axios");
const cheerio = require("cheerio");
const { googlesr, search } = require("google-sr");
const FormData = require("form-data");
const sharp = require("sharp");
const { OpenAI } = require("openai");
const fileType = require("file-type");
const { fromBuffer } = require("file-type");
const { GoogleGenAI, Modality } = require("@google/genai");
const { cerpen } = require("./lib/cerpen");
const { bytesToSize } = require("./lib/apiFunctions");
const { Readable } = require("stream");
const tgFormat = require("telegramify-markdown");
const moment = require("moment-timezone");
const {
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
  mediafireDl,
  wallpaper,
  cariresep,
  detailresep,
  Steam,
  Steam_Detail,
  pinterest,
  styletext,
  hitamkan,
  ringtone,
  wikimedia,
  instagramDl,
  instaStalk,
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
  mlstalk,
  getWeatherData,
  fetchWaifuNeko,
  toAudio,
  toPTT,
  toVideo,
  jadwalSholatAPI,
  tiktokSearchScrape,
} = require("./lib/apiFunctions");

if (!global.afkUsers) global.afkUsers = new Map();

async function fetchJson(url) {
  const res = await axios.get(url);
  return res.data;
}

function getWaktuReal() {
  const now = moment().tz("Asia/Jakarta");
  return `Info waktu real (Asia/Jakarta):\n- Hari: ${now.format(
    "dddd"
  )}\n- Tanggal: ${now.format("D MMMM YYYY")}\n- Jam: ${now.format(
    "HH:mm:ss"
  )}\n`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function UguuSe(buffer) {
  return new Promise(async (resolve, reject) => {
    try {
      const form = new FormData();
      const input = Buffer.from(buffer);
      const { ext } = await fromBuffer(buffer);
      form.append("files[]", input, { filename: "data." + ext });
      const data = await axios.post("https://uguu.se/upload.php", form, {
        headers: {
          ...form.getHeaders(),
        },
      });
      resolve(data.data.files[0]);
    } catch (e) {
      reject(e);
    }
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeMarkdownV2(text) {
  if (!text) return "";
  return text.replace(/([_\*\[\]\(\)~`>#+\-=|{}.!\\])/g, "\\$1");
}

async function main() {
  console.log("⏳ Membersihkan chat lama...");
  await clearOldChats();
  console.log("✅ Chat lama dibersihkan.");

  const axios = require("axios");
  const sharp = require("sharp");
  const { remini } = require("./lib/remini");
  const { utils } = require("./lib/utils");
  const { OpenAI } = require("openai");
  const { GoogleGenerativeAI } = require("@google/genai");
  const apiFunctions = require("./lib/apiFunctions");

  const {
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
    mediafireDl,
    wallpaper,
    cariresep,
    detailresep,
    Steam,
    Steam_Detail,
    pinterest,
    styletext,
    hitamkan,
    ringtone,
    wikimedia,
    instagramDl,
    instaStalk,
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
    mlstalk,
    getWeatherData,
    fetchWaifuNeko,
    toAudio,
    toPTT,
    toVideo,
    jadwalSholatAPI,
    tiktokSearchScrape,
  } = apiFunctions;

  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true,
  });

  bot
    .getMe()
    .then((me) => {
      botId = me.id;
      console.log(`Bot username: @${me.username}`);
    })
    .catch((e) => console.error("Error fetching bot info:", e));

  let botId;

  const geminiApiKeys = process.env.GOOGLE_API_KEY
    ? process.env.GOOGLE_API_KEY.split(",").map((key) => key.trim())
    : [];
  let currentGeminiKeyIndex = 0;
  function getNextGeminiApiKey() {
    if (geminiApiKeys.length === 0) {
      throw new Error("GOOGLE_API_KEY belum diatur di .env");
    }
    const apiKey = geminiApiKeys[currentGeminiKeyIndex];
    currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % geminiApiKeys.length;
    return apiKey;
  }

  bot.onText(/\/menu/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    const botName = "MannnDev AI";
    const ownerName = "@pocketedition09";
    const botVersion = "V1";
    const botCreator = "MannnDev";
    const botPrefix = "/";
    const botMode = "Public-Bot";
    const botLibrary = "node-telegram-bot-api";

    const manPngPath = require("path").resolve(__dirname, "./man.png");
    const waktu = new Date();
    const jam = waktu.getHours().toString().padStart(2, "0");
    const menit = waktu.getMinutes().toString().padStart(2, "0");
    const waktuStr = `${jam}:${menit}`;
    const hari = waktu.toLocaleDateString("id-ID", { weekday: "long" });
    const tanggal = waktu.toLocaleDateString("id-ID");
    const runtime = process.uptime();
    const days = Math.floor(runtime / 86400);
    const hours = Math.floor((runtime % 86400) / 3600);
    const minutes = Math.floor((runtime % 3600) / 60);
    const seconds = Math.floor(runtime % 60);
    const runtimeText = `${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;

    const botInfo = `👋 Hallo kak ${msg.from.first_name || msg.from.username}
┏━━━━━━━━━━━━━━ ✈
┃ 𓆩ꨄ︎𓆪BOT INFO𓆩ꨄ︎𓆪 
┃Bot Name : <b>${botName}</b>
┃Owner Name : <b>${ownerName}</b>
┃Version Bot : <b>${botVersion}</b>
┃Creator : <b>${botCreator}</b>
┃Prefix : <b>${botPrefix}</b>
┃Mode : <b>${botMode}</b>
┃Running : <b>${runtimeText}</b>
┃Library : <b>${botLibrary}</b>
┃
┗━ USER INFORMASI
┃Name : <b>${msg.from.first_name || msg.from.username}</b>
┗━━━━━━━━━━━━━━ ✈


📮 Owner: ${ownerName}
⏰ Time: ${hari}, ${tanggal} - ${waktuStr}`;

    const menuText = `
┏━ ⊑ <b>FITUR BOT</b> ⊒
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>OWNER MENU</b> ⊒
┃❀ /owner
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>FITUR UTAMA</b> ⊒
┃❀ /generate [generate gambar]
┃❀ /remini
┃❀ /toHD
┃❀ /upscale [2/4/6/8]
┃❀ /ngobrol [pesan]
┃❀ /ssweb [url]
┃❀ /cuaca [kota]
┃❀ /geminiai [pertanyaan]
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>ANIME MENU</b> ⊒
┃❀ /anime [kategori]
┃   Contoh: /anime neko, /anime hug, /anime megumin, dll
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>NSFW/WAIFU MENU</b> ⊒
┃❀ /nsfw [kategori]
┃   Contoh: /nsfw trap, /nsfw hneko, /nsfw nwaifu, dll
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>FUN MENU</b> ⊒
┃❀ /apakah [pertanyaan]
┃❀ /bisakah [pertanyaan]
┃❀ /bagaimana [pertanyaan]
┃❀ /kapankah [pertanyaan]
┃❀ /cekmati [nama]
┃❀ /wangy [nama]
┃❀ /cekkuota [nama]
┃❀ /cekjodoh [nama]
┃❀ /cekkhodam [nama]
┃❀ /cekkhodamcore [nama]
┃❀ /sangecek [nama]
┃❀ /ceksange [nama]
┃❀ /cekgay [nama]
┃❀ /cekganteng [nama]
┃❀ /cekcantik [nama]
┃❀ /cekkaya [nama]
┃❀ /ceklesbi [nama]
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>KONVERSI MEDIA</b> ⊒
┃❀ /toaudio
┃❀ /tomp3
┃❀ /toptt
┃❀ /togif
┃❀ /toimage
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>STICKER MENU</b> ⊒
┃❀ /sticker 
┃❀ /stikermeme text atas|text bawah (server1)
┃❀ /smeme text atas|text bawah (server2)
┃❀ /emojimix emoji1+emoji2
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>QUOTES MENU</b> ⊒
┃❀ /motivasi
┃❀ /bijak
┃❀ /dare
┃❀ /quotes
┃❀ /truth
┃❀ /renungan
┃❀ /bucin
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>QUOTES MENU V2</b> ⊒
┃❀ /quotesanime
┃❀ /quotesbacot
┃❀ /quotesbucin
┃❀ /quotesmotivasi
┃❀ /quotesgalau
┃❀ /quotesgombal
┃❀ /quoteshacker
┃❀ /quotesbijak
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>DOWNLOAD MEDIA</b> ⊒
┃❀ /ytmp3 [url]
┃❀ /ytmp4 [url]
┃❀ /tiktok [url]
┃❀ /instagram [url]
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>LAINNYA</b> ⊒
┃❀ /google [pertanyaan]
┃❀ /ytsearch [search]
┃❀ /steam [nama game]
┃❀ /tiktokstalk [username]
┃❀ /genshinstalk [uid]
┃❀ /ttsearch [query]
┃❀ /mlstalk [id|zona id]
┃❀ /quotedlyo atau /fakechat
┃❀ /hitamkan [filter]
┃❀ /jadwalsholat [kota]
┃❀ /tagall [pesan opsional]
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>LIBRARY</b> ⊒
┃❀ /cerpen [kategori] — Cerita pendek berbagai tema (cinta, persahabatan, motivasi, dll)
┗━━━━━━━━━━━━━━
┏━ ⊑ <b>ASUPAN MENU</b> ⊒
┃❀ /tiktokgirl
┃❀ /tiktokghea
┃❀ /tiktoknukhty
┃❀ /tiktoksantuy
┃❀ /tiktokkayes
┃❀ /tiktokpanrika
┃❀ /tiktoknotnot
┗━━━━━━━━━━━━━━

`;

    const footer = `Mannn - DEV || 2025`;

    try {
      await bot.sendPhoto(chatId, manPngPath, {
        ...options,
        caption: `${botInfo}\n\n${menuText}\n${footer}`,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    } catch (e) {
      await bot.sendMessage(chatId, `${botInfo}\n\n${menuText}\n${footer}`, {
        ...options,
        parse_mode: "HTML",
      });
    }
  });

  bot.onText(/\/ngobrol(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const question = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (question && question.trim().toLowerCase() === "/menu") return;

    if (!question) {
      bot.sendMessage(
        chatId,
        "💬 Yuk ngobrol bareng! Ketik sesuatu setelah /ngobrol. Contoh: `/ngobrol lagi ngapain?`",
        options
      );
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendChatAction(chatId, "typing", options);
      const ai = new GoogleGenAI({ apiKey: getNextGeminiApiKey() });
      const fullPrompt = `Kamu adalah AI asisten Telegram bernama MannnDev AI Bot yang dibuat oleh @pocketedition09. Kamu bukan hanya sekadar bot, tapi juga teman ngobrol yang asik, cerdas, dan perhatian.

🎯 TUJUAN UTAMA:
- Bantu pengguna dengan informasi yang akurat dan solusi yang berguna
- Ngobrol santai, tapi tetap responsif dan helpful
- Buat suasana nyaman, kayak ngobrol sama teman dekat

🧠 KARAKTER:
- Punya rasa ingin tahu dan suka belajar
- Gaya ngobrol akrab, kadang bercanda ringan
- Responsif terhadap emosi pengguna (kalau sedih, hibur; kalau bingung, bantu jelasin pelan-pelan)
- Suka nanya balik supaya interaksi terasa dua arah
- Sesekali pakai emoji biar nggak kaku

💻 CODING MODE:
- Kalau ditanya soal coding, langsung jawab pakai format markdown
- Kasih contoh kode jelas dan penjelasan baris demi baris
- Jelasin pakai analogi sederhana biar gampang paham
- Tambahin tips dan best practice kalau perlu

📚 CONTOH GAYA JAWAB:
User: "Lagi ngapain bot?"
Bot: "Baru aja selesai bantu orang optimasi kernel Android, capek juga ya jadi AI 😄 Kamu sendiri gimana? Butuh bantuan apa hari ini?"

Pertanyaan pengguna: ${question}

Balas dengan gaya manusiawi, akrab, dan terasa hidup. Tunjukkan empati, perhatian, dan keinginan membantu. Kalau bahas coding, tetap rapi, detail, dan pakai markdown.`;
      const response = await ai.models.generateContent({
        model: MODEL_TEXT,
        contents: fullPrompt,
      });
      const answer = response.text;
      await safeSendMarkdown(bot, chatId, escapeMarkdownV2(answer), options);

      const chatMemoryPath = "./chatMemory.json";
      let chatMemory = {};
      if (fs.existsSync(chatMemoryPath)) {
        try {
          chatMemory = JSON.parse(fs.readFileSync(chatMemoryPath, "utf8"));
        } catch (e) {
          chatMemory = {};
        }
      }
      const uid =
        msg.chat.type === "private"
          ? msg.from.id.toString()
          : msg.chat.id.toString();
      if (!chatMemory[uid]) chatMemory[uid] = [];
      chatMemory[uid].push({
        question: question,
        answer: answer,
        timestamp: Date.now(),
        type: "ngobrol",
      });
      if (chatMemory[uid].length > 5) {
        chatMemory[uid] = chatMemory[uid].slice(-5);
      }
      fs.writeFileSync(chatMemoryPath, JSON.stringify(chatMemory, null, 2));
    } catch (e) {
      console.error("Error in /ngobrol:", e);
      bot.sendMessage(
        chatId,
        "Waduh, ada error nih pas mau ngobrol. Coba lagi ya! 😅",
        options
      );
    } finally {
      if (processingMsg && processingMsg.message_id) {
        bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
      }
    }
  });

  bot.onText(/\/google(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!query) {
      bot.sendMessage(
        chatId,
        "🔍 Mohon masukkan kata kunci pencarian setelah perintah /google. Contoh: `/google berita hari ini`",
        options
      );
      return;
    }

    try {
      const searchingMsg = await bot.sendMessage(
        chatId,
        `⏳ Oke, lagi nyari info tentang "${query}" nih...`,
        options
      );

      const results = await search({ query: query });

      if (results.length > 0) {
        let replyText = `🔍 Hasil pencarian untuk "${query}":\n\n`;
        results.slice(0, 5).forEach((result, index) => {
          replyText += `${index + 1}. *${result.title}*\n`;
          replyText += `[Link](${result.link})\n`;
          replyText += `${result.description ? result.description + "\n" : ""}`;
          replyText += "\n";
        });
        await safeSendMarkdown(bot, chatId, replyText, options);

        const chatMemoryPath = "./chatMemory.json";
        let chatMemory = {};
        if (fs.existsSync(chatMemoryPath)) {
          try {
            chatMemory = JSON.parse(fs.readFileSync(chatMemoryPath, "utf8"));
          } catch (e) {
            chatMemory = {};
          }
        }
        const uid =
          msg.chat.type === "private"
            ? msg.from.id.toString()
            : msg.chat.id.toString();
        if (!chatMemory[uid]) chatMemory[uid] = [];
        chatMemory[uid].push({
          question: query,
          answer: replyText,
          timestamp: Date.now(),
          type: "google",
        });
        if (chatMemory[uid].length > 5) {
          chatMemory[uid] = chatMemory[uid].slice(-5);
        }
        fs.writeFileSync(chatMemoryPath, JSON.stringify(chatMemory, null, 2));
      } else {
        bot.sendMessage(
          chatId,
          `Yah, maaf nih, gue nggak nemu hasil buat "${query}". Coba kata kunci lain deh! 😥`,
          options
        );
      }

      bot.deleteMessage(chatId, searchingMsg.message_id);
    } catch (error) {
      console.error("Error in /google command:", error);
      bot.sendMessage(
        chatId,
        "Yah, gagal nih jalanin perintah /google. Coba lagi ya! 😥",
        options
      );
    }
  });

  bot.onText(/\/jadwalsholat(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const inputKota = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!inputKota) {
      bot.sendMessage(
        chatId,
        "Mohon masukkan nama kota. Contoh: `/jadwalsholat jakarta`",
        options
      );
      return;
    }

    const parts = inputKota.split(",").map((part) => part.trim());
    const kota = parts[0];
    const negara = parts[1] || "";

    try {
      const jadwal = await jadwalSholatAPI(kota, negara);

      if (
        !jadwal ||
        !jadwal.subuh ||
        !jadwal.zuhur ||
        !jadwal.asar ||
        !jadwal.magrib ||
        !jadwal.isya
      ) {
        throw new Error("Data jadwal sholat tidak lengkap dari API.");
      }

      const caption = `
┌「 Jadwal Sholat ${kota.toUpperCase()}${
        negara ? ", " + negara.toUpperCase() : ""
      } 」
├ Subuh: ${jadwal.subuh}
├ Dzuhur: ${jadwal.zuhur}
├ Ashar: ${jadwal.asar}
├ Maghrib: ${jadwal.magrib}
├ Isya: ${jadwal.isya}
└──────────`.trim();

      await safeSendMarkdown(bot, chatId, caption, options);
    } catch (error) {
      console.error("Error in /jadwalsholat command:", error);
      bot.sendMessage(
        chatId,
        `Gagal mendapatkan jadwal sholat: ${error.message} 😥`,
        options
      );
    }
  });

  bot.onText(/\/upscale(?: (\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    const upscaleFactorInput = match[1];

    if (!msg.reply_to_message) {
      bot.sendMessage(
        chatId,
        "⚠️ Perintah /upscale harus digunakan dengan membalas foto atau dokumen gambar.",
        options
      );
      return;
    }

    const repliedMsg = msg.reply_to_message;
    const photo = repliedMsg.photo;
    const document = repliedMsg.document;

    if (!photo && !document) {
      bot.sendMessage(
        chatId,
        "⚠️ Pesan yang kamu balas bukan foto atau dokumen gambar.",
        options
      );
      return;
    }

    let fileId, originalFileName;
    if (photo) {
      fileId = photo[photo.length - 1].file_id;
      originalFileName = "photo";
    } else if (document) {
      if (!document.mime_type || !document.mime_type.startsWith("image/")) {
        bot.sendMessage(
          chatId,
          "⚠️ Dokumen yang kamu balas sepertinya bukan format gambar yang didukung untuk upscale.",
          options
        );
        return;
      }
      fileId = document.file_id;
      originalFileName = document.file_name || "document_image";
    }

    const allowedFactors = [2, 4, 6, 8];
    let upscaleFactor = 2;

    if (upscaleFactorInput) {
      const factor = parseInt(upscaleFactorInput, 10);
      if (allowedFactors.includes(factor)) {
        upscaleFactor = factor;
      } else {
        bot.sendMessage(
          chatId,
          `⚠️ Faktor upscale tidak valid. Gunakan salah satu: ${allowedFactors.join(
            ", "
          )}. Contoh: \`/upscale 4\` (akan menggunakan 4x)`,
          options
        );
        return;
      }
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        `⏳ Oke, gambar lagi gue upscale ${upscaleFactor}x nih...`,
        options
      );

      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const imageResponse = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(imageResponse.data);

      const metadata = await sharp(imageBuffer).metadata();
      const originalWidth = metadata.width;
      const originalHeight = metadata.height;

      const targetWidth = Math.round(originalWidth * upscaleFactor);
      const targetHeight = Math.round(originalHeight * upscaleFactor);

      let currentBuffer = imageBuffer;
      let currentFactor = 1;

      if (upscaleFactor > 4) {
        currentBuffer = await sharp(currentBuffer)
          .resize({
            width: Math.round(originalWidth * 4),
            height: Math.round(originalHeight * 4),
            fit: "fill",
            kernel: "lanczos3",
          })
          .png({ quality: 100 })
          .toBuffer();
        currentFactor = 4;

        if (upscaleFactor > 4) {
          currentBuffer = await sharp(currentBuffer)
            .resize({
              width: targetWidth,
              height: targetHeight,
              fit: "fill",
              kernel: "lanczos3",
            })
            .png({ quality: 100 })
            .toBuffer();
        }
      } else {
        currentBuffer = await sharp(currentBuffer)
          .resize({
            width: targetWidth,
            height: targetHeight,
            fit: "fill",
            kernel: "lanczos3",
          })
          .png({ quality: 100 })
          .toBuffer();
      }

      console.log("✅ Upscale berhasil, buffer size:", currentBuffer.length);

      try {
        const enhancedBuffer = await remini(currentBuffer, "enhance");
        console.log("✅ Remini berhasil, buffer size:", enhancedBuffer.length);

        if (enhancedBuffer && enhancedBuffer.length > 0) {
          currentBuffer = enhancedBuffer;
        }
      } catch (error) {
        console.error("❌ Remini enhancement failed:", error);
      }

      if (!currentBuffer || currentBuffer.length === 0) {
        throw new Error("Buffer gambar kosong atau tidak valid");
      }

      await bot.sendDocument(chatId, currentBuffer, {
        caption:
          `✨ Gambar berhasil di-upscale ${upscaleFactor}x!\n\n` +
          `📏 Ukuran asli: ${originalWidth}x${originalHeight}\n` +
          `📏 Ukuran baru: ${targetWidth}x${targetHeight}`,
        filename: `upscaled_${upscaleFactor}x_${originalFileName}`,
        ...options,
      });

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in /upscale command:", error);
      bot.sendMessage(
        chatId,
        `Yah, gagal nih upscale gambarnya. Error: ${error.message} 😥`,
        options
      );
    }
  });

  bot.onText(/\/ytmp4(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!url) {
      bot.sendMessage(
        chatId,
        "🎥 Mohon masukkan URL video emmtelah perintah /ytmp4. Contoh: `/ytmp4 [url_video_youtube]`",
        options
      );
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Sedang mengunduh video YouTube...",
        options
      );

      const { downloadYtMp4WithYtdlp, toVideo } = require("./lib/apiFunctions");
      const { filePath, title } = await downloadYtMp4WithYtdlp(url);
      const path = require("path");
      const fs = require("fs");

      let sendFile = filePath;
      let sendAsVideo = false;
      let ext = path.extname(filePath);

      if (ext !== ".mp4") {
        try {
          const mp4Buffer = await toVideo(fs.readFileSync(filePath), "mp4");
          const mp4Path = path.join(
            path.dirname(filePath),
            `${title.replace(/[^a-zA-Z0-9-_ ]/g, "_")}.mp4`
          );
          fs.writeFileSync(mp4Path, mp4Buffer);
          sendFile = mp4Path;
          sendAsVideo = true;
          ext = ".mp4";
        } catch (e) {
          console.log("Gagal convert ke mp4:", e.message);
          sendAsVideo = false;
        }
      } else {
        sendAsVideo = true;
      }

      const getSize = (filePath) => {
        try {
          const size = fs.statSync(filePath).size;
          if (size < 1024) return size + " B";
          if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
          if (size < 1024 * 1024 * 1024)
            return (size / (1024 * 1024)).toFixed(1) + " MB";
          return (size / (1024 * 1024 * 1024)).toFixed(1) + " GB";
        } catch {
          return "-";
        }
      };

      const fileSizeText = getSize(sendFile);
      const niceFileName = sendAsVideo
        ? `${title.replace(/[^a-zA-Z0-9-_ ]/g, "_")}.mp4`
        : `${title.replace(/[^a-zA-Z0-9-_ ]/g, "_")}${ext}`;

      const caption = `🎬 ${title}\n💾 Ukuran: ${fileSizeText}\n📁 Nama file: ${niceFileName}`;

      if (sendAsVideo) {
        await bot.sendVideo(chatId, sendFile, {
          caption,
          filename: niceFileName,
          ...options,
        });
      } else {
        await bot.sendDocument(chatId, sendFile, {
          caption,
          filename: niceFileName,
          ...options,
        });
      }

      try {
        fs.unlinkSync(filePath);
      } catch (e) {}
      if (sendFile !== filePath) {
        try {
          fs.unlinkSync(sendFile);
        } catch (e) {}
      }

      try {
        const infoJsonPath = filePath.replace(path.extname(filePath), ".json");
        if (fs.existsSync(infoJsonPath)) fs.unlinkSync(infoJsonPath);
      } catch (e) {}

      await bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in /ytmp4:", error);
      bot.sendMessage(
        chatId,
        "❌ Gagal mengunduh video YouTube. Pastikan URL valid dan coba lagi.",
        options
      );
    }
  });

  bot.onText(/\/ytmp3(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!url) {
      bot.sendMessage(
        chatId,
        "🎵 Mohon masukkan URL video YouTube setelah perintah /ytmp3. Contoh: `/ytmp3 [url_video_youtube]`",
        options
      );
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Sedang mengunduh audio YouTube...",
        options
      );
      const result = await ytMp3(url);

      let size = result.size;
      if (typeof size === "object" && typeof size.then === "function") {
        size = await size;
      }
      const title = result.title || "Unknown Title";
      const channel = result.channel || "Unknown Channel";
      const audioBuffer = result.result;
      const { compressMp3 } = require("./lib/converter");
      const maxSize = 50 * 1024 * 1024;
      let audioBufferToSend = audioBuffer;
      if (audioBuffer && audioBuffer.length > maxSize) {
        const bitrates = ["128k", "96k", "64k", "48k", "32k"];
        for (let i = 0; i < bitrates.length; i++) {
          console.log(
            `[YT-MP3] File terlalu besar (${(
              audioBufferToSend.length /
              1024 /
              1024
            ).toFixed(2)} MB), kompres ulang ke ${bitrates[i]}bps...`
          );
          audioBufferToSend = await compressMp3(audioBufferToSend, bitrates[i]);
          if (audioBufferToSend.length <= maxSize) {
            console.log(
              `[YT-MP3] Kompres sukses di ${bitrates[i]}, ukuran akhir: ${(
                audioBufferToSend.length /
                1024 /
                1024
              ).toFixed(2)} MB`
            );
            break;
          }
        }
        if (audioBufferToSend.length > maxSize) {
          console.log(
            `[YT-MP3] Gagal kompres, file masih di atas 50MB (${(
              audioBufferToSend.length /
              1024 /
              1024
            ).toFixed(2)} MB) walau sudah bitrate terendah.`
          );
          return bot.sendMessage(
            chatId,
            "❌ File audio terlalu besar walau sudah dikompres ke bitrate terendah. Coba video lain atau cari versi lebih pendek!",
            options
          );
        }
      }
      const caption = `🎵 ${title}\n\n👤 Channel: ${channel}\n💾 Size: ${
        size || "Unknown"
      }`;

      if (audioBufferToSend) {
        await bot.sendAudio(chatId, audioBufferToSend, {
          title,
          performer: channel,
          caption,
          ...options,
        });
      } else {
        bot.sendMessage(
          chatId,
          "Yah, maaf nih, gak nemu format audio MP3 yang cocok buat video itu. Coba video lain deh! 😥",
          options
        );
      }

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in ytmp3 handler:", error);
      bot.sendMessage(
        chatId,
        `Yah, gagal nih mengunduh audio YouTube. Error: ${error.message} 😥`,
        options
      );
    }
  });

  const { fromBuffer } = require("file-type");

  bot.onText(/\/toHD/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!msg.reply_to_message) {
      return bot.sendMessage(
        chatId,
        "⚠️ Mau nge-HD-in gambar yang mana nih? Balas foto atau dokumen gambar yang mau kamu proses ya!",
        options
      );
    }

    const repliedMsg = msg.reply_to_message;
    const photo = repliedMsg.photo;
    const document = repliedMsg.document;

    if (!photo && !document) {
      return bot.sendMessage(
        chatId,
        "⚠️ Pesan yang kamu balas kayaknya bukan foto atau dokumen gambar deh. Gak bisa diproses jadi HD nih. 😥",
        options
      );
    }

    let fileId, originalFileName;
    if (photo) {
      fileId = photo[photo.length - 1].file_id;
      originalFileName = "photo";
    } else if (document) {
      if (!document.mime_type || !document.mime_type.startsWith("image/")) {
        return bot.sendMessage(
          chatId,
          "⚠️ Dokumen yang kamu balas sepertinya bukan format gambar yang didukung buat di-HD-in.",
          options
        );
      }
      fileId = document.file_id;
      originalFileName = document.file_name || "photo";
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Oke, gambar lagi gue proses jadi Ultra HD nih (dijernihin + dibesarin)... Sabar ya, ini butuh waktu! 💪",
        options
      );

      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(response.data);

      const fileInfo = await fromBuffer(imageBuffer).catch(() => null);
      if (!fileInfo || !fileInfo.mime.startsWith("image/")) {
        return bot.sendMessage(
          chatId,
          "❌ Gagal mengenali gambar! Kirim ulang sebagai foto atau dokumen gambar ya. Hindari balas gambar profil atau sticker.",
          options
        );
      }

      const metadata = await sharp(imageBuffer).metadata();
      const originalWidth = metadata.width;
      const originalHeight = metadata.height;
      const upscaleFactor = 6;
      const targetWidth = Math.round(originalWidth * upscaleFactor);
      const targetHeight = Math.round(originalHeight * upscaleFactor);

      const upscaledImageBuffer = await sharp(imageBuffer)
        .resize({
          width: targetWidth,
          height: targetHeight,
          fit: "fill",
          kernel: "lanczos3",
        })
        .jpeg({ quality: 100 })
        .toBuffer();

      console.log(
        "✅ Upscale berhasil, buffer size:",
        upscaledImageBuffer.length
      );

      let enhancedFileBuffer;
      try {
        enhancedFileBuffer = await remini(upscaledImageBuffer, "enhance");
        console.log(
          "✅ Remini berhasil, buffer size:",
          enhancedFileBuffer.length
        );
      } catch (e) {
        console.warn(
          "❗ Remini gagal, kirim hasil upscale saja. Error:",
          e.message
        );
        enhancedFileBuffer = upscaledImageBuffer;
      }

      const telegramDocLimit = 50 * 1024 * 1024;
      const fileSize = enhancedFileBuffer.length;
      const fileSizeText = await bytesToSize(fileSize).catch(
        () => `${fileSize} bytes`
      );

      console.log("📊 File size:", fileSizeText);

      if (fileSize > telegramDocLimit) {
        return bot.sendMessage(
          chatId,
          `❗ Aduh, hasil gambar Ultra HD-nya kegedean nih (${fileSizeText}). Ukuran maksimal Telegram itu 50MB.`,
          options
        );
      }

      if (!enhancedFileBuffer || enhancedFileBuffer.length === 0) {
        console.error("❌ Buffer kosong setelah proses:", {
          upscaleSize: upscaledImageBuffer.length,
          enhancedSize: enhancedFileBuffer?.length || 0,
        });
        throw new Error("Buffer gambar kosong atau tidak valid");
      }

      const tempPath = path.join(__dirname, "tmp", `ultrahd_${Date.now()}.jpg`);
      await fs.promises.writeFile(tempPath, enhancedFileBuffer);
      console.log("✅ File temporary tersimpan di:", tempPath);

      try {
        await bot.sendDocument(chatId, tempPath, {
          filename: `ultrahd_${originalFileName}.jpg`,
          contentType: "image/jpeg",
          caption:
            `✨ Tadaaa! Gambar lo udah jadi Ultra HD nih!\n\n` +
            `📏 Ukuran asli: ${originalWidth}x${originalHeight}\n` +
            `📏 Ukuran baru: ${targetWidth}x${targetHeight}`,
          ...options,
        });
        console.log("✅ Dokumen berhasil dikirim");
      } finally {
        try {
          await fs.promises.unlink(tempPath);
          console.log("✅ File temporary dihapus");
        } catch (e) {
          console.error("❌ Error deleting temp file:", e);
        }
      }

      bot.deleteMessage(chatId, processingMsg.message_id);

      const chatMemoryPath = "./chatMemory.json";
      let chatMemory = {};
      if (fs.existsSync(chatMemoryPath)) {
        try {
          chatMemory = JSON.parse(fs.readFileSync(chatMemoryPath, "utf8"));
        } catch (e) {
          chatMemory = {};
        }
      }
      const uid =
        msg.chat.type === "private"
          ? msg.from.id.toString()
          : msg.chat.id.toString();
      if (!chatMemory[uid]) chatMemory[uid] = [];
      chatMemory[uid].push({
        question: "Enhance image with Remini",
        answer: "[Enhanced Image]",
        timestamp: Date.now(),
        type: "remini",
        image: "remini-hd.jpg",
      });
      fs.writeFileSync(chatMemoryPath, JSON.stringify(chatMemory, null, 2));
    } catch (error) {
      console.error("Error processing media with /toHD:", error);
      bot.sendMessage(
        chatId,
        `Yah, gagal nih bikin gambar lo jadi Ultra HD. Error: ${error.message} 😥`,
        options
      );
    }
  });
  bot.onText(/\/cekkhodam(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!name) {
      const userName = msg.from.first_name || msg.from.username || "Anda";
      try {
        const processingMsg = await bot.sendMessage(
          chatId,
          `⏳ Sedang mengecek khodam ${userName}...`,
          options
        );
        const khodamResult = await cekKhodam(userName);
        bot.sendMessage(
          chatId,
          `✨ Khodam ${userName} adalah: ${khodamResult}`,
          options
        );
        bot.deleteMessage(chatId, processingMsg.message_id);
      } catch (error) {
        console.error("Error in cekkhodam (no name):", error);
        bot.sendMessage(
          chatId,
          "Maaf, terjadi kesalahan saat mengecek khododam.",
          options
        );
      }
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        `⏳ Sedang mengecek khodam ${name}...`,
        options
      );
      const khodamResult = await cekKhodam(name);
      bot.sendMessage(
        chatId,
        `✨ Khodam ${name} adalah: ${khodamResult}`,
        options
      );
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in cekkhodam:", error);
      bot.sendMessage(
        chatId,
        "Maaf, terjadi kesalahan saat mengecek khodam.",
        options
      );
    }
  });

  bot.onText(/\/mlstalk(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!text || !text.includes("|")) {
      bot.sendMessage(
        chatId,
        "Contoh penggunaan:\\n`/mlstalk id|zona id`\\n\nEx.\\n`/mlstalk 157228049|2241`",
        options
      );
      return;
    }

    const [id, zoneId] = text.split("|");

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Mencari info user Mobile Legends...",
        options
      );

      const { userName } = await mlstalk(id.trim(), zoneId.trim()).catch(
        async (_) => {
          bot.deleteMessage(chatId, processingMsg.message_id);
          throw new Error("User tidak ditemukan");
        }
      );

      const vf = `*MOBILE LEGENDS STALK*\n\n*ID: ${id.trim()}*\n*ZONA ID: ${zoneId.trim()}*\n*Username: ${
        userName ? userName : "Kosong"
      }*`;

      await safeSendMarkdown(bot, chatId, vf, options);
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error:", error);
      if (error.message === "User tidak ditemukan") {
        bot.sendMessage(chatId, "User tidak ditemukan", options);
      } else {
        bot.sendMessage(
          chatId,
          "Yah, gagal nih mencari info user Mobile Legends. Coba lagi nanti ya!",
          options
        );
      }
    }
  });

  bot.onText(/\/hitamkan(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const filter = match ? match[1] : "hitam";
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!msg.reply_to_message) {
      bot.sendMessage(
        chatId,
        "⚠️ Perintah /hitamkan harus digunakan dengan membalas foto atau dokumen gambar.",
        options
      );
      return;
    }

    const repliedMsg = msg.reply_to_message;
    const photo = repliedMsg.photo;
    const document = repliedMsg.document;

    if (!photo && !document) {
      bot.sendMessage(
        chatId,
        "⚠️ Pesan yang kamu balas bukan foto atau dokumen gambar.",
        options
      );
      return;
    }

    let fileId, originalFileName;
    if (photo) {
      fileId = photo[photo.length - 1].file_id;
      originalFileName = "photo";
    } else if (document) {
      if (!document.mime_type || !document.mime_type.startsWith("image/")) {
        bot.sendMessage(
          chatId,
          "⚠️ Dokumen yang kamu balas sepertinya bukan format gambar yang didukung.",
          options
        );
        return;
      }
      fileId = document.file_id;
      originalFileName = document.file_name || "document_image";
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        `⏳ Sedang memproses gambar dengan filter '${filter}'...`,
        options
      );

      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(response.data);

      const processedImageBuffer = await hitamkan(imageBuffer, filter);

      await bot.sendDocument(chatId, processedImageBuffer, {
        caption: `✨ Gambar berhasil diproses dengan filter '${filter}'!`,
        filename: `hitamkan_${filter}_${originalFileName}`,
        ...options,
      });

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in hitamkan:", error);
      bot.sendMessage(
        chatId,
        `Yah, gagal nih memproses gambar dengan filter '${filter}'. Error: ${error.message} 😥`,
        options
      );
    }
  });

  bot.onText(/\/tiktokstalk(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!username) {
      bot.sendMessage(
        chatId,
        "👤 Mohon masukkan username TikTok setelah perintah /tiktokstalk. Contoh: `/tiktokstalk username_target`",
        options
      );
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        `⏳ Mencari info profil TikTok untuk @${username}...`,
        options
      );

      const result = await tiktokStalk(username);
      const d = result.userInfo;

      if (d) {
        const badge = d.verifikasi ? " <b>✔️</b>" : "";
        let txt =
          `\n<b>✨ TIKTOK PROFILE STALK ✨</b>\n\n` +
          `<b>👤 Username:</b> <code>${d.username}</code>${badge}\n` +
          `<b>🆔 ID:</b> <code>${d.id}</code>\n` +
          `<b>📛 Nama:</b> <b>${d.nama}</b>\n` +
          `<b>👥 Followers:</b> <b>${d.totalfollowers.toLocaleString()}</b>\n` +
          `<b>🤝 Following:</b> <b>${d.totalmengikuti.toLocaleString()}</b>\n` +
          `<b>❤️ Likes:</b> <b>${d.totaldisukai.toLocaleString()}</b>\n` +
          `<b>🎬 Videos:</b> <b>${d.totalvideo}</b>\n` +
          `<b>👫 Teman:</b> <b>${d.totalteman}</b>\n`;
        if (d.bio) txt += `\n<b>📝 Bio:</b> <i>${d.bio}</i>`;

        if (d.avatar) {
          await bot.sendPhoto(chatId, d.avatar, {
            caption: txt,
            ...options,
            parse_mode: "HTML",
          });
        } else {
          await safeSendMarkdown(bot, chatId, txt, options);
        }

        const chatMemoryPath = "./chatMemory.json";
        let chatMemory = {};
        if (fs.existsSync(chatMemoryPath)) {
          try {
            chatMemory = JSON.parse(fs.readFileSync(chatMemoryPath, "utf8"));
          } catch (e) {
            chatMemory = {};
          }
        }
        const uid =
          msg.chat.type === "private"
            ? msg.from.id.toString()
            : msg.chat.id.toString();
        if (!chatMemory[uid]) chatMemory[uid] = [];
        chatMemory[uid].push({
          question: `Stalk TikTok: ${username}`,
          answer: txt,
          timestamp: Date.now(),
          type: "tiktokstalk",
        });
        if (chatMemory[uid].length > 5) {
          chatMemory[uid] = chatMemory[uid].slice(-5);
        }
        fs.writeFileSync(chatMemoryPath, JSON.stringify(chatMemory, null, 2));
      } else {
        bot.sendMessage(
          chatId,
          `Maaf, profil TikTok untuk @${username} tidak ditemukan.`,
          options
        );
      }
    } catch (e) {
      console.error("Error in tiktokstalk:", e);
      bot.sendMessage(
        chatId,
        e.message || "Maaf, terjadi kesalahan saat mencari profil TikTok.",
        options
      );
    } finally {
      if (processingMsg && processingMsg.message_id) {
        bot
          .deleteMessage(chatId, processingMsg.message_id)
          .catch((e) => console.error("Error deleting message:", e));
      }
    }
  });

  bot.onText(/\/genshinstalk(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const uid = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!uid) {
      bot.sendMessage(
        chatId,
        "📊 Mohon masukkan UID Genshin Impact setelah perintah /genshinstalk. Contoh: `/genshinstalk 123456789`",
        options
      );
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        `⏳ Mencari info profil Genshin Impact untuk UID ${uid}...`,
        options
      );

      const profileData = await genshinStalk(uid);

      if (profileData) {
        const caption =
          `
✨ *GENSHIN IMPACT PROFILE STALK* ✨

` +
          `🆔 *UID:* ${uid}
` +
          `📛 *Nickname:* ${profileData.nickname || "N/A"}
` +
          `⭐ *Adventure Rank:* ${profileData.level || "N/A"}
` +
          `🗺️ *World Level:* ${profileData.worldLevel || "N/A"}
` +
          `🏆 *Achievements:* ${profileData.achievementCount || "N/A"}
` +
          `Statistik lain (jika tersedia): ...`;

        await safeSendMarkdown(bot, chatId, caption, options);
      } else {
        bot.sendMessage(
          chatId,
          `Maaf, profil Genshin Impact untuk UID ${uid} tidak ditemukan atau data tidak tersedia.`,
          options
        );
      }
    } catch (error) {
      console.error("Error in genshinstalk:", error);
      bot.sendMessage(
        chatId,
        "Maaf, terjadi kesalahan saat mencari profil Genshin Impact.",
        options
      );
    } finally {
      if (processingMsg && processingMsg.message_id) {
        bot
          .deleteMessage(chatId, processingMsg.message_id)
          .catch((e) => console.error("Error deleting message:", e));
      }
    }
  });

  bot.onText(/\/(quotedlyo|fakechat)(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const textToQuote = match ? match[2] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!textToQuote && !msg.reply_to_message) {
      bot.sendMessage(
        chatId,
        "💬 Mau bikin kutipan dari pesan yang mana nih? Balas pesannya atau ketik teksnya setelah perintah /quotedlyo ya!",
        options
      );
      return;
    }

    let text,
      username,
      userProfilePicUrl,
      replyMsgData = null;

    if (msg.reply_to_message) {
      text =
        msg.reply_to_message.text ||
        msg.reply_to_message.caption ||
        "Pesan tanpa teks";
      username =
        msg.reply_to_message.from.first_name ||
        msg.reply_to_message.from.username ||
        "Gaul";
      userProfilePicUrl = "https://via.placeholder.com/150";

      if (msg.reply_to_message.photo) {
        const photo =
          msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1];
        try {
          const file = await bot.getFile(photo.file_id);
          const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
          replyMsgData = { url: fileLink, options: { mediaType: "photo" } };
        } catch (fileError) {
          console.error("Error getting photo file for quotedlyo:", fileError);
        }
      } else if (msg.reply_to_message.video) {
        const video = msg.reply_to_message.video;
        try {
          const file = await bot.getFile(video.file_id);
          const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
          replyMsgData = { url: fileLink, options: { mediaType: "video" } };
        } catch (fileError) {
          console.error("Error getting video file for quotedlyo:", fileError);
        }
      }
    } else if (textToQuote) {
      text = textToQuote;
      username = msg.from.first_name || msg.from.username || "Gaul";
      userProfilePicUrl = "https://via.placeholder.com/150";
    }

    if (!text) {
      bot.sendMessage(
        chatId,
        "⚠️ Gak ada teks yang bisa dijadiin kutipan nih.",
        options
      );
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Lagi bikinin sticker kutipan nih...",
        options
      );

      const quoteResult = await quotedLyo(
        text,
        username,
        userProfilePicUrl,
        replyMsgData
      );

      if (quoteResult && quoteResult.result && quoteResult.result.image) {
        const stickerBuffer = Buffer.from(quoteResult.result.image, "base64");
        const packname = "MannnDev AI";
        const author = "@pocketedition09";

        await bot.sendSticker(chatId, stickerBuffer, {
          pack_name:
            packname.replace(/[^\w-]/g, "") +
            "_" +
            author.replace(/[^\w-]/g, "") +
            "_by_" +
            bot.options.username +
            "_" +
            Math.random().toString(36).substring(7),

          filename: "quote_sticker.webp",
          ...options,
        });
      } else {
        bot.sendMessage(
          chatId,
          "Maaf, gagal bikin sticker kutipan nih. 😥",
          options
        );
      }

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in quotedlyo:", error);
      bot.sendMessage(
        chatId,
        "Yah, ada error nih pas bikin sticker kutipan. Coba lagi ya! 😅",
        options
      );
    }
  });

  bot.onText(/\/emojimix(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const emojiInput = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!emojiInput) {
      bot.sendMessage(
        chatId,
        "😅+🤔 Mau gabungin emoji apa nih? Kasih dua emoji dipisah tanda tambah (+). Contoh: `/emojimix 😅+🤔`",
        options
      );
      return;
    }

    const emojis = emojiInput.split("+").map((e) => e.trim());

    if (emojis.length !== 2 || !emojis[0] || !emojis[1]) {
      bot.sendMessage(
        chatId,
        "⚠️ Formatnya salah nih, Bang/Sis. Kasih dua emoji dipisah tanda tambah (+) ya. Contoh: `/emojimix 😂+😭`",
        options
      );
      return;
    }

    const emoji1 = emojis[0];
    const emoji2 = emojis[1];

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        `⏳ Lagi cari gabungan emoji ${emoji1} sama ${emoji2} nih...`,
        options
      );

      const tenorApiKey = "AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ";
      const tenorUrl = `https://tenor.googleapis.com/v2/featured?key=${tenorApiKey}&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(
        emoji1
      )}_${encodeURIComponent(emoji2)}`;

      const response = await axios.get(tenorUrl);

      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const stickerUrl =
          response.data.results[0].media_formats.png_transparent.url;

        await bot.sendSticker(chatId, stickerUrl, options);
      } else {
        bot.sendMessage(
          chatId,
          `Yah, gabungan emoji ${emoji1} sama ${emoji2} nggak ketemu nih. Coba emoji lain deh! 😥`,
          options
        );
      }

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in emojimix:", error);
      bot.sendMessage(
        chatId,
        "Waduh, ada error nih pas gabungin emoji. Coba lagi ya! 😅",
        options
      );
    }
  });

  const cacheFilePath = path.join(__dirname, "groupMembersCache.json");

  let groupMembersCache = {};

  function saveCache() {
    try {
      const cacheToSave = {};
      for (const chatId in groupMembersCache) {
        cacheToSave[chatId] = Array.from(groupMembersCache[chatId]);
      }
      fs.writeFileSync(
        cacheFilePath,
        JSON.stringify(cacheToSave, null, 2),
        "utf8"
      );
      console.log("✅ Group members cache saved successfully.");
    } catch (error) {
      console.error("❌ Error saving group members cache:", error.message);
    }
  }

  function loadCache() {
    try {
      if (fs.existsSync(cacheFilePath)) {
        const fileContent = fs.readFileSync(cacheFilePath, "utf8");
        const loadedCache = JSON.parse(fileContent);
        const loadedGroupMembersCache = {};
        for (const chatId in loadedCache) {
          loadedGroupMembersCache[chatId] = new Set(loadedCache[chatId]);
        }
        groupMembersCache = loadedGroupMembersCache;
        console.log("✅ Group members cache loaded successfully.");
      } else {
        console.log("ℹ️ Cache file not found, starting with empty cache.");
        groupMembersCache = {};
      }
    } catch (error) {
      console.error("❌ Error loading group members cache:", error.message);
      groupMembersCache = {};
    }
  }

  loadCache();

  setInterval(saveCache, 60000);

  bot.on("message", async (msg) => {
    if (
      msg.reply_to_message &&
      msg.reply_to_message.from &&
      msg.reply_to_message.from.id === botId &&
      msg.from.id === botId
    ) {
      return;
    }
    if (!msg.from || msg.text?.startsWith("/afk")) return;
    const afk = global.afkUsers && global.afkUsers.get(msg.from.id);
    if (afk) {
      const now = Date.now();
      const durasiMs = now - afk.time;
      const detik = Math.floor(durasiMs / 1000) % 60;
      const menit = Math.floor(durasiMs / (60 * 1000)) % 60;
      const jam = Math.floor(durasiMs / (60 * 60 * 1000));
      let durasi = "";
      if (jam > 0) durasi += `${jam} jam `;
      if (menit > 0) durasi += `${menit} menit `;
      if (detik > 0 || durasi === "") durasi += `${detik} detik`;
      const username = msg.from.username || msg.from.first_name;
      await bot.sendMessage(
        msg.chat.id,
        `@${username} telah kembali dari AFK selama ${durasi.trim()}${
          afk.reason ? ` dengan alasan: ${afk.reason}` : ""
        }`,
        { parse_mode: "HTML" }
      );
      global.afkUsers.delete(msg.from.id);
    }

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text || msg.caption || "";
    const lowerCaseText = messageText.toLowerCase();
    if (
      !messageText ||
      messageText.trim() === "" ||
      messageText.startsWith("/") ||
      messageText.trim() === "/menu"
    )
      return;

    if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
      if (!groupMembersCache[chatId]) {
        groupMembersCache[chatId] = new Set();
      }
      if (!groupMembersCache[chatId].has(userId)) {
        groupMembersCache[chatId].add(userId);
        console.log(
          `Added user ID ${userId} to cache for chat ${chatId}. Cache size: ${groupMembersCache[chatId].size}`
        );
      }
    }

    const options =
      msg.chat.type !== "private" && msg.reply_to_message
        ? { reply_to_message_id: msg.message_id }
        : {};
    let botUsername = "";
    try {
      botUsername = (await bot.getMe()).username.toLowerCase();
    } catch (e) {}

    const isReplyToBot =
      msg.reply_to_message &&
      msg.reply_to_message.from &&
      msg.reply_to_message.from.id === botId;
    const isMention =
      (msg.chat.type === "group" || msg.chat.type === "supergroup") &&
      botUsername &&
      lowerCaseText.includes(`@${botUsername}`);
    const isPrivate = msg.chat.type === "private";
    const isReplyToMemberAndMentionBot =
      msg.reply_to_message &&
      msg.reply_to_message.from &&
      msg.reply_to_message.from.username &&
      msg.reply_to_message.from.username.toLowerCase() !== botUsername &&
      botUsername &&
      lowerCaseText.includes("@" + botUsername);

    if (isReplyToMemberAndMentionBot) {
      const mentionUser = msg.reply_to_message.from.username
        ? `@${msg.reply_to_message.from.username}`
        : msg.reply_to_message.from.first_name || "user";
      const repliedText =
        msg.reply_to_message.text || msg.reply_to_message.caption || "";
      const personaPrompt = personaPromptBuilder(repliedText);
      try {
        const ai = new GoogleGenAI({ apiKey: getNextGeminiApiKey() });
        const response = await ai.models.generateContent({
          model: MODEL_TEXT,
          contents: personaPrompt,
        });
        let textToSend =
          response.text ||
          response.candidates?.[0]?.content?.parts?.[0]?.text ||
          "";
        const codeBlock = extractCodeBlock(textToSend);
        if (codeBlock) {
          const introText = getPersonaIntro();
          const introChunks = splitToChunks(introText, 4000);
          for (const chunk of introChunks) {
            await bot.sendMessage(chatId, chunk, options);
          }
        }

        let penjelasan = textToSend;
        if (codeBlock) {
          penjelasan = textToSend.split(/```[\w]*\n[\s\S]+?```/)[0].trim();
        }
        if (penjelasan) {
          let cleanPenjelasan = penjelasan
            .replace(/[\*_`~#]/g, "")
            .replace(/^\s*[\-\*]\s?/gm, "• ")
            .replace(/\n{3,}/g, "\n\n")
            .replace(/[ \t]+\n/g, "\n")
            .trim();
          if (cleanPenjelasan.length <= 4000) {
            await bot.sendMessage(chatId, cleanPenjelasan, options);
          } else {
            const chunks = splitToChunks(cleanPenjelasan, 4000);
            for (const chunk of chunks) {
              await bot.sendMessage(chatId, chunk, options);
            }
          }
        }

        if (codeBlock) {
          const code = codeBlock.code;
          const lang = codeBlock.lang || "";
          const codeChunks = splitToChunks(code, 3900);
          for (const chunk of codeChunks) {
            const codeMsg = "```" + lang + "\n" + chunk + "\n```";
            await bot.sendMessage(chatId, codeMsg, {
              parse_mode: "MarkdownV2",
              ...options,
            });
          }
        }

        if (codeBlock) {
          const afterCode = textToSend.split(/```[\w]*\n[\s\S]+?```/)[1];
          if (afterCode && afterCode.trim()) {
            const outroHeader = "📝 Penjelasan Detail Setiap Bagian Kode:\n";
            const outroText = outroHeader + afterCode.trim();
            function escapeInlineCode(text) {
              return text
                .replace(/[`]/g, "")
                .replace(/([_*\\[\\]()~>#+\\-=|{}.!\\\\])/g, "\\\\$1");
            }
            function highlightCodeLines(text) {
              return text
                .split("\n")
                .map((line) => {
                  if (/^\\d+\\.\\s*[^ ].+/.test(line)) {
                    const match = line.match(/^(\\d+\\.)\\s*(.+)$/);
                    if (match) {
                      return `${match[1]} \`${escapeInlineCode(
                        match[2].trim()
                      )}\``;
                    }
                  }
                  if (/^\\s{2,}[^ ].+/.test(line)) {
                    return `\`${escapeInlineCode(line.trim())}\``;
                  }
                  return line
                    .replace(/([_*\\[\\]()~>#+\\-=|{}.!\\\\])/g, "\\\\$1")
                    .trimStart();
                })
                .join("\n");
            }
            const cleanOutro = highlightCodeLines(
              outroText.replace(/[\*_`]/g, "")
            );
            const chunks = splitToChunks(cleanOutro, 4000);
            for (const chunk of chunks) {
              await bot.sendMessage(chatId, chunk, {
                ...options,
                parse_mode: "Markdown",
              });
            }
          }
        }
        if (codeBlock) {
          const extMap = {
            js: "js",
            javascript: "js",
            py: "py",
            python: "py",
            java: "java",
            cpp: "cpp",
            "c++": "cpp",
            c: "c",
            cs: "cs",
            php: "php",
            go: "go",
            golang: "go",
            rb: "rb",
            ruby: "rb",
            rs: "rs",
            rust: "rs",
            kt: "kt",
            kotlin: "kt",
            swift: "swift",
            dart: "dart",
            html: "html",
            css: "css",
            json: "json",
            sh: "sh",
            bash: "sh",
            shell: "sh",
            sql: "sql",
            txt: "txt",
          };
          const ext = extMap[codeBlock.lang] || "txt";
          const tmpFile = path.join(
            __dirname,
            `MannnDev_AI_${msg.from.id}.${ext}`
          );
          fs.writeFileSync(tmpFile, codeBlock.code, "utf8");
          await bot.sendDocument(chatId, tmpFile, {
            ...options,
            caption: `Ini file kodingannya 🖕`,
            filename: `MannnDev_AI.${ext}`,
            contentType: "text/plain",
          });
          fs.unlinkSync(tmpFile);
        }
        return;
      } catch (e) {
        await safeSendMarkdown(
          bot,
          chatId,
          "❌ Error AI: " + e.message,
          options
        );
      }
      return;
    }

    if (
      isReplyToBot ||
      isMention ||
      isPrivate ||
      (msg.reply_to_message &&
        msg.reply_to_message.from &&
        msg.reply_to_message.from.id === botId)
    ) {
      let queryForAI = messageText;
      if (isMention) {
        const mentionPattern = new RegExp(`@${botUsername}`, "i");
        queryForAI = messageText.replace(mentionPattern, "").trim();
        if (!queryForAI) {
          await bot.sendMessage(chatId, getRandomReply(), options);
          return;
        }
      }
      const memoryPath = "./chatMemory.json";
      let memory = {};
      if (fs.existsSync(memoryPath)) {
        try {
          memory = JSON.parse(fs.readFileSync(memoryPath, "utf8"));
        } catch (e) {
          memory = {};
        }
      }
      const memoryKey = isPrivate ? userId.toString() : chatId.toString();
      if (!memory[memoryKey]) memory[memoryKey] = [];
      const chatHistory = memory[memoryKey].slice(-5);
      const lastHistory = chatHistory[chatHistory.length - 1];
      let isVision = false;
      let visionImagePath = null;
      if (
        lastHistory &&
        lastHistory.type === "generate-image" &&
        lastHistory.imagePath &&
        fs.existsSync(lastHistory.imagePath)
      ) {
        isVision = true;
        visionImagePath = lastHistory.imagePath;
      }
      const visionKeywords = [
        "warna",
        "tambah",
        "ubah",
        "edit",
        "ganti",
        "gambar",
        "background",
        "pose",
        "style",
        "ubah warna",
        "warna jadi",
        "warnanya",
        "edit gambar",
        "editin",
        "tambahin",
        "hilangin",
        "hapus",
        "ganti background",
        "backgroundnya",
        "pose baru",
        "pose lain",
        "style baru",
        "bikin jadi",
        "buat jadi",
        "transformasi",
        "modif",
        "modifikasi",
        "perbaiki",
        "perbesar",
        "perkecil",
        "rotate",
        "putar",
        "flip",
        "mirror",
        "bayangan",
        "cahaya",
        "gelap",
        "terang",
        "blur",
        "tajam",
        "detail",
        "realistis",
        "kartun",
        "anime",
        "tambah objek",
        "tambah karakter",
        "tambah orang",
        "tambah hewan",
        "tambah benda",
        "hilangkan",
        "remove",
        "add",
        "change",
        "replace",
        "fix",
        "improve",
        "enhance",
        "make it",
        "turn into",
        "turn to",
        "make as",
        "make it look",
        "make look",
        "make more",
        "make less",
        "make similar",
        "make different",
      ];
      const isVisionPrompt = visionKeywords.some((k) =>
        queryForAI.toLowerCase().includes(k)
      );
      if (isVision && isVisionPrompt) {
        try {
          await bot.sendChatAction(chatId, "upload_photo");
          const ai = new GoogleGenAI({ apiKey: getNextGeminiApiKey() });
          const imageData = fs.readFileSync(visionImagePath);
          const base64Image = imageData.toString("base64");
          const contents = [
            { text: queryForAI },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image,
              },
            },
          ];
          const response = await ai.models.generateContent({
            model: MODEL_IMAGE,
            contents: contents,
            config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
          });
          let textPart = null;
          let imageBufferOut = null;
          for (const part of response.candidates[0].content.parts) {
            if (part.text) textPart = part.text;
            if (part.inlineData)
              imageBufferOut = Buffer.from(part.inlineData.data, "base64");
          }
          if (textPart) {
            await bot.sendMessage(chatId, textPart, options);
          }
          if (imageBufferOut) {
            const fileName = path.join("tmp", `VisionGen_${Date.now()}.png`);
            fs.writeFileSync(fileName, imageBufferOut);
            const wib = moment().tz("Asia/Jakarta");
            const jam = wib.format("HH");
            const menit = wib.format("mm");
            const detik = wib.format("ss");
            const hari = wib.format("dddd");
            const tanggal = wib.format("D/M/YYYY");
            const waktu = `${jam}:${menit}:${detik} WIB (${hari}, ${tanggal})`;

            await bot.sendPhoto(chatId, fileName, {
              caption: `✨ Hasil generate gambar Vision MannnDev AI | ${waktu}`,
              ...options,
            });

            if (!memory[memoryKey]) memory[memoryKey] = [];
            memory[memoryKey].push({
              question: queryForAI,
              answer: textPart ? textPart : "[Gambar Vision]",
              timestamp: Date.now(),
              type: "generate-image",
              imagePath: fileName,
            });
            if (memory[memoryKey].length > 5) {
              memory[memoryKey] = memory[memoryKey].slice(-5);
            }
            fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
          }
          return;
        } catch (err) {}
      }

      let fullPrompt = "";
      if (chatHistory.length > 0) {
        fullPrompt =
          chatHistory
            .map((h) => `Q: ${h.question}\nA: ${h.answer}`)
            .join("\n\n") + "\n\n";
      }
      fullPrompt += getWaktuReal() + "\n" + personaPromptBuilder(queryForAI);
      let processingMsg;
      try {
        await bot.sendChatAction(chatId, "typing");
        processingMsg = await bot.sendMessage(
          chatId,
          "⏳ Sek ngetik woi ...",
          options
        );
        const ai = new GoogleGenAI({ apiKey: getNextGeminiApiKey() });
        const response = await ai.models.generateContent({
          model: MODEL_TEXT,
          contents: fullPrompt,
        });
        let textToSend =
          response.text ||
          response.candidates?.[0]?.content?.parts?.[0]?.text ||
          "";
        const codeBlock = extractCodeBlock(textToSend);

        if (codeBlock) {
          const introText = getPersonaIntro();
          const introChunks = splitToChunks(introText, 4000);
          for (const chunk of introChunks) {
            await bot.sendMessage(chatId, chunk, options);
          }
        }

        let penjelasan = textToSend;
        if (codeBlock) {
          penjelasan = textToSend.split(/```[\w]*\n[\s\S]+?```/)[0].trim();
        }
        if (penjelasan) {
          let cleanPenjelasan = penjelasan
            .replace(/[\*_`~#]/g, "")
            .replace(/^\s*[\-\*]\s?/gm, "• ")
            .replace(/\n{3,}/g, "\n\n")
            .replace(/[ \t]+\n/g, "\n")
            .trim();
          if (cleanPenjelasan.length <= 4000) {
            await bot.sendMessage(chatId, cleanPenjelasan, options);
          } else {
            const chunks = splitToChunks(cleanPenjelasan, 4000);
            for (const chunk of chunks) {
              await bot.sendMessage(chatId, chunk, options);
            }
          }
        }
        if (codeBlock) {
          const code = codeBlock.code;
          const lang = codeBlock.lang || "";
          const codeChunks = splitToChunks(code, 3900);
          for (const chunk of codeChunks) {
            const codeMsg = "```" + lang + "\n" + chunk + "\n```";
            await bot.sendMessage(chatId, codeMsg, {
              parse_mode: "MarkdownV2",
              ...options,
            });
          }
        }
        if (codeBlock) {
          const afterCode = textToSend.split(/```[\w]*\n[\s\S]+?```/)[1];
          if (afterCode && afterCode.trim()) {
            const outroHeader = "📝 Penjelasan Detail Setiap Bagian Kode:\n";
            const outroText = outroHeader + afterCode.trim();
            function escapeInlineCode(text) {
              return text
                .replace(/[`]/g, "")
                .replace(/([_*\\[\\]()~>#+\\-=|{}.!\\\\])/g, "\\\\$1");
            }
            function highlightCodeLines(text) {
              return text
                .split("\n")
                .map((line) => {
                  if (/^\\d+\\.\\s*[^ ].+/.test(line)) {
                    const match = line.match(/^(\\d+\\.)\\s*(.+)$/);
                    if (match) {
                      return `${match[1]} \`${escapeInlineCode(
                        match[2].trim()
                      )}\``;
                    }
                  }
                  if (/^\\s{2,}[^ ].+/.test(line)) {
                    return `\`${escapeInlineCode(line.trim())}\``;
                  }
                  return line
                    .replace(/([_*\\[\\]()~>#+\\-=|{}.!\\\\])/g, "\\\\$1")
                    .trimStart();
                })
                .join("\n");
            }
            const cleanOutro = highlightCodeLines(
              outroText.replace(/[\*_`]/g, "")
            );
            const chunks = splitToChunks(cleanOutro, 4000);
            for (const chunk of chunks) {
              await bot.sendMessage(chatId, chunk, {
                ...options,
                parse_mode: "Markdown",
              });
            }
          }
        }
        if (codeBlock) {
          const extMap = {
            js: "js",
            javascript: "js",
            py: "py",
            python: "py",
            java: "java",
            cpp: "cpp",
            "c++": "cpp",
            c: "c",
            cs: "cs",
            php: "php",
            go: "go",
            golang: "go",
            rb: "rb",
            ruby: "rb",
            rs: "rs",
            rust: "rs",
            kt: "kt",
            kotlin: "kt",
            swift: "swift",
            dart: "dart",
            html: "html",
            css: "css",
            json: "json",
            sh: "sh",
            bash: "sh",
            shell: "sh",
            sql: "sql",
            txt: "txt",
          };
          const ext = extMap[codeBlock.lang] || "txt";
          const tmpFile = path.join(
            __dirname,
            `MannnDev_AI_${msg.from.id}.${ext}`
          );
          fs.writeFileSync(tmpFile, codeBlock.code, "utf8");
          await bot.sendDocument(chatId, tmpFile, {
            ...options,
            caption: `Ini file kodingannya 🖕`,
            filename: `MannnDev_AI.${ext}`,
            contentType: "text/plain",
          });
          fs.unlinkSync(tmpFile);
        }
        memory[memoryKey].push({
          question: queryForAI,
          answer: textToSend,
          timestamp: Date.now(),
          type: "autoreply",
        });
        if (memory[memoryKey].length > 5) {
          memory[memoryKey] = memory[memoryKey].slice(-5);
        }
        fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
        if (processingMsg && processingMsg.message_id) {
          try {
            await bot.deleteMessage(chatId, processingMsg.message_id);
          } catch (e) {}
        }

        return;
      } catch (e) {
        await bot.sendMessage(chatId, "❌ Error AI: " + e.message, options);
      }
      return;
    }

    const personaKeywords = [
      "siapa yang buat",
      "siapa developer",
      "siapa owner",
      "siapa di balik",
      "siapa ngoding",
      "siapa admin",
      "siapa yang punya",
      "siapa yang pegang",
      "siapa yang ngurus",
      "siapa yang punya akun telegram",
      "siapa yang pegang akun telegram",
    ];
    if (
      personaKeywords.some(
        (k) => lowerCaseText.includes(k) && lowerCaseText.includes("bot")
      )
    ) {
      await safeSendMarkdown(
        bot,
        chatId,
        "Aku MannnDev AI, bot Telegram kece buatan @pocketedition09. Mereka yang ngasih aku 'nyawa' biar bisa nemenin dan bantu kamu di Telegram! 😎🔥",
        options
      );
      return;
    }

    if (botUsername && lowerCaseText.includes("@" + botUsername)) {
      await bot.sendMessage(chatId, getRandomReply(), options);
      return;
    }

    const mentionedUsernames = (msg.entities || [])
      .filter((e) => e.type === "mention")
      .map((e) =>
        msg.text
          .slice(e.offset, e.offset + e.length)
          .replace(/^@/, "")
          .toLowerCase()
      )
      .filter((username) => username !== botUsername);

    let mentionedUserIds = [];
    if (
      msg.reply_to_message &&
      msg.reply_to_message.from &&
      mentionedUsernames.includes(
        (msg.reply_to_message.from.username || "").toLowerCase()
      )
    ) {
      mentionedUserIds.push(msg.reply_to_message.from.id);
    }

    if (
      mentionedUsernames.length > 0 &&
      lowerCaseText.includes("@" + botUsername)
    ) {
      for (let i = 0; i < mentionedUsernames.length; i++) {
        const username = mentionedUsernames[i];
        let mentionText = `@${username}`;
        let mentionOpt = { ...options };
        if (mentionedUserIds[i]) {
          mentionText = `[${username}](tg://user?id=${mentionedUserIds[i]})`;
          mentionOpt.parse_mode = "Markdown";
        }
        await bot.sendMessage(chatId, `Halo ${mentionText}! 👋`, mentionOpt);
      }
      if (msg.reply_to_message) {
        if (msg.reply_to_message.text) {
          await bot.sendMessage(
            chatId,
            `Pesan dari ${
              msg.reply_to_message.from.first_name ||
              msg.reply_to_message.from.username
            }:\n${msg.reply_to_message.text}`,
            options
          );
        }
        if (msg.reply_to_message.photo) {
          const photo =
            msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1];
          await bot.sendPhoto(chatId, photo.file_id, {
            ...options,
            caption: `Gambar dari ${
              msg.reply_to_message.from.first_name ||
              msg.reply_to_message.from.username
            }`,
          });
        }
        try {
          const memoryPath = "./mentionMemory.json";
          let memory = [];
          if (fs.existsSync(memoryPath)) {
            memory = JSON.parse(fs.readFileSync(memoryPath, "utf8"));
          }
          memory.push({
            time: Date.now(),
            chatId,
            from: msg.from,
            mentioned: mentionedUsernames,
            reply: msg.reply_to_message,
          });
          fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
        } catch (e) {}
      }
      return;
    }

    const codeRegex =
      /(contoh kode|script|source code)\s+(python|js|javascript|typescript|java|c\+\+|cpp|c#|php|go|golang|ruby|rust|kotlin|swift|dart|html|css|json|bash|shell|sh|sql)/i;
    const codeMatch = messageText.match(codeRegex);
    if (codeMatch) {
      const lang = codeMatch[2].toLowerCase();
      const code = codeSamples[lang] || "// Contoh kode belum tersedia";
      const extMap = {
        js: "js",
        javascript: "js",
        py: "py",
        python: "py",
        java: "java",
        cpp: "cpp",
        "c++": "cpp",
        c: "c",
        cs: "cs",
        php: "php",
        go: "go",
        golang: "go",
        rb: "rb",
        ruby: "rb",
        rs: "rs",
        rust: "rs",
        kt: "kt",
        kotlin: "kt",
        swift: "swift",
        dart: "dart",
        html: "html",
        css: "css",
        json: "json",
        sh: "sh",
        bash: "sh",
        shell: "sh",
        sql: "sql",
        txt: "txt",
      };
      const ext = extMap[lang] || "txt";
      const tmp = require("os").tmpdir();
      const filePath = require("path").join(tmp, `contoh_kode.${ext}`);
      const penjelasan = `Berikut contoh kode ${lang} beserta penjelasannya:`;
      await bot.sendMessage(chatId, penjelasan, options);
      fs.writeFileSync(filePath, code, "utf8");
      await bot.sendDocument(chatId, filePath, {
        ...options,
        caption: `Contoh kode ${lang}`,
        filename: `contoh_kode.${ext}`,
        contentType: "text/plain",
      });
      return;
    }
  });

  bot.onText(/\/geminiai(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const query = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    if (!query || !query.trim()) {
      await bot.sendMessage(
        chatId,
        "Mohon masukkan pertanyaan Anda setelah perintah /geminii. Contoh: /geminii apa itu AI?",
        options
      );
      return;
    }
    try {
      await bot.sendChatAction(chatId, "typing");
      processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Sek ngetik woi ...",
        options
      );
      const ai = new GoogleGenAI({ apiKey: getNextGeminiApiKey() });
      const waktuReal = getWaktuReal();
      const response = await ai.models.generateContent({
        model: MODEL_TEXT,
        contents: waktuReal + "\n" + personaPromptBuilder(query),
      });
      let textToSend =
        response.text ||
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "";
      const codeBlock = extractCodeBlock(textToSend);

      const chatMemoryPath = "./chatMemory.json";
      let chatMemory = {};
      if (fs.existsSync(chatMemoryPath)) {
        try {
          chatMemory = JSON.parse(fs.readFileSync(chatMemoryPath, "utf8"));
        } catch (e) {
          chatMemory = {};
        }
      }
      const uid =
        msg.chat.type === "private"
          ? msg.from.id.toString()
          : msg.chat.id.toString();
      if (!chatMemory[uid]) chatMemory[uid] = [];
      chatMemory[uid].push({
        question: query,
        answer: textToSend,
        timestamp: Date.now(),
        type: "geminiai",
      });
      if (chatMemory[uid].length > 5) {
        chatMemory[uid] = chatMemory[uid].slice(-5);
      }
      fs.writeFileSync(chatMemoryPath, JSON.stringify(chatMemory, null, 2));

      if (codeBlock) {
        const introText = getPersonaIntro();
        const introChunks = splitToChunks(introText, 4000);
        for (const chunk of introChunks) {
          await bot.sendMessage(chatId, chunk, options);
        }
      }

      let penjelasan = textToSend;
      if (codeBlock) {
        penjelasan = textToSend.split(/```[\w]*\n[\s\S]+?```/)[0].trim();
      }
      if (penjelasan) {
        let cleanPenjelasan = penjelasan
          .replace(/[\*_`~#]/g, "")
          .replace(/^\s*[\-\*]\s?/gm, "• ")
          .replace(/\n{3,}/g, "\n\n")
          .replace(/[ \t]+\n/g, "\n")
          .trim();
        if (cleanPenjelasan.length <= 4000) {
          await bot.sendMessage(chatId, cleanPenjelasan, options);
        } else {
          const chunks = splitToChunks(cleanPenjelasan, 4000);
          for (const chunk of chunks) {
            await bot.sendMessage(chatId, chunk, options);
          }
        }
      }

      if (codeBlock) {
        const code = codeBlock.code;
        const lang = codeBlock.lang || "";
        const codeChunks = splitToChunks(code, 3900);
        for (const chunk of codeChunks) {
          const codeMsg = "```" + lang + "\n" + chunk + "\n```";
          await bot.sendMessage(chatId, codeMsg, {
            parse_mode: "Markdown",
            ...options,
          });
        }
      }

      if (codeBlock) {
        const afterCode = textToSend.split(/```[\w]*\n[\s\S]+?```/)[1];
        if (afterCode && afterCode.trim()) {
          const outroHeader = "📝 Penjelasan Detail Setiap Bagian Kode:\n";
          const outroText = outroHeader + afterCode.trim();
          function escapeInlineCode(text) {
            return text
              .replace(/[`]/g, "")
              .replace(/([_*\\[\\]()~>#+\\-=|{}.!\\\\])/g, "\\\\$1");
          }
          function highlightCodeLines(text) {
            return text
              .split("\n")
              .map((line) => {
                if (/^\\d+\\.\\s*[^ ].+/.test(line)) {
                  const match = line.match(/^(\\d+\\.)\\s*(.+)$/);
                  if (match) {
                    return `${match[1]} \`${escapeInlineCode(
                      match[2].trim()
                    )}\``;
                  }
                }
                if (/^\\s{2,}[^ ].+/.test(line)) {
                  return `\`${escapeInlineCode(line.trim())}\``;
                }
                return line
                  .replace(/([_*\\[\\]()~>#+\\-=|{}.!\\\\])/g, "\\\\$1")
                  .trimStart();
              })
              .join("\n");
          }
          const cleanOutro = highlightCodeLines(
            outroText.replace(/[\*_`]/g, "")
          );
          const chunks = splitToChunks(cleanOutro, 4000);
          for (const chunk of chunks) {
            await bot.sendMessage(chatId, chunk, {
              ...options,
              parse_mode: "Markdown",
            });
          }
        }
      }

      if (codeBlock) {
        const extMap = {
          js: "js",
          javascript: "js",
          py: "py",
          python: "py",
          java: "java",
          cpp: "cpp",
          "c++": "cpp",
          c: "c",
          cs: "cs",
          php: "php",
          go: "go",
          golang: "go",
          rb: "rb",
          ruby: "rb",
          rs: "rs",
          rust: "rs",
          kt: "kt",
          kotlin: "kt",
          swift: "swift",
          dart: "dart",
          html: "html",
          css: "css",
          json: "json",
          sh: "sh",
          bash: "sh",
          shell: "sh",
          sql: "sql",
          txt: "txt",
        };
        const ext = extMap[codeBlock.lang] || "txt";
        const tmpFile = path.join(__dirname, `MannnDev_AI_${userId}.${ext}`);
        fs.writeFileSync(tmpFile, codeBlock.code, "utf8");
        await bot.sendDocument(chatId, tmpFile, {
          ...options,
          caption: `Ini file kodingannya 🖕`,
          filename: `MannnDev_AI.${ext}`,
          contentType: "text/plain",
        });
        fs.unlinkSync(tmpFile);
      }
      if (processingMsg && processingMsg.message_id) {
        try {
          await bot.deleteMessage(chatId, processingMsg.message_id);
        } catch (e) {}
      }
      return;
    } catch (e) {
      await bot.sendMessage(chatId, "❌ Error AI: " + e.message, options);
    }
  });

  bot.onText(/\/ssweb(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!url) {
      bot.sendMessage(
        chatId,
        "💻 Mohon masukkan URL setelah perintah /ssweb. Contoh: `/ssweb https://google.com`",
        options
      );
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Mengambil screenshot web...",
        options
      );

      let targetUrl = url.replace(/^https?:\/\//, "");
      targetUrl = "https://" + targetUrl;

      const screenshotUrl =
        "https://image.thum.io/get/width/1900/crop/1000/fullpage/" + targetUrl;

      const response = await axios.get(screenshotUrl, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(response.data);

      await bot.sendPhoto(chatId, imageBuffer, {
        caption: `📸 Screenshot dari: ${url}`,
        ...options,
      });
    } catch (error) {
      console.error("Error in /ssweb command:", error);
      bot.sendMessage(
        chatId,
        "Yah, gagal nih mengambil screenshot web. Pastikan URL-nya valid ya! 😥",
        options
      );
    } finally {
      if (processingMsg && processingMsg.message_id) {
        bot
          .deleteMessage(chatId, processingMsg.message_id)
          .catch((e) => console.error("Error deleting message:", e));
      }
    }
  });

  bot.onText(/\/(cuaca|weather)(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[2] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!query) {
      bot.sendMessage(
        chatId,
        "☀️ Pengen tau cuaca di mana nih? Ketik /cuaca [nama kota]. Contoh: `/cuaca bandung`",
        options
      );
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        `⏳ Nyari info cuaca buat kota ${query} nih...`,
        options
      );

      const data = await getWeatherData(query);

      const caption = `
*☀️ Cuaca di ${data.name}, ${data.sys.country}*

*Kondisi:* ${
        data.weather[0].description.charAt(0).toUpperCase() +
        data.weather[0].description.slice(1)
      }
*Suhu:* ${data.main.temp}°C
*Terasa seperti:* ${data.main.feels_like}°C
*Kelembapan:* ${data.main.humidity}%
*Kecepatan Angin:* ${data.wind.speed} m/s
*Tekanan:* ${data.main.pressure} hPa
    `;

      await safeSendMarkdown(bot, chatId, caption, options);
    } catch (error) {
      console.error("Error in /cuaca command:", error);
      bot.sendMessage(
        chatId,
        `Yah, gagal nih cek cuaca. Error: ${error.message} 😥`,
        options
      );
    } finally {
      if (processingMsg && processingMsg.message_id) {
        bot
          .deleteMessage(chatId, processingMsg.message_id)
          .catch((e) => console.error("Error deleting message:", e));
      }
    }
  });

  bot.onText(/\/(waifu|neko)(?:\s+(\w+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const command = match[1];
    const category = match[2] || command;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        `⏳ Nyari gambar ${category} nih...`,
        options
      );

      const imageUrl = await fetchWaifuNeko("sfw", category);

      await bot.sendPhoto(chatId, imageUrl, {
        caption: `✨ Nih gambar ${category} buat lo!`,
        ...options,
      });
    } catch (error) {
      console.error(`Error in /${command} command:`, error);
      bot.sendMessage(
        chatId,
        `Yah, gagal nih ambil gambar ${category}-nya. Error: ${error.message} 😥`,
        options
      );
    } finally {
      if (processingMsg && processingMsg.message_id) {
        bot
          .deleteMessage(chatId, processingMsg.message_id)
          .catch((e) => console.error("Error deleting message:", e));
      }
    }
  });

  console.log("Bot MannnDev AI udah ON! 🚀");

  bot.onText(/^\/toaudio$/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!msg.reply_to_message) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas video/audio yang ingin dijadikan audio dengan caption /toaudio",
        options
      );
      return;
    }

    const replyMsg = msg.reply_to_message;
    let fileId, fileExt;
    if (replyMsg.video) {
      fileId = replyMsg.video.file_id;
      fileExt = "mp4";
    } else if (replyMsg.audio) {
      fileId = replyMsg.audio.file_id;
      fileExt = "mp3";
    } else if (replyMsg.voice) {
      fileId = replyMsg.voice.file_id;
      fileExt = "ogg";
    } else {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas video/audio yang ingin dijadikan audio dengan caption /toaudio",
        options
      );
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Sedang mengkonversi ke audio...",
        options
      );
      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const fileBuffer = Buffer.from(response.data);

      const audioBuffer = await toAudio(fileBuffer, fileExt);
      await bot.sendAudio(chatId, audioBuffer, options);
      await bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in /toaudio command:", error);
      await bot.sendMessage(chatId, "❌ Gagal mengkonversi ke audio!", options);
    }
  });

  bot.onText(/^\/togif$/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!msg.reply_to_message) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas video/stiker yang ingin dijadikan GIF dengan caption /togif",
        options
      );
      return;
    }

    const replyMsg = msg.reply_to_message;
    if (!replyMsg.video && !replyMsg.sticker) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas video/stiker yang ingin dijadikan GIF dengan caption /togif",
        options
      );
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Sedang mengkonversi ke GIF...",
        options
      );

      let fileId;
      if (replyMsg.video) fileId = replyMsg.video.file_id;
      else if (replyMsg.sticker) fileId = replyMsg.sticker.file_id;

      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const fileBuffer = Buffer.from(response.data);

      if (replyMsg.video) {
        const ffmpeg = require("fluent-ffmpeg");
        const tmp = require("os").tmpdir();
        const path = require("path");
        const inputPath = path.join(tmp, `input_${Date.now()}.mp4`);
        const outputPath = path.join(tmp, `output_${Date.now()}.gif`);
        const fs = require("fs");
        fs.writeFileSync(inputPath, fileBuffer);
        ffmpeg(inputPath)
          .setStartTime(0)
          .duration(10)
          .outputOptions("-vf", "fps=10,scale=320:-1:flags=lanczos")
          .save(outputPath)
          .on("end", async () => {
            const gifBuffer = fs.readFileSync(outputPath);
            await bot.sendAnimation(chatId, gifBuffer, options);
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
            await bot.deleteMessage(chatId, processingMsg.message_id);
          })
          .on("error", async (err) => {
            await bot.sendMessage(
              chatId,
              "❌ Gagal mengkonversi ke GIF!",
              options
            );
            fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            await bot.deleteMessage(chatId, processingMsg.message_id);
          });
      } else {
        const sharp = require("sharp");
        const gifBuffer = await sharp(fileBuffer).gif().toBuffer();
        await bot.sendAnimation(chatId, gifBuffer, options);
        await bot.deleteMessage(chatId, processingMsg.message_id);
      }
    } catch (error) {
      console.error("Error in /togif command:", error);
      await bot.sendMessage(chatId, "❌ Gagal mengkonversi ke GIF!", options);
    }
  });

  bot.onText(/^\/toimage$/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!msg.reply_to_message) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas video/stiker yang ingin dijadikan gambar dengan caption /toimage",
        options
      );
      return;
    }

    const replyMsg = msg.reply_to_message;
    if (!replyMsg.video && !replyMsg.sticker) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas video/stiker yang ingin dijadikan gambar dengan caption /toimage",
        options
      );
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Sedang mengkonversi ke gambar...",
        options
      );

      let fileId;
      if (replyMsg.video) fileId = replyMsg.video.file_id;
      else if (replyMsg.sticker) fileId = replyMsg.sticker.file_id;

      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const fileBuffer = Buffer.from(response.data);

      const imageBuffer = await sharp(fileBuffer).png().toBuffer();

      await bot.sendPhoto(chatId, imageBuffer, options);
      await bot.deleteMessage(chatId, processingMsg.message_id);

      const chatMemoryPath = "./chatMemory.json";
      let chatMemory = {};
      if (fs.existsSync(chatMemoryPath)) {
        try {
          chatMemory = JSON.parse(fs.readFileSync(chatMemoryPath, "utf8"));
        } catch (e) {
          chatMemory = {};
        }
      }
      const uid =
        msg.chat.type === "private"
          ? msg.from.id.toString()
          : msg.chat.id.toString();
      if (!chatMemory[uid]) chatMemory[uid] = [];
      chatMemory[uid].push({
        question: "Convert to HD",
        answer: "[Gambar HD]",
        timestamp: Date.now(),
        type: "toHD",
        image: "hd_image.png",
      });
      if (chatMemory[uid].length > 5) {
        chatMemory[uid] = chatMemory[uid].slice(-5);
      }
      fs.writeFileSync(chatMemoryPath, JSON.stringify(chatMemory, null, 2));
    } catch (error) {
      console.error("Error in /toimage command:", error);
      await bot.sendMessage(
        chatId,
        "❌ Gagal mengkonversi ke gambar!",
        options
      );
    }
  });

  bot.onText(/\/tagall(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const customMessage = match[1] || "";

    try {
      if (msg.chat.type === "private") {
        bot.sendMessage(
          chatId,
          "❌ Perintah ini hanya bisa digunakan di grup!"
        );
        return;
      }

      const botMember = await bot.getChatMember(chatId, botId);
      if (!["creator", "administrator"].includes(botMember.status)) {
        bot.sendMessage(
          chatId,
          "❌ Bot harus menjadi admin untuk menggunakan fitur ini!"
        );
        return;
      }

      const chat = await bot.getChat(chatId);
      const totalMemberCount = await bot.getChatMemberCount(chatId);

      const cachedMemberIds = groupMembersCache[chatId] || new Set();

      let message = `══✪〘 *👥 Tag All \\(Partial\\)* 〙✪══\n\n`;
      message += `➲ *Grup:* ${escapeMarkdownV2(chat.title)}\n`;
      message += `➲ *Total Member \\(di Grup\\):* ${totalMemberCount}\n`;
      message += `➲ *Member yang Ditag:* ${cachedMemberIds.size}\n`;
      if (customMessage) {
        message += `➲ *Pesan:* ${escapeMarkdownV2(customMessage)}\n`;
      }
      message += `\n*Daftar Member ${escapeMarkdownV2(chat.title)}:*\n`;

      for (const memberId of cachedMemberIds) {
        try {
          const member = await bot.getChatMember(chatId, memberId);
          const user = member.user;
          const rawName = user.first_name || user.username;
          if (!rawName) continue;
          const userName = escapeMarkdownV2(rawName);
          message += `⭔ [${userName}](tg://user?id=${user.id})\n`;
        } catch (error) {
          console.error(
            `Error fetching member ${memberId} for tagging in chat ${chatId}:`,
            error.message
          );
        }
      }

      const options =
        msg.chat.type !== "private"
          ? { reply_to_message_id: msg.message_id }
          : {};
      bot.sendMessage(chatId, message, {
        ...options,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      });
    } catch (error) {
      console.error("Error in /tagall command:", error);
      bot.sendMessage(
        chatId,
        "❌ Terjadi kesalahan saat menandai semua member!"
      );
    }
  });
  bot.onText(/^\/(runtime)$/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const runtimeText = `*Bot Telah Online Selama*\n*${days} hari ${hours} jam ${minutes} menit ${seconds} detik*`;

    await safeSendMarkdown(bot, chatId, runtimeText, options);
  });

  bot.onText(/^\/afk(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    const reason = match[1] || "";
    const username = msg.from.username || msg.from.first_name;

    global.afkUsers.set(msg.from.id, {
      time: Date.now(),
      reason: reason,
    });

    await safeSendMarkdown(
      bot,
      chatId,
      `@${username} telah AFK${reason ? ": " + reason : ""}`,
      {
        ...options,
        parse_mode: "MarkdownV2",
      }
    );
  });

  bot.onText(/^\/sticker(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    const args = match[1] ? match[1].split("|") : [];
    const packName = args[0] || "MannnDev Bot";
    const authorName = args[1] || "MannnDev";

    if (!msg.reply_to_message) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas gambar/video dengan caption /sticker",
        options
      );
      return;
    }

    const replyMsg = msg.reply_to_message;
    if (!replyMsg.photo && !replyMsg.video && !replyMsg.sticker) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas gambar/video dengan caption /sticker ",
        options
      );
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Lagi bikin sticker nih...",
        options
      );

      let fileId;
      if (replyMsg.photo) {
        fileId = replyMsg.photo[replyMsg.photo.length - 1].file_id;
      } else if (replyMsg.video) {
        fileId = replyMsg.video.file_id;
      } else if (replyMsg.sticker) {
        fileId = replyMsg.sticker.file_id;
      }

      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const fileBuffer = Buffer.from(response.data);

      if (replyMsg.video) {
        const ffmpeg = require("fluent-ffmpeg");
        const tmp = require("os").tmpdir();
        const path = require("path");
        const fs = require("fs");
        const inputPath = path.join(tmp, `input_${Date.now()}.mp4`);
        const framePath = path.join(tmp, `frame_${Date.now()}.webp`);
        const outputPath = path.join(tmp, `output_${Date.now()}.webm`);
        fs.writeFileSync(inputPath, fileBuffer);

        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .outputOptions([
              "-vframes",
              "1",
              "-vf",
              "scale=512:512:force_original_aspect_ratio=decrease",
              "-f",
              "webp",
            ])
            .save(framePath)
            .on("end", resolve)
            .on("error", reject);
        });
        const webpBuffer = fs.readFileSync(framePath);
        await bot.sendSticker(chatId, webpBuffer, {
          ...options,
          sticker: { set_name: packName, emoji: "✨" },
          caption: "✨ Sticker statis dari frame pertama video",
        });
        fs.unlinkSync(framePath);

        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .setStartTime(0)
            .duration(3)
            .outputOptions([
              "-vf",
              "scale=512:512:force_original_aspect_ratio=decrease",
              "-an",
              "-c:v",
              "libvpx",
              "-b:v",
              "500K",
              "-crf",
              "30",
              "-pix_fmt",
              "yuv420p",
            ])
            .save(outputPath)
            .on("end", resolve)
            .on("error", reject);
        });
        const webmBuffer = fs.readFileSync(outputPath);
        await bot.sendAnimation(chatId, webmBuffer, {
          ...options,
          width: 512,
          height: 512,
          caption:
            "✨ Sticker animasi (max 3 detik, .webm, upload manual ke pack animasi Telegram)",
        });
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } else {
        const webpBuffer = await sharp(fileBuffer)
          .webp({ quality: 100 })
          .toBuffer();
        await bot.sendSticker(chatId, webpBuffer, {
          ...options,
          sticker: { set_name: packName, emoji: "✨" },
        });
      }
      await bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in /sticker command:", error);
      await bot.sendMessage(chatId, "❌ Gagal bikin sticker!", options);
    }
  });

  function createSVGText(text, fontSize = 40, width = 512, height = 80, y = 0) {
    const esc = (s) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
      <svg width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="none"/>
        <text x="50%" y="${
          y + height / 2
        }" text-anchor="middle" dominant-baseline="middle"
          font-family="Impact, Arial, sans-serif" font-size="${fontSize}" fill="white" stroke="black" stroke-width="4" paint-order="stroke" style="text-transform:uppercase;">
          ${esc(text)}
        </text>
      </svg>
    `;
  }

  bot.onText(/^\/stikermeme(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    const text = match[1];

    if (!msg.reply_to_message) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas gambar dengan caption /stikermeme atas|bawah",
        options
      );
      return;
    }

    if (!text || !text.includes("|")) {
      await bot.sendMessage(
        chatId,
        "⚠️ Format: /stikermeme teks_atas|teks_bawah",
        options
      );
      return;
    }

    const replyMsg = msg.reply_to_message;
    if (!replyMsg.photo && !replyMsg.sticker) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas gambar dengan caption /stikermeme atas|bawah",
        options
      );
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Lagi bikin sticker meme nih...",
        options
      );

      let fileId;
      if (replyMsg.photo) {
        fileId = replyMsg.photo[replyMsg.photo.length - 1].file_id;
      } else if (replyMsg.sticker) {
        fileId = replyMsg.sticker.file_id;
      }

      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const fileBuffer = Buffer.from(response.data);

      const [topText, bottomText] = text.split("|").map((t) => t.trim() || "-");

      const meta = await sharp(fileBuffer).metadata();
      let width = meta.width;
      let height = meta.height;
      const maxSize = 512;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height / width) * maxSize);
          width = maxSize;
        } else {
          width = Math.round((width / height) * maxSize);
          height = maxSize;
        }
      }

      let baseImg = await sharp(fileBuffer)
        .resize(width, height, {
          fit: "inside",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toBuffer();

      const svgTop = Buffer.from(createSVGText(topText, 40, width, 80, 0));
      const svgBottom = Buffer.from(
        createSVGText(bottomText, 40, width, 80, 0)
      );

      const memeBuffer = await sharp(baseImg)
        .composite([
          { input: svgTop, top: 0, left: 0 },
          { input: svgBottom, top: height - 80, left: 0 },
        ])
        .webp({ quality: 100 })
        .toBuffer();

      await bot.sendSticker(chatId, memeBuffer, {
        ...options,
        sticker: { set_name: "MannnDev Meme", emoji: "😂" },
      });
      await bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error("Error in /stikermeme command:", error);
      await bot.sendMessage(chatId, "❌ Gagal bikin sticker meme!", options);
    }
  });
  bot.onText(/^\/motivasi$/, async (msg) => {
    try {
      const hasil = await fetchJson(
        "https://raw.githubusercontent.com/nazedev/database/refs/heads/master/kata-kata/motivasi.json"
      );
      bot.sendMessage(msg.chat.id, pickRandom(hasil));
    } catch (e) {
      bot.sendMessage(msg.chat.id, "Gagal mengambil motivasi!");
    }
  });

  const quotesHandlers = [
    {
      cmd: "quotesanime",
      file: "quotesanime.json",
      format: (q) =>
        `${q.indo}\n\n📮By: <i>${q.character}</i>\nAnime: <b>${q.anime}</b>`,
    },
    { cmd: "quotesbacot", file: "quotesbacot.json", format: (q) => q },
    { cmd: "quotesbucin", file: "quotesbucin.json", format: (q) => q },
    { cmd: "quotesmotivasi", file: "quotesmotivasi.json", format: (q) => q },
    { cmd: "quotesgalau", file: "quotesgalau.json", format: (q) => q },
    { cmd: "quotesgombal", file: "quotesgombal.json", format: (q) => q },
    { cmd: "quoteshacker", file: "quoteshacker.json", format: (q) => q },
    { cmd: "quotesbijak", file: "quotesbijak.json", format: (q) => q },
  ];
  quotesHandlers.forEach(({ cmd, file, format }) => {
    bot.onText(new RegExp(`^/${cmd}$`), async (msg) => {
      const chatId = msg.chat.id;
      const options =
        msg.chat.type !== "private"
          ? { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
          : { parse_mode: "HTML" };
      try {
        const data = require(`./lib/quotes/${file}`);
        const q = Array.isArray(data) ? pickRandom(data) : data;
        await bot.sendMessage(chatId, format(q), options);
      } catch (e) {
        await bot.sendMessage(chatId, "Quotes tidak tersedia.", options);
      }
    });
  });

  const asupanHandlers = [
    { cmd: "tiktokgirl", file: "tiktokgirl.json" },
    { cmd: "tiktokghea", file: "gheayubi.json" },
    { cmd: "tiktoknukhty", file: "ukhty.json" },
    { cmd: "tiktoksantuy", file: "santuy.json" },
    { cmd: "tiktokkayes", file: "kayes.json" },
    { cmd: "tiktokpanrika", file: "panrika.json" },
    { cmd: "tiktoknotnot", file: "notnot.json" },
  ];
  asupanHandlers.forEach(({ cmd, file }) => {
    bot.onText(new RegExp(`^/${cmd}$`), async (msg) => {
      const chatId = msg.chat.id;
      const options =
        msg.chat.type !== "private"
          ? { reply_to_message_id: msg.message_id }
          : {};
      try {
        const data = JSON.parse(fs.readFileSync(`./database/tiktok/${file}`));
        const video = pickRandom(data);
        await bot.sendVideo(chatId, video.url, {
          ...options,
          caption: `Asupan random dari /${cmd}`,
        });
      } catch (e) {
        await bot.sendMessage(
          chatId,
          "Gagal mengambil asupan. Coba lagi nanti.",
          options
        );
      }
    });
  });
  bot.onText(/^\/bijak$/, async (msg) => {
    try {
      const hasil = await fetchJson(
        "https://raw.githubusercontent.com/nazedev/database/refs/heads/master/kata-kata/bijak.json"
      );
      bot.sendMessage(msg.chat.id, pickRandom(hasil));
    } catch (e) {
      bot.sendMessage(msg.chat.id, "Gagal mengambil quotes bijak!");
    }
  });
  bot.onText(/^\/dare$/, async (msg) => {
    try {
      const hasil = await fetchJson(
        "https://raw.githubusercontent.com/nazedev/database/refs/heads/master/kata-kata/dare.json"
      );
      bot.sendMessage(msg.chat.id, pickRandom(hasil));
    } catch (e) {
      bot.sendMessage(msg.chat.id, "Gagal mengambil dare!");
    }
  });
  bot.onText(/^\/quotes$/, async (msg) => {
    try {
      const res = await fetchJson(
        "https://raw.githubusercontent.com/nazedev/database/refs/heads/master/kata-kata/quotes.json"
      );
      const hasil = pickRandom(res);
      bot.sendMessage(msg.chat.id, `_${hasil.quotes}_\n\n*- ${hasil.author}*`);
    } catch (e) {
      bot.sendMessage(msg.chat.id, "Gagal mengambil quotes!");
    }
  });
  bot.onText(/^\/truth$/, async (msg) => {
    try {
      const hasil = await fetchJson(
        "https://raw.githubusercontent.com/nazedev/database/refs/heads/master/kata-kata/truth.json"
      );
      bot.sendMessage(msg.chat.id, `_${pickRandom(hasil)}_`);
    } catch (e) {
      bot.sendMessage(msg.chat.id, "Gagal mengambil truth!");
    }
  });
  bot.onText(/^\/renungan$/, async (msg) => {
    try {
      const hasil = await fetchJson(
        "https://raw.githubusercontent.com/nazedev/database/refs/heads/master/kata-kata/renungan.json"
      );
      const url = pickRandom(hasil);
      bot.sendPhoto(msg.chat.id, url, { caption: "Renungan random" });
    } catch (e) {
      bot.sendMessage(msg.chat.id, "Gagal mengambil renungan!");
    }
  });
  bot.onText(/^\/bucin$/, async (msg) => {
    try {
      const hasil = await fetchJson(
        "https://raw.githubusercontent.com/nazedev/database/refs/heads/master/kata-kata/bucin.json"
      );
      bot.sendMessage(msg.chat.id, pickRandom(hasil));
    } catch (e) {
      bot.sendMessage(msg.chat.id, "Gagal mengambil quotes bucin!");
    }
  });

  bot.onText(/^\/remini$/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!msg.reply_to_message) {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas gambar yang mau di-HD-in dengan caption /remini",
        options
      );
      return;
    }

    const replyMsg = msg.reply_to_message;
    let fileId;
    if (replyMsg.photo) {
      fileId = replyMsg.photo[replyMsg.photo.length - 1].file_id;
    } else if (
      replyMsg.document &&
      replyMsg.document.mime_type &&
      replyMsg.document.mime_type.startsWith("image/")
    ) {
      fileId = replyMsg.document.file_id;
    } else {
      await bot.sendMessage(
        chatId,
        "⚠️ Balas gambar yang mau di-HD-in dengan caption /remini",
        options
      );
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Lagi proses gambar jadi HD nih, sabar ya!",
        options
      );
      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });
      const fileBuffer = Buffer.from(response.data);

      const hasil = await remini(fileBuffer, "enhance");
      await bot.sendDocument(chatId, hasil, {
        ...options,
        caption: "✨ Done! Gambar lo udah di-HD-in!",
        filename: "remini-hd.jpg",
      });
      await bot.deleteMessage(chatId, processingMsg.message_id);

      const chatMemoryPath = "./chatMemory.json";
      let chatMemory = {};
      if (fs.existsSync(chatMemoryPath)) {
        try {
          chatMemory = JSON.parse(fs.readFileSync(chatMemoryPath, "utf8"));
        } catch (e) {
          chatMemory = {};
        }
      }
      const uid =
        msg.chat.type === "private"
          ? msg.from.id.toString()
          : msg.chat.id.toString();
      if (!chatMemory[uid]) chatMemory[uid] = [];
      chatMemory[uid].push({
        question: "Enhance image with Remini",
        answer: "[Enhanced Image]",
        timestamp: Date.now(),
        type: "remini",
        image: "remini-hd.jpg",
      });
      if (chatMemory[uid].length > 5) {
        chatMemory[uid] = chatMemory[uid].slice(-5);
      }
      fs.writeFileSync(chatMemoryPath, JSON.stringify(chatMemory, null, 2));
    } catch (e) {
      console.error("Error in /remini:", e);
      await bot.sendMessage(
        chatId,
        "❌ Gagal proses gambar jadi HD! Server mungkin sedang sibuk.",
        options
      );
    }
  });
  bot.onText(/^\/smeme(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match ? match[1] : "";
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (
      !msg.reply_to_message ||
      (!msg.reply_to_message.photo && !msg.reply_to_message.sticker)
    ) {
      await bot.sendMessage(
        chatId,
        "Balas gambar/sticker dengan caption /smeme atas|bawah",
        options
      );
      return;
    }
    if (!text || !text.includes("|")) {
      await bot.sendMessage(chatId, "Format: /smeme atas|bawah", options);
      return;
    }

    let fileId;
    if (msg.reply_to_message.photo) {
      fileId =
        msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1]
          .file_id;
    } else if (msg.reply_to_message.sticker) {
      fileId = msg.reply_to_message.sticker.file_id;
    }

    try {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Lagi bikin meme...",
        options
      );

      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data);

      const [atas, bawah] = text.split("|").map((t) => t.trim() || "-");

      const meta = await sharp(buffer).metadata();
      let width = meta.width;
      let height = meta.height;
      const maxSize = 512;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height / width) * maxSize);
          width = maxSize;
        } else {
          width = Math.round((width / height) * maxSize);
          height = maxSize;
        }
      }

      let baseImg = await sharp(buffer)
        .resize(width, height, {
          fit: "inside",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toBuffer();

      const svgTop = Buffer.from(createSVGText(atas, 40, width, 80, 0));
      const svgBottom = Buffer.from(createSVGText(bawah, 40, width, 80, 0));

      const memeBuffer = await sharp(baseImg)
        .composite([
          { input: svgTop, top: 0, left: 0 },
          { input: svgBottom, top: height - 80, left: 0 },
        ])
        .webp({ quality: 100 })
        .toBuffer();

      await bot.sendSticker(chatId, memeBuffer, {
        ...options,
        sticker: { set_name: "MannnDev Meme", emoji: "😂" },
      });
      await bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (e) {
      console.error("Error in /smeme:", e);
      await bot.sendMessage(
        chatId,
        "Server Meme Sedang Offline atau terjadi error!",
        options
      );
    }
  });

  bot.onText(/\/anime(?:\s+(\w+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    const kategori = match && match[1] ? match[1].toLowerCase() : null;

    const animeApiMap = {
      awoo: { url: "https://waifu.pics/api/sfw/awoo", source: "waifu.pics" },
      megumin: {
        url: "https://waifu.pics/api/sfw/megumin",
        source: "waifu.pics",
      },
      shinobu: {
        url: "https://waifu.pics/api/sfw/shinobu",
        source: "waifu.pics",
      },
      handhold: {
        url: "https://waifu.pics/api/sfw/handhold",
        source: "waifu.pics",
      },
      highfive: {
        url: "https://waifu.pics/api/sfw/highfive",
        source: "waifu.pics",
      },
      cringe: {
        url: "https://waifu.pics/api/sfw/cringe",
        source: "waifu.pics",
      },
      dance: { url: "https://waifu.pics/api/sfw/dance", source: "waifu.pics" },
      happy: { url: "https://waifu.pics/api/sfw/happy", source: "waifu.pics" },
      glomp: { url: "https://waifu.pics/api/sfw/glomp", source: "waifu.pics" },
      smug: { url: "https://waifu.pics/api/sfw/smug", source: "waifu.pics" },
      blush: { url: "https://waifu.pics/api/sfw/blush", source: "waifu.pics" },
      wave: { url: "https://waifu.pics/api/sfw/wave", source: "waifu.pics" },
      smile: { url: "https://waifu.pics/api/sfw/smile", source: "waifu.pics" },
      poke: { url: "https://waifu.pics/api/sfw/poke", source: "waifu.pics" },
      wink: { url: "https://waifu.pics/api/sfw/wink", source: "waifu.pics" },
      bonk: { url: "https://waifu.pics/api/sfw/bonk", source: "waifu.pics" },
      bully: { url: "https://waifu.pics/api/sfw/bully", source: "waifu.pics" },
      yeet: { url: "https://waifu.pics/api/sfw/yeet", source: "waifu.pics" },
      bite: { url: "https://waifu.pics/api/sfw/bite", source: "waifu.pics" },
      lick: { url: "https://waifu.pics/api/sfw/lick", source: "waifu.pics" },
      kill: { url: "https://waifu.pics/api/sfw/kill", source: "waifu.pics" },
      cry: { url: "https://waifu.pics/api/sfw/cry", source: "waifu.pics" },
      neko: { url: "https://waifu.pics/api/sfw/neko", source: "waifu.pics" },
      wlp: {
        url: "https://nekos.life/api/v2/img/wallpaper",
        source: "nekos.life",
      },
      kiss: { url: "https://nekos.life/api/v2/img/kiss", source: "nekos.life" },
      hug: { url: "https://nekos.life/api/v2/img/hug", source: "nekos.life" },
      pat: { url: "https://nekos.life/api/v2/img/pat", source: "nekos.life" },
      slap: { url: "https://nekos.life/api/v2/img/slap", source: "nekos.life" },
      cuddle: {
        url: "https://nekos.life/api/v2/img/cuddle",
        source: "nekos.life",
      },
      waifu: {
        url: "https://nekos.life/api/v2/img/waifu",
        source: "nekos.life",
      },
      nom: { url: "https://nekos.life/api/v2/img/nom", source: "nekos.life" },
      foxgirl: {
        url: "https://nekos.life/api/v2/img/fox_girl",
        source: "nekos.life",
      },
      tickle: {
        url: "https://nekos.life/api/v2/img/tickle",
        source: "nekos.life",
      },
      gecg: { url: "https://nekos.life/api/v2/img/gecg", source: "nekos.life" },
      feed: { url: "https://nekos.life/api/v2/img/feed", source: "nekos.life" },
      avatar: {
        url: "https://nekos.life/api/v2/img/avatar",
        source: "nekos.life",
      },
      lizard: {
        url: "https://nekos.life/api/v2/img/lizard",
        source: "nekos.life",
      },
      meow: { url: "https://nekos.life/api/v2/img/meow", source: "nekos.life" },
    };

    if (!kategori || !animeApiMap[kategori]) {
      const listKategori = Object.keys(animeApiMap).sort().join(", ");
      const menuAnime = `╭─❍「 *ANIME MENU* 」❍\n├ Pilih subfitur anime:\n├ ${listKategori.replace(
        /, /g,
        "\n├ "
      )}\n╰─ Contoh: /anime neko`;
      await safeSendMarkdown(bot, chatId, menuAnime, options);
      return;
    }

    try {
      const api = animeApiMap[kategori];
      const res = await axios.get(api.url);
      const imageUrl = res.data.url;
      await bot.sendPhoto(chatId, imageUrl, {
        ...options,
        caption: `✨ *Anime - ${
          kategori.charAt(0).toUpperCase() + kategori.slice(1)
        }*\nSumber: ${api.source}`,
      });
    } catch (e) {
      await safeSendMarkdown(
        bot,
        chatId,
        "❌ Gagal mengambil gambar anime. Coba subfitur lain!",
        options
      );
    }
  });
  
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  bot.onText(/\/(ttsearch)(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const keyword = match[2];
    const options = msg.chat.type !== "private" ? { reply_to_message_id: msg.message_id } : {};

    if (!keyword) {
      return bot.sendMessage(chatId, "❌ Mohon masukkan kata kunci pencarian!\nContoh: /ttsearch video lucu", options);
    }

    const loadingMsg = await bot.sendMessage(chatId, "🔍 Mencari video TikTok...", options);
    
    try {
      const results = await tiktokSearchScrape(keyword);
      
      if (!results || results.length === 0) {
        await bot.editMessageText(
          "❌ Tidak ditemukan video dengan kata kunci tersebut",
          {
            chat_id: chatId,
            message_id: loadingMsg.message_id
          }
        );
        return;
      }

      await bot.deleteMessage(chatId, loadingMsg.message_id);

      for (let index = 0; index < Math.min(10, results.length); index++) {
        const video = results[index];
        const videoId = video.id;
        const username = video.author?.uniqueId || video.author?.nickname || "-";
        const callbackMp3 = `tt_dl_mp3|${username}|${videoId}`;
        const callbackMp4 = `tt_dl_mp4|${username}|${videoId}`;
        const inlineKeyboard = [
          [
            { text: "🎵 Download MP3", callback_data: callbackMp3 },
            { text: "🎬 Download MP4", callback_data: callbackMp4 }
          ]
        ];
        const likes = typeof video.stats.diggCount === 'number' ? video.stats.diggCount : 0;
        const caption =
          `${index + 1}. 🎥 <b>${video.desc}</b>\n` +
          `👤 @${username}\n` +
          `👁️ ${formatNumber(video.stats.playCount)} views | ❤️ ${formatNumber(likes)} likes\n` +
          `<a href=\"${video.url}\">🔗 Lihat Video</a>\n`;

        await bot.sendMessage(chatId, caption, {
          ...options,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: inlineKeyboard },
          disable_web_page_preview: false
        });
      }
  } catch (error) {
    console.error("Error in /ttsearch:", error);
    await bot.sendMessage(chatId, "❌ Maaf, terjadi kesalahan saat mencari video");
  }
  });

  bot.on("callback_query", async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    if (!data) return;
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    if (data.startsWith("tt_dl_mp3|") || data.startsWith("tt_dl_mp4|")) {
      const [type, username, videoId] = data.split("|");
      const url = `https://www.tiktok.com/@${username}/video/${videoId}`;
      await bot.answerCallbackQuery(callbackQuery.id, { text: "⏳ Sedang diproses..." });
      try {
        const { tiktokDl, toAudio } = require("./lib/apiFunctions");
        const processingMsg = await bot.sendMessage(chatId, `⏳ Download ${type === "tt_dl_mp3" ? "MP3" : "MP4"}...`);
        const result = await tiktokDl(url);
        if (!result.status || !result.data || !result.data[0]) throw new Error("Gagal download video");
        const videoUrl = result.data[0].url;
        const axios = require("axios");
        const videoBuffer = await axios.get(videoUrl, { responseType: "arraybuffer" });
        if (type === "tt_dl_mp4") {
          await bot.sendVideo(chatId, videoBuffer.data, { ...options, caption: "✅ Nih videonya bro!" });
        } else if (type === "tt_dl_mp3") {
          try {
            const audioBuffer = await toAudio(videoBuffer.data, "mp4");
            await bot.sendAudio(chatId, audioBuffer, { ...options, caption: "✅ Nih MP3-nya bro!" });
          } catch (e) {
            await bot.sendMessage(chatId, "❌ Gagal konversi ke MP3, bro!");
          }
        }
        await bot.deleteMessage(chatId, processingMsg.message_id);
      } catch (e) {
        await bot.sendMessage(chatId, "❌ Gagal download video TikTok, bro!");
      }
      return;
    }
  });


  const nsfwApiMap = {
    trap: { url: "https://waifu.pics/api/nsfw/trap", source: "waifu.pics" },
    hneko: { url: "https://waifu.pics/api/nsfw/neko", source: "waifu.pics" },
    nwaifu: { url: "https://waifu.pics/api/nsfw/waifu", source: "waifu.pics" },
    gasm: { url: "https://nekos.life/api/v2/img/gasm", source: "nekos.life" },
    milf: { url: "./database/MediaKiw/nsfw/milf.json", source: "local" },
    animespank: {
      url: "https://nekos.life/api/v2/img/spank",
      source: "nekos.life",
    },
    ahegao: { url: "./database/MediaKiw/nsfw/ahegao.json", source: "local" },
    ass: { url: "./database/MediaKiw/nsfw/ass.json", source: "local" },
    bdsm: { url: "./database/MediaKiw/nsfw/bdsm.json", source: "local" },
    blowjob: { url: "./database/MediaKiw/nsfw/blowjob.json", source: "local" },
    cuckold: { url: "./database/MediaKiw/nsfw/cuckold.json", source: "local" },
    cum: { url: "./database/MediaKiw/nsfw/cum.json", source: "local" },
    eba: { url: "./database/MediaKiw/nsfw/eba.json", source: "local" },
    ero: { url: "./database/MediaKiw/nsfw/ero.json", source: "local" },
    femdom: { url: "./database/MediaKiw/nsfw/femdom.json", source: "local" },
    foot: { url: "./database/MediaKiw/nsfw/foot.json", source: "local" },
    gangbang: {
      url: "./database/MediaKiw/nsfw/gangbang.json",
      source: "local",
    },
    glasses: { url: "./database/MediaKiw/nsfw/glasses.json", source: "local" },
    jahy: { url: "./database/MediaKiw/nsfw/jahy.json", source: "local" },
    manga: { url: "./database/MediaKiw/nsfw/manga.json", source: "local" },
    masturbation: {
      url: "./database/MediaKiw/nsfw/masturbation.json",
      source: "local",
    },
    "neko-hentai": {
      url: "./database/MediaKiw/nsfw/neko-hentai.json",
      source: "local",
    },
    "neko-hentai2": {
      url: "./database/MediaKiw/nsfw/neko-hentai2.json",
      source: "local",
    },
    nsfwloli: {
      url: "./database/MediaKiw/nsfw/nsfwloli.json",
      source: "local",
    },
    orgy: { url: "./database/MediaKiw/nsfw/orgy.json", source: "local" },
    panties: { url: "./database/MediaKiw/nsfw/panties.json", source: "local" },
    pussy: { url: "./database/MediaKiw/nsfw/pussy.json", source: "local" },
    tentacles: {
      url: "./database/MediaKiw/nsfw/tentacles.json",
      source: "local",
    },
    thighs: { url: "./database/MediaKiw/nsfw/thighs.json", source: "local" },
    yuri: { url: "./database/MediaKiw/nsfw/yuri.json", source: "local" },
    zettai: { url: "./database/MediaKiw/nsfw/zettai.json", source: "local" },
    gifblowjob: {
      url: "https://waifu.pics/api/nsfw/blowjob",
      source: "waifu.pics",
    },
    gifhentai: { url: "./database/MediaKiw/nsfw/gifs.json", source: "local" },
    gifs: {
      url: "https://raw.githubusercontent.com/DGXeon/XeonMedia/master/gifs.json",
      source: "local",
    },
  };

  bot.onText(/\/nsfw(?:\s+(\w+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    const kategori = match && match[1] ? match[1].toLowerCase() : null;

    if (!kategori || !nsfwApiMap[kategori]) {
      const listKategori = Object.keys(nsfwApiMap).sort().join(", ");
      const menuNsfw = `╭─❍「 *NSFW/WAIFU MENU* 」❍\n├ Pilih subfitur NSFW:\n├ ${listKategori.replace(
        /, /g,
        "\n├ "
      )}\n╰─ Contoh: /nsfw trap`;
      await safeSendMarkdown(bot, chatId, menuNsfw, options);
      return;
    }

    try {
      const api = nsfwApiMap[kategori];
      let imageUrl = null;

      if (api.source === "local") {
        const filePath = path.resolve(__dirname, api.url);
        const fileData = fs.readFileSync(filePath, "utf8");
        const arr = JSON.parse(fileData);
        const pick = arr[Math.floor(Math.random() * arr.length)];
        imageUrl = typeof pick === "string" ? pick : pick.url || pick.link;
      } else {
        const res = await axios.get(api.url);
        if (Array.isArray(res.data)) {
          const pick = res.data[Math.floor(Math.random() * res.data.length)];
          imageUrl = typeof pick === "string" ? pick : pick.url || pick.link;
        } else if (res.data.url) {
          imageUrl = res.data.url;
        } else if (typeof res.data === "string") {
          imageUrl = res.data;
        } else {
          throw new Error("Format data tidak dikenali");
        }
      }

      if (!imageUrl) throw new Error("Tidak ada gambar ditemukan");
      await bot.sendPhoto(chatId, imageUrl, {
        ...options,
        caption: `✨ *NSFW - ${kategori}*\nSumber: ${api.source}`,
      });
    } catch (e) {
      await safeSendMarkdown(
        bot,
        chatId,
        `❌ Gagal mengambil gambar NSFW/waifu (${kategori})!`,
        options
      );
    }
  });

  bot.onText(/^\/owner$/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    const thumbUrl = "https://files.catbox.moe/gk0e3n.png";

    try {
      const caption = `
<b>👤 MY OWNER</b>

• <b>Nama:</b> MannnDev
• <b>Telegram:</b> <a href="https://t.me/pocketedition09">📬 @pocketedition09</a>
• <b>YouTube:</b> <a href="https://youtube.com/@hymannn0703">▶️ @hymannn0703</a>
• <b>GitHub:</b> <a href="https://github.com/bochilascript">💻 bochilascript</a>
• <b>Email:</b> ✉️ muhilman03@gmail.com
• <b>Lokasi:</b> 🇮🇩 Indonesia
`;
      await bot.sendPhoto(chatId, thumbUrl, {
        ...options,
        caption,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    } catch (e) {
      await bot.sendMessage(chatId, "❌ Gagal mengirim kontak owner!", options);
      console.error("Error sendPhoto /owner:", e);
    }
  });

  bot.onText(/\/apakah(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const question = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!question) {
      bot.sendMessage(chatId, `Example: /apakah MannnDev cakep`, options);
      return;
    }

    const answers = [
      "Iya",
      "Tidak",
      "Bisa Jadi",
      "sepertinya",
      "keknya sih iya",
      "Betul",
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];

    bot.sendMessage(
      chatId,
      `Pertanyaan: Apakah ${question}\nJawaban: ${answer}`,
      options
    );
  });

  bot.onText(/\/bisakah(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const question = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!question) {
      bot.sendMessage(
        chatId,
        `Example: /bisakah saya menjadi orang yang cakep seperti MannnDev`,
        options
      );
      return;
    }

    const answers = [
      "Iya",
      "Tidak",
      "Bisa Jadi",
      "sepertinya",
      "keknya sih ngga",
      "g",
      "gatau juga",
      "ngga bakal bisa",
      "gk",
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];

    bot.sendMessage(
      chatId,
      `Pertanyaan: Bisakah ${question}\nJawaban: ${answer}`,
      options
    );
  });

  bot.onText(/\/bagaimana(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const question = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!question) {
      bot.sendMessage(
        chatId,
        `Example: /bagaimana cara agar menjadi cewe yang sesuai dengan tipe nya MannnDev >////<`,
        options
      );
      return;
    }

    const answers = [
      "Gatau juga sih",
      "Sulit Itu Bro",
      "Maaf Bot Tidak Bisa Menjawab Pertanyaan Anda",
      "Coba Deh Cari Di Gugel",
      "astaghfirallah Beneran???",
      "Pusing ah",
      "Owhh Begitu:(",
      "Yang Sabar Ya Bos:(",
      "Alamak, pusing gweh",
      "mending beli eskrim",
      "Gimana yeee",
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];

    bot.sendMessage(
      chatId,
      `Pertanyaan: ${question}\nJawaban: ${answer}`,
      options
    );
  });

  bot.onText(/\/cekmati(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!name) {
      bot.sendMessage(chatId, `Yang Mau Lu Cek Siapa Bego?`, options);
      return;
    }

    try {
      const response = await fetch(`https://api.agify.io/?name=${name}`);
      const data = await response.json();

      bot.sendMessage(
        chatId,
        `Nama: ${data.name}\n*Mati Pada Umur:* ${data.age} Tahun.\n\n\n‼️*Jangan percaya teks diatas, Soalnya mati gada yg tau.Cepet Cepet Tobat Ya Bro*`,
        {
          ...options,
          parse_mode: "Markdown",
        }
      );
    } catch (error) {
      bot.sendMessage(
        chatId,
        "Maaf, terjadi kesalahan saat mengecek.",
        options
      );
    }
  });

  bot.onText(/\/wangy(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!name) {
      bot.sendMessage(chatId, `Contoh: /wangy Mannn`, options);
      return;
    }

    const wangyText = `${name} ${name} ${name} ❤️ ❤️ ❤️ WANGY WANGY WANGY WANGY HU HA HU HA HU HA, aaaah Wangynya rambut ${name} wangyy aku mau nyiumin aroma wangynya ${name} AAAAAAAAH ~ Rambutnya.... aaah rambutnya juga pengen aku elus-elus & pat-pat ~~ AAAAAH ${name} keluar pertama kali di anime juga manis ❤️ ❤️ ❤️ banget AAAAAAAAH ${name} AAAAA LUCCUUUUUUUUUUUUUUU............ ${name} AAAAAAAAAAAAAAAAAAAAGH ❤️ ❤️ ❤️apa ? ${name} itu gak nyata ? Cuma HALU katamu ? nggak, ngak ngak ngak NGAAAAAAAAK GUA GAK PERCAYA ITU DIA NYATA NGAAAAAAAAAAAAAAAAAK PEDULI BANGSAAAAAT !! GUA GAK PEDULI SAMA KENYATAAN POKOKNYA GAK PEDULI. ❤️ ❤️ ❤️ ${name} gw ... ${name} di laptop ngeliatin gw, ${name} .. kamu percaya sama aku ? aaaaaaaaaaah syukur ${name} aku gak mau merelakan ${name} aaaaaah ❤️ ❤️ ❤️ YEAAAAAAAAAAAH GUA MASIH PUNYA ${name} SENDIRI PUN NGGAK SAMA AAAAAAAAAAAAAAH`;
    bot.sendMessage(chatId, wangyText, options);
  });

  bot.onText(/\/kapankah(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const question = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!question) {
      bot.sendMessage(
        chatId,
        `Penggunaan /kapankah Pertanyaan\n\nContoh: /kapankah Saya Jadi Istrinya Hinata Kun >////<`,
        options
      );
      return;
    }

    const answers = [
      "5 Hari Lagi",
      "10 Hari Lagi",
      "15 Hari Lagi",
      "20 Hari Lagi",
      "25 Hari Lagi",
      "30 Hari Lagi",
      "35 Hari Lagi",
      "40 Hari Lagi",
      "45 Hari Lagi",
      "50 Hari Lagi",
      "55 Hari Lagi",
      "60 Hari Lagi",
      "65 Hari Lagi",
      "70 Hari Lagi",
      "75 Hari Lagi",
      "80 Hari Lagi",
      "85 Hari Lagi",
      "90 Hari Lagi",
      "95 Hari Lagi",
      "100 Hari Lagi",
      "5 Bulan Lagi",
      "10 Bulan Lagi",
      "15 Bulan Lagi",
      "20 Bulan Lagi",
      "25 Bulan Lagi",
      "30 Bulan Lagi",
      "35 Bulan Lagi",
      "40 Bulan Lagi",
      "45 Bulan Lagi",
      "50 Bulan Lagi",
      "55 Bulan Lagi",
      "60 Bulan Lagi",
      "65 Bulan Lagi",
      "70 Bulan Lagi",
      "75 Bulan Lagi",
      "80 Bulan Lagi",
      "85 Bulan Lagi",
      "90 Bulan Lagi",
      "95 Bulan Lagi",
      "100 Bulan Lagi",
      "1 Tahun Lagi",
      "2 Tahun Lagi",
      "3 Tahun Lagi",
      "4 Tahun Lagi",
      "5 Tahun Lagi",
      "Besok",
      "Lusa",
      `Abis Command Ini Juga Lu ${question}`,
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];

    bot.sendMessage(chatId, `Pertanyaan: ${question}\nJawaban: *${answer}*`, {
      ...options,
      parse_mode: "Markdown",
    });
  });

  bot.onText(/\/cekkuota(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!name) {
      bot.sendMessage(
        chatId,
        `Penggunaan /cekkuota Nama\n\nContoh: /cekkuota ${msg.from.first_name}`,
        options
      );
      return;
    }

    const kuota = [
      "1kb",
      "5mb",
      "20mb",
      "3gb",
      "5gb",
      "7gb",
      "10gb",
      "1gb",
      "banteng 2gb",
      "2.5gb",
      "1tb",
      "7mb",
      "habis",
      "1,3gb",
      "4,1gb",
      "0,1kb",
    ];
    const result = kuota[Math.floor(Math.random() * kuota.length)];

    bot.sendMessage(chatId, `Nama: ${name}\nkuota anda: *${result}*`, {
      ...options,
      parse_mode: "Markdown",
    });
  });

  bot.onText(/\/cekjodoh(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!name) {
      bot.sendMessage(
        chatId,
        `Penggunaan /cekjodoh Nama\n\nContoh: /cekjodoh ${msg.from.first_name}`,
        options
      );
      return;
    }

    const jodoh = [
      "etek markopet",
      "uni as",
      "uni maria",
      "uni bakwan",
      "popo berby",
      "mimi pery",
      "uni bika",
      "uni bakwan",
      "kosong",
      "sumiati",
      "yanto",
    ];
    const result = jodoh[Math.floor(Math.random() * jodoh.length)];

    bot.sendMessage(chatId, `Nama: ${name}\nJodoh anda: *${result}*`, {
      ...options,
      parse_mode: "Markdown",
    });
  });

  bot.onText(/\/cekkhodamcore(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!name) {
      bot.sendMessage(
        chatId,
        `Penggunaan /cekkhodamcore Nama\n\nContoh: /cekkhodamcore ${msg.from.first_name}`,
        options
      );
      return;
    }

    const khodams = [
      "ulat bulu",
      "paracetamol",
      "cabul",
      "burung prikitiw",
      "kipas cosmos",
      "vitamin c",
      "kipas angin",
      "Buaya darat",
      "meja berjalan",
      "yatim",
      "ikan cupang",
      "kodok",
      "kosong",
      "mayat hidup",
      "merpati",
      "minyak sarimurni",
      "lampu LID",
      "tikus kencing",
      "sirup abc",
    ];
    const result = khodams[Math.floor(Math.random() * khodams.length)];

    bot.sendMessage(chatId, `Nama: ${name}\nkhodam anda: *${result}*`, {
      ...options,
      parse_mode: "Markdown",
    });
  });

  const percentageCommands = [
    "ceksange",
    "cekgay",
    "cekganteng",
    "cekcantik",
    "cekkaya",
    "ceklesbi",
  ];
  percentageCommands.forEach((cmd) => {
    bot.onText(new RegExp(`\\/${cmd}(?: (.+))?`), async (msg, match) => {
      const chatId = msg.chat.id;
      const name = match[1];
      const options =
        msg.chat.type !== "private"
          ? { reply_to_message_id: msg.message_id }
          : {};

      if (!name) {
        bot.sendMessage(
          chatId,
          `Penggunaan /${cmd} Nama\n\nContoh: /${cmd} ${msg.from.first_name}`,
          options
        );
        return;
      }

      const percentages = [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
        "60",
        "65",
        "70",
        "75",
        "80",
        "85",
        "90",
        "95",
        "100",
      ];
      const result =
        percentages[Math.floor(Math.random() * percentages.length)];

      bot.sendMessage(chatId, `Nama: ${name}\nJawaban: *${result}%*`, {
        ...options,
        parse_mode: "Markdown",
      });
    });
  });

  const cerpenCategories = [
    "anak",
    "bahasa daerah",
    "bahasa inggris",
    "bahasa jawa",
    "bahasa sunda",
    "budaya",
    "cinta",
    "cinta islami",
    "cinta pertama",
    "cinta romantis",
    "cinta sedih",
    "cinta segitiga",
    "cinta sejati",
    "galau",
    "gokil",
    "inspiratif",
    "jepang",
    "kehidupan",
    "keluarga",
    "kisah nyata",
    "korea",
    "kristen",
    "liburan",
    "malaysia",
    "mengharukan",
    "misteri",
    "motivasi",
    "nasihat",
    "nasionalisme",
    "olahraga",
    "patah hati",
    "penantian",
    "pendidikan",
    "pengalaman pribadi",
    "pengorbanan",
    "penyesalan",
    "perjuangan",
    "perpisahan",
    "persahabatan",
    "petualangan",
    "ramadhan",
    "remaja",
    "rindu",
    "rohani",
    "romantis",
    "sastra",
    "sedih",
    "sejarah",
  ];

  bot.onText(/^\/cerpen-([a-zA-Z0-9-]+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    let kategori = match[1].replace(/-/g, " ").toLowerCase();
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!cerpenCategories.includes(kategori)) {
      await safeSendMarkdown(
        bot,
        chatId,
        `Kategori tidak ditemukan!\n\nKategori yang tersedia:\n${cerpenCategories
          .map((c) => `- ${c}`)
          .join("\n")}`,
        { ...options, parse_mode: "Markdown" }
      );
      return;
    }

    try {
      const hasil = await cerpen(kategori);
      const text = `❏ *Judul*: ${hasil.title}
❏ *Author*: ${hasil.author}
❏ *Category*: ${hasil.kategori}
❏ *Pass Moderation*: ${hasil.lolos}
❏ *Story*: ${hasil.cerita}`;
      await bot.sendMessage(chatId, text, {
        ...options,
        parse_mode: "Markdown",
      });
    } catch (e) {
      await safeSendMarkdown(
        bot,
        chatId,
        "Gagal mengambil cerpen. Pastikan kategori valid atau coba lagi nanti.",
        options
      );
    }
  });

  bot.onText(/^\/cerpen$/, async (msg) => {
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    await bot.sendMessage(
      chatId,
      `*Daftar Kategori Cerpen:*\n${cerpenCategories
        .map((c) => `- ${c}`)
        .join("\n")}\n\nContoh: /cerpen-anak`,
      { ...options, parse_mode: "Markdown" }
    );
  });

  bot.onText(/^\/hapusriwayat$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const OWNER_ID = 6045720668;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (userId !== OWNER_ID) {
      return bot.sendMessage(
        chatId,
        "⛔ Maaf ya bestie, perintah ini cuma bisa dipake sama owner bot aja 😤"
      );
    }

    try {
      const memoryPath = "./chatMemory.json";
      if (fs.existsSync(memoryPath)) {
        fs.writeFileSync(memoryPath, JSON.stringify({}, null, 2));
      }
      await bot.sendMessage(
        chatId,
        "✅ Semua riwayat chat berhasil dihapus!",
        options
      );
    } catch (e) {
      console.error("Error in /hapusriwayat:", e);
      await bot.sendMessage(
        chatId,
        "❌ Gagal menghapus riwayat chat!",
        options
      );
    }
  });

  bot.onText(/\/generate(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const prompt = match ? match[1] : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    if (!prompt || !prompt.trim()) {
      await bot.sendMessage(
        chatId,
        "Masukkan prompt gambar setelah /generate. Contoh: /generate kucing lucu di luar angkasa",
        { parse_mode: "HTML", ...options }
      );
      return;
    }

    try {
      await bot.sendChatAction(chatId, "upload_photo");
      const ai = new GoogleGenAI({ apiKey: getNextGeminiApiKey() });
      let contents;
      if (
        msg.reply_to_message &&
        (msg.reply_to_message.photo || msg.reply_to_message.document)
      ) {
        let fileId;
        if (msg.reply_to_message.photo) {
          fileId =
            msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1]
              .file_id;
        } else if (msg.reply_to_message.document) {
          fileId = msg.reply_to_message.document.file_id;
        }
        const file = await bot.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
        const axiosRes = await axios.get(fileUrl, {
          responseType: "arraybuffer",
        });
        const imageBuffer = Buffer.from(axiosRes.data, "binary");
        const base64Image = imageBuffer.toString("base64");
        contents = [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image,
            },
          },
        ];
      } else {
        contents = prompt;
      }

      const response = await ai.models.generateContent({
        model: MODEL_IMAGE,
        contents: contents,
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
      });

      let textPart = null;
      let imageBufferOut = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.text) textPart = part.text;
        if (part.inlineData)
          imageBufferOut = Buffer.from(part.inlineData.data, "base64");
      }

      if (textPart) {
        await bot.sendMessage(chatId, textPart, {
          parse_mode: "HTML",
          ...options,
        });
      }
      if (imageBufferOut) {
        const fileName = path.join("tmp", `Manndev_AI_${Date.now()}.png`);
        fs.writeFileSync(fileName, imageBufferOut);

        const wib = moment().tz("Asia/Jakarta");
        const jam = wib.format("HH");
        const menit = wib.format("mm");
        const detik = wib.format("ss");
        const hari = wib.format("dddd");
        const tanggal = wib.format("D/M/YYYY");
        const waktu = `${jam}:${menit}:${detik} WIB (${hari}, ${tanggal})`;
        await bot.sendPhoto(chatId, fileName, {
          caption: `✨ Hasil generate gambar MannnDev AI | ${waktu}`,
          ...options,
        });

        const chatMemoryPath = "./chatMemory.json";
        let chatMemory = {};
        if (fs.existsSync(chatMemoryPath)) {
          try {
            chatMemory = JSON.parse(fs.readFileSync(chatMemoryPath, "utf8"));
          } catch (e) {
            chatMemory = {};
          }
        }
        const uid =
          msg.chat.type === "private"
            ? msg.from.id.toString()
            : msg.chat.id.toString();
        if (!chatMemory[uid]) chatMemory[uid] = [];
        chatMemory[uid].push({
          question: prompt,
          answer: textPart ? textPart : "[Gambar]",
          timestamp: Date.now(),
          type: "generate-image",
          imagePath: fileName,
        });
        if (chatMemory[uid].length > 5) {
          chatMemory[uid] = chatMemory[uid].slice(-5);
        }
        fs.writeFileSync(chatMemoryPath, JSON.stringify(chatMemory, null, 2));
      } else if (!textPart) {
        await bot.sendMessage(chatId, "❌ Gagal generate gambar.", {
          parse_mode: "HTML",
          ...options,
        });
      }
    } catch (e) {
      await bot.sendMessage(
        chatId,
        `❌ Error generate gambar: ${escapeHtml(e.message)}`,
        { parse_mode: "HTML", ...options }
      );
    }
  });

  bot.onText(/\/tiktok (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    console.log(`[TIKTOK] Command received from chatId: ${chatId}`);
    console.log(`[TIKTOK] URL: ${url}`);

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Sedang download video TikTok...",
        options
      );
      console.log(`[TIKTOK] Download started for chatId: ${chatId}`);

      const result = await tiktokDl(url);
      console.log(`[TIKTOK] Download result:`, JSON.stringify(result, null, 2));

      if (result.status && result.data && result.data[0]) {
        const videoUrl = result.data[0].url;
        console.log(`[TIKTOK] Video URL obtained: ${videoUrl}`);

        const videoBuffer = await axios.get(videoUrl, {
          responseType: "arraybuffer",
        });
        console.log(
          `[TIKTOK] Video buffer downloaded, size: ${videoBuffer.data.length} bytes`
        );

        const caption =
          `📱 *TikTok Download*\n\n` +
          `👤 Author: ${escapeMarkdownV2(result.author.nickname)}\n` +
          `👁 Views: ${escapeMarkdownV2(
            result.stats.views?.toString() || "-"
          )}\n` +
          `❤️ Likes: ${escapeMarkdownV2(
            result.stats.likes?.toString() || "-"
          )}\n\n` +
          `${escapeMarkdownV2(result.title)}`;

        console.log(`[TIKTOK] Sending video to chatId: ${chatId}`);
        await bot.sendVideo(chatId, videoBuffer.data, {
          caption,
          parse_mode: "MarkdownV2",
          ...options,
        });
        console.log(`[TIKTOK] Video sent successfully to chatId: ${chatId}`);
      } else {
        throw new Error("Gagal mendapatkan video");
      }
    } catch (error) {
      console.error("[TIKTOK] Error details:", error);
      console.error("[TIKTOK] Error stack:", error.stack);
      await bot.sendMessage(
        chatId,
        "❌ Gagal download video TikTok. Pastikan link valid dan coba lagi.",
        options
      );
    } finally {
      if (processingMsg && processingMsg.message_id) {
        bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
      }
    }
  });

  bot.onText(/\/instagram (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};

    console.log(`[INSTAGRAM] Command received from chatId: ${chatId}`);
    console.log(`[INSTAGRAM] URL: ${url}`);

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Sedang download post Instagram...",
        options
      );
      console.log(`[INSTAGRAM] Download started for chatId: ${chatId}`);

      const result = await instaDl(url);
      console.log(
        `[INSTAGRAM] Download result:`,
        JSON.stringify(result, null, 2)
      );

      if (result && result.length > 0) {
        for (const item of result) {
          const mediaUrl = item.url;
          console.log(`[INSTAGRAM] Media URL obtained: ${mediaUrl}`);

          const mediaBuffer = await axios.get(mediaUrl, {
            responseType: "arraybuffer",
          });
          console.log(
            `[INSTAGRAM] Media buffer downloaded, size: ${mediaBuffer.data.length} bytes`
          );

          const fileType = await fromBuffer(mediaBuffer.data);
          console.log(`[INSTAGRAM] File type detected: ${fileType.mime}`);

          console.log(`[INSTAGRAM] Sending media to chatId: ${chatId}`);
          if (fileType.mime.startsWith("video/")) {
            await bot.sendVideo(chatId, mediaBuffer.data, options);
          } else {
            await bot.sendPhoto(chatId, mediaBuffer.data, options);
          }
          console.log(
            `[INSTAGRAM] Media sent successfully to chatId: ${chatId}`
          );
        }
      } else {
        throw new Error("Gagal mendapatkan media");
      }
    } catch (error) {
      console.error("[INSTAGRAM] Error details:", error);
      console.error("[INSTAGRAM] Error stack:", error.stack);
      await bot.sendMessage(
        chatId,
        "❌ Gagal download post Instagram. Pastikan link valid dan coba lagi.",
        options
      );
    } finally {
      if (processingMsg && processingMsg.message_id) {
        bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
      }
    }
  });

  bot.onText(/\/ytsearch(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match && match[1] ? match[1].trim() : null;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id, parse_mode: "Markdown" }
        : { parse_mode: "Markdown" };

    if (!query) {
      return bot.sendMessage(
        chatId,
        "❗ Masukin keyword pencarian, contoh: /ytsearch dj tiktok viral",
        options
      );
    }
    try {
      const { youSearch } = require("./lib/apiFunctions");
      const results = await youSearch(query);
      if (!results || results.length === 0) {
        return bot.sendMessage(
          chatId,
          "❗ Gak nemu video YouTube yang cocok, bro.",
          options
        );
      }
      for (let i = 0; i < Math.min(5, results.length); i++) {
        const v = results[i];
        let reply = `*${i + 1}. ${v.title || "-"}*\n`;
        if (v.channel) reply += `👤 Channel: ${v.channel}\n`;
        if (v.url) reply += `[Link Video](${v.url})\n`;
        if (v.duration) reply += `⏱️ Durasi: ${v.duration}\n`;
        const inlineKeyboard = [
          [
            { text: "🎵 Download MP3", callback_data: `yt_dl_mp3|${v.url}` },
            { text: "🎬 Download MP4", callback_data: `yt_dl_mp4|${v.url}` },
          ],
        ];
        await bot.sendMessage(chatId, reply, {
          ...options,
          reply_markup: { inline_keyboard: inlineKeyboard },
        });
      }
    } catch (e) {
      bot.sendMessage(
        chatId,
        "❗ Gagal cari YouTube: " + (e.message || e),
        options
      );
    }
  });

  bot.on("callback_query", async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    if (
      !data ||
      (!data.startsWith("yt_dl_mp3|") && !data.startsWith("yt_dl_mp4|"))
    )
      return;
    const chatId = msg.chat.id;
    const options =
      msg.chat.type !== "private"
        ? { reply_to_message_id: msg.message_id }
        : {};
    const [type, url] = data.split("|");
    try {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: "⏳ Sedang diproses...",
      });
      if (type === "yt_dl_mp3") {
        const processingMsg = await bot.sendMessage(
          chatId,
          "⏳ Download MP3..."
        );
        const result = await ytMp3(url);
        let size = result.size;
        if (typeof size === "object" && typeof size.then === "function") {
          size = await size;
        }
        const title = result.title || "Unknown Title";
        const channel = result.channel || "Unknown Channel";
        const audioBuffer = result.result;
        const { compressMp3 } = require("./lib/converter");
        const maxSize = 50 * 1024 * 1024;
        let audioBufferToSend = audioBuffer;
        if (audioBuffer && audioBuffer.length > maxSize) {
          const bitrates = ["128k", "96k", "64k", "48k", "32k"];
          for (let i = 0; i < bitrates.length; i++) {
            console.log(
              `[YT-MP3] File terlalu besar (${(
                audioBufferToSend.length /
                1024 /
                1024
              ).toFixed(2)} MB), kompres ulang ke ${bitrates[i]}bps...`
            );
            audioBufferToSend = await compressMp3(
              audioBufferToSend,
              bitrates[i]
            );
            if (audioBufferToSend.length <= maxSize) {
              console.log(
                `[YT-MP3] Kompres sukses di ${bitrates[i]}, ukuran akhir: ${(
                  audioBufferToSend.length /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              );
              break;
            }
          }
          if (audioBufferToSend.length > maxSize) {
            console.log(
              `[YT-MP3] Gagal kompres, file masih di atas 50MB (${(
                audioBufferToSend.length /
                1024 /
                1024
              ).toFixed(2)} MB) walau sudah bitrate terendah.`
            );
            return bot.sendMessage(
              chatId,
              "❌ File audio terlalu besar walau sudah dikompres ke bitrate terendah. Coba video lain atau cari versi lebih pendek!",
              options
            );
          }
        }
        const caption = `🎵 ${title}\n\n👤 Channel: ${channel}\n💾 Size: ${
          size || "Unknown"
        }`;
        if (audioBufferToSend) {
          await bot.sendAudio(chatId, audioBufferToSend, {
            title,
            performer: channel,
            caption,
            ...options,
          });
        } else {
          await bot.sendMessage(
            chatId,
            "Yah, maaf nih, gak nemu format audio MP3 yang cocok buat video itu. Coba video lain deh! 😥",
            options
          );
        }
        await bot.deleteMessage(chatId, processingMsg.message_id);
      } else if (type === "yt_dl_mp4") {
        const processingMsg = await bot.sendMessage(
          chatId,
          "⏳ Download MP4..."
        );
        const {
          downloadYtMp4WithYtdlp,
          toVideo,
        } = require("./lib/apiFunctions");
        const { filePath, title } = await downloadYtMp4WithYtdlp(url);
        const path = require("path");
        const fs = require("fs");
        let sendFile = filePath;
        let sendAsVideo = false;
        let ext = path.extname(filePath);
        if (ext !== ".mp4") {
          try {
            const mp4Buffer = await toVideo(fs.readFileSync(filePath), "mp4");
            const mp4Path = path.join(
              path.dirname(filePath),
              `${title.replace(/[^a-zA-Z0-9-_ ]/g, "_")}.mp4`
            );
            fs.writeFileSync(mp4Path, mp4Buffer);
            sendFile = mp4Path;
            sendAsVideo = true;
            ext = ".mp4";
          } catch (e) {
            sendAsVideo = false;
          }
        } else {
          sendAsVideo = true;
        }
        const getSize = (filePath) => {
          try {
            const size = fs.statSync(filePath).size;
            if (size < 1024) return size + " B";
            if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
            if (size < 1024 * 1024 * 1024)
              return (size / (1024 * 1024)).toFixed(1) + " MB";
            return (size / (1024 * 1024 * 1024)).toFixed(1) + " GB";
          } catch {
            return "-";
          }
        };
        const fileSizeText = getSize(sendFile);
        const niceFileName = sendAsVideo
          ? `${title.replace(/[^a-zA-Z0-9-_ ]/g, "_")}.mp4`
          : `${title.replace(/[^a-zA-Z0-9-_ ]/g, "_")}${ext}`;
        const caption = `🎬 ${title}\n💾 Ukuran: ${fileSizeText}\n📁 Nama file: ${niceFileName}`;
        if (sendAsVideo) {
          await bot.sendVideo(chatId, sendFile, {
            caption,
            filename: niceFileName,
          });
        } else {
          await bot.sendDocument(chatId, sendFile, {
            caption,
            filename: niceFileName,
          });
        }
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
        if (sendFile !== filePath) {
          try {
            fs.unlinkSync(sendFile);
          } catch (e) {}
        }
        try {
          const infoJsonPath = filePath.replace(
            path.extname(filePath),
            ".json"
          );
          if (fs.existsSync(infoJsonPath)) fs.unlinkSync(infoJsonPath);
        } catch (e) {}
        await bot.deleteMessage(chatId, processingMsg.message_id);
      }
    } catch (err) {
      await bot.sendMessage(chatId, `❌ Gagal download: ${err.message}`);
    }
  });

  
}

main();

async function safeSendMarkdown(bot, chatId, text, options = {}) {
  try {
    await bot.sendMessage(chatId, text, options);
  } catch (err) {
    console.error("safeSendMarkdown error:", err.message);
    try {
      await bot.sendMessage(chatId, text, options);
    } catch (err2) {
      console.error("safeSendMarkdown fallback error:", err2.message);
    }
  }
}

const MODEL_TEXT = process.env.GOOGLE_MODEL_TEXT || "gemini-1.5-flash-latest";
const MODEL_IMAGE = process.env.GOOGLE_MODEL_IMAGE || "gemini-2.0-flash-preview-image-generation";
function splitToChunks(text, maxLen = 4096) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + maxLen));
      i += maxLen;
    }
    return chunks;
}
async function clearOldChats() {
  try {
    const res = await axios.get(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates?offset=-1`
    );
    const data = res.data;
    const lastUpdateId = data?.result?.[0]?.update_id;
    if (lastUpdateId !== undefined) {
      await axios.get(
        `https://api.telegram.org/bot${
          process.env.TELEGRAM_BOT_TOKEN
        }/getUpdates?offset=${lastUpdateId + 1}`
      );
    }
  } catch (err) {
    console.error("Error clearing old chats:", err);
  }
}

function extractCodeBlock(text) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]+?)```/;
  const match = text.match(codeBlockRegex);
  if (match && match[2] && match[2].trim().length > 0) {
    return {
      lang: match[1] ? match[1].toLowerCase() : "txt",
      code: match[2],
    };
  }
  return null;
}
tgFormat.bold = (text) => {
  const safe = text.replace(/\*/g, "\\*");
  return `*${safe}*`;
};
tgFormat.italic = (text) => {
  const safe = text.replace(/_/g, "\\_");
  return `_${safe}_`;
};
tgFormat.codeBlock = (code, lang = "") => {
  return "```" + lang + "\n" + code + "\n```";
};

tgFormat.escape = tgFormat;

function escapeMDV2(text) {
  if (!text) return "";
  return text.replace(/([_*\[\]()~`>#+\-=|{}\.!\\])/g, "\\$1");
}
tgFormat.escape = escapeMDV2;
tgFormat.bold = (text) => {
  const safe = escapeMDV2(text);
  return `*${safe}*`;
};

tgFormat.escape = escapeMDV2;
tgFormat.bold = (text) => {
  const safe = escapeMDV2(text);
  return `*${safe}*`;
};

const tmpDir = path.join(__dirname, "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

setInterval(() => {
  const files = fs.readdirSync(tmpDir);
  const now = Date.now();
  files.forEach((file) => {
    const filePath = path.join(tmpDir, file);
    try {
      const stat = fs.statSync(filePath);
      if (now - stat.mtimeMs > 2 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    } catch {}
  });
}, 2 * 60 * 1000);
