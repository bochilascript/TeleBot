require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Replicate = require('replicate'); // Keep this import for now, might be used elsewhere or can be removed later if not.
const fs = require('fs');
const path = require('path');
const { remini } = require('./lib/remini'); // Import fungsi remini
const axios = require('axios');
const cheerio = require('cheerio');
const { googlesr, search } = require('google-sr');
const FormData = require('form-data'); // Import form-data library
const sharp = require('sharp');
const { OpenAI } = require('openai'); // Import OpenAI library

// Load OpenAI API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Import API functions
const { 
  chatGpt,
  tiktokDl: tiktokDlApi,
  facebookDl: facebookDlApi,
  instaDl,
  instaDownload,
  instaStory: instaStoryApi,
  ytMp4,
  ytMp3,
  allDl,
  quotedLyo,
  cekKhodam,
  simi: simiApi,
  mediafireDl: mediafireDlApi,
  wallpaper: wallpaperApi,
  cariresep,
  detailresep,
  Steam,
  Steam_Detail,
  pinterest,
  styletext,
  hitamkan,
  ringtone,
  wikimedia,
  instagramDl: instagramDlApi,
  instaStalk,
  telegramStalk,
  tiktokStalk: tiktokStiktokStalkApi,
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
  getWeatherData,
  fetchWaifuNeko, // Import fetchWaifuNeko function
  toAudio, // Import toAudio function
  toPTT, // Import toPTT function
  toVideo // Import toVideo function
} = require('./lib/apiFunctions');

// Import Google Generative AI library
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Instantiate Google Generative AI at the top level
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Remove this line

// Inisialisasi bot Telegram
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Get bot info and store botId
bot.getMe().then(me => {
  botId = me.id;
  console.log(`Bot username: @${me.username}`);
}).catch(e => console.error('Error fetching bot info:', e));

// Variable to store bot's ID, accessible by handlers
let botId; // Variable to store bot's ID, accessible by handlers

// Array of Gemini API keys from environment variable
const geminiApiKeys = process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.split(',').map(key => key.trim()) : [];
let currentApiKeyIndex = 0;

// Function to get the next Gemini API key in a round-robin fashion
function getNextApiKey() {
  if (geminiApiKeys.length === 0) {
    throw new Error('Google Gemini API key is not configured in .env file.');
  }
  const apiKey = geminiApiKeys[currentApiKeyIndex];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length;
  return apiKey;
}

// Define all bot handlers here, outside the async function

// Command /tes
bot.onText(/\/tes/, async (msg) => {
  const chatId = msg.chat.id;
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  bot.sendMessage(chatId,
    '┏━━━「 MannnDev AI Bot 」━━━┓\n' +
    '┃\n' +
    '┃ 👋 Halo Bro/Sis! Gue MannnDev AI Bot\n' +
    '┃    Siap bantu lo bikin konten kece!\n' +
    '┃\n' +
    '┣━━━「 Fitur Utama 」━━━┫\n' +
    '┃\n' +
    '🎨 `/generate [deskripsi]` - Buat gambar dari imajinasi lo\n' +
    '🖼️ Kirim foto dengan caption `/remini` - Bikin foto lo makin jernih dan HD!\n' +
    '📸 Balas foto dengan `/toHD` - Enhance foto ke Ultra HD\n' +
    '🔍 Balas foto dengan `/upscale [2/4/6/8]` - Perbesar ukuran foto\n' +
    '💬 `/tanya [pertanyaan]` - Curhat atau tanya apa aja sama gue!\n' +
    '💻 `/ssweb [url]` - Ambil screenshot halaman web\n' + // Tambahkan ssweb
    '☀️ `/cuaca [kota]` - Cek cuaca di kota favorit lo\n' + // Tambahkan cuaca
    // Tambahkan perintah sticker, meme, dll. di sini nanti
    '✨ `/geminiai [pertanyaan]` - Tanya ke Gemini AI\n' + // Pindahkan Gemini AI ke sini
    '\n' +
    '┣━━━「 Download Media 」━━━┫\n' +
    '┃\n' +
    '🎵 `/ytmp3 [url]` - Download lagu dari YouTube\n' +
    '🎥 `/ytmp4 [url]` - Download video dari YouTube\n' +
    '📱 `/tiktok [url]` - Download video dari TikTok\n' +
    '📸 `/instagramdl [url]` - Download media dari Instagram\n' +
    '🎵 `/spotifydl [url]` - Download lagu dari Spotify\n' +
    '📁 `/mediafiredl [url]` - Download file dari MediaFire\n' +
    '🔗 `/alldl [url]` - Download media dari berbagai platform\n' + // Tambahkan alldl
    '\n' +
    '┣━━━「 Konversi Media 」━━━┫\n' +
    '┃\n' +
    '🎵 Balas audio/video dengan `/toaudio` - Ubah media jadi audio MP3\n' +
    '🎙️ Balas audio/video dengan `/toptt` - Ubah media jadi pesan suara (PTT)\n' +
    '▶️ Balas audio dengan `/tovideo` - Ubah audio jadi video (dengan background hitam)\n' +
    '\n' +
    '┣━━━「 Fitur Lainnya 」━━━┫\n' +
    '┃\n' +
    '🔍 `/google [pertanyaan]` - Web search\n' +
    '🤖 `/chatgpt [pertanyaan]` - Tanya ChatGPT\n' +
    '🏙️ `/wallpaper [kata kunci]` - Cari wallpaper\n' +
    '🍳 `/resep [makanan]` - Cari resep masakan\n' +
    '🎮 `/steam [nama game]` - Info game Steam\n' +
    '👤 `/instastalk [username]` - Stalk profil Instagram\n' +
    '👤 `/telegramstalk [username]` - Stalk profil Telegram\n' +
    '👤 `/tiktokstalk [username]` - Stalk profil TikTok\n' +
    '📊 `/genshinstalk [uid]` - Stalk profil Genshin Impact\n' +
    '📚 `/quotedlyo` atau `/fakechat` - Bikin kutipan keren\n' + // Tambahkan alias
    '📖 `/styletext [text]` - Ubah gaya teks\n' +
    '🎵 `/ringtone [judul]` - Cari ringtone\n' +
    '🖼️ `/wikimedia [kata kunci]` - Cari gambar di Wikimedia\n' +
    '🤖 `/bk9ai [pertanyaan]` - Tanya ke BK9 AI\n' +
    '🌐 `/yousearch [pertanyaan]` - Cari di YourSearch.AI\n' +
    '💡 `/gptlogic [pertanyaan]` - Tanya ke GPT Logic\n' +
    '💾 `/savetube [url] [format]` - Download via SaveTube\n' +
    '👋 `/simi [pesan]` - Ngobrol dengan Simi\n' +
    '👳‍♂️ `/cekkhodam [nama]` - Cek khodam kamu\n' + // Tambahkan cekkhodam
    '🎮 `/mlstalk [id|zona id]` - Stalk user Mobile Legends\n' + // Tambahkan mlstalk
    '✨ `/hitamkan [filter]` - Ubah warna gambar jadi hitam\n' + // Tambahkan hitamkan
    '🕌 `/jadwalsholat [kota]` - Jadwal sholat\n' + // Pindahkan jadwalsholat
    '👥 `/tagall [pesan opsional]` - Tag semua admin di grup\\n' + // Tambahkan tagall
    '\n' +
    '┣━━━「 Donasi 」━━━┫\n' +
    '┃\n' +
    '💰 Dukung pengembangan bot ini biar makin mantap!\n' +
    '┃ • QRIS: [Scan QRIS]\n' +
    '┃ • Dana: 081234567890\n' +
    '┃ • Gopay: 081234567890\n' +
    '┃\n' +
    '📱 Contact: @pocketedition09\n' +
    '┃\n' +
    '┗━━━「 Stay Cool! 😎 」━━━┛',
    { ...options, parse_mode: 'Markdown' } // Gunakan Markdown untuk format tebal/link
  );
});

// Command /bantu (sama dengan /tes, bisa disatukan atau disinkronkan)
bot.onText(/\/bantu/, async (msg) => {
  const chatId = msg.chat.id;
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  bot.sendMessage(chatId,
    '┏━━━「 Daftar Perintah 」━━━┓\n' +
    '┃\n' +
    '┣━━━「 Perintah Dasar 」━━━┫\n' +
    '┃\n' +
    '📝 `/tes` - Sapa bot dan lihat fitur\n' +
    '🎨 `/generate [deskripsi]` - Buat gambar\n' +
    '🖼️ `/remini` - Bikin foto makin jernih\n' +
    '📸 `/toHD` - Enhance ke Ultra HD\n' +
    '🔍 `/upscale [2/4/6/8]` - Perbesar foto\n' +
    '💬 `/tanya [pertanyaan]` - Tanya AI\n' +
    '💻 `/ssweb [url]` - Ambil screenshot halaman web\n' + // Tambahkan ssweb
    '☀️ `/cuaca [kota]` - Cek cuaca\n' + // Tambahkan cuaca
    // Tambahkan perintah sticker, meme, dll. di sini nanti
    '✨ `/geminiai [pertanyaan]` - Tanya ke Gemini AI\n' + // Pindahkan Gemini AI ke sini
    '\n' +
    '┣━━━「 Download Media 」━━━┫\n' +
    '┃\n' +
    '🎵 `/ytmp3 [url]` - Download lagu YouTube\n' +
    '🎥 `/ytmp4 [url]` - Download video YouTube\n' +
    '📱 `/tiktok [url]` - Download video TikTok\n' +
    '📸 `/instagramdl [url]` - Download media dari Instagram\n' +
    '🎵 `/spotifydl [url]` - Download lagu dari Spotify\n' +
    '📁 `/mediafiredl [url]` - Download file dari MediaFire\n' +
     '🔗 `/alldl [url]` - Download media dari berbagai platform\n' + // Tambahkan alldl
    '\n' +
    '┣━━━「 Konversi Media 」━━━┫\n' +
    '┃\n' +
    '🎵 Balas audio/video dengan `/toaudio` - Ubah media jadi audio MP3\n' +
    '🎙️ Balas audio/video dengan `/toptt` - Ubah media jadi pesan suara (PTT)\n' +
    '▶️ Balas audio dengan `/tovideo` - Ubah audio jadi video (dengan background hitam)\n' +
    '\n' +
    '┣━━━「 Fitur Lainnya 」━━━┫\n' +
    '┃\n' +
    '🔍 `/google [pertanyaan]` - Web search\n' +
    '🤖 `/chatgpt [pertanyaan]` - Tanya ChatGPT\n' +
    '🏙️ `/wallpaper [kata kunci]` - Cari wallpaper\n' +
    '🍳 `/resep [makanan]` - Cari resep masakan\n' +
    '🎮 `/steam [nama game]` - Info game Steam\n' +
    '👤 `/instastalk [username]` - Stalk profil Instagram\n' +
    '👤 `/telegramstalk [username]` - Stalk profil Telegram\n' +
    '👤 `/tiktokstalk [username]` - Stalk profil TikTok\n' +
    '📊 `/genshinstalk [uid]` - Stalk profil Genshin Impact\n' +
    '📚 `/quotedlyo` atau `/fakechat` - Bikin kutipan keren\n' + // Tambahkan alias
    '📖 `/styletext [text]` - Ubah gaya teks\n' +
    '🎵 `/ringtone [judul]` - Cari ringtone\n' +
    '🖼️ `/wikimedia [kata kunci]` - Cari gambar di Wikimedia\n' +
    '🤖 `/bk9ai [pertanyaan]` - Tanya ke BK9 AI\n' +
    '🌐 `/yousearch [pertanyaan]` - Cari di YourSearch.AI\n' +
    '💡 `/gptlogic [pertanyaan]` - Tanya ke GPT Logic\n' +
    '💾 `/savetube [url] [format]` - Download via SaveTube\n' +
    '👋 `/simi [pesan]` - Ngobrol dengan Simi\n' +
     '👳‍♂️ `/cekkhodam [nama]` - Cek khodam kamu\n' + // Tambahkan cekkhodam
    '🎮 `/mlstalk [id|zona id]` - Stalk user Mobile Legends\n' + // Tambahkan mlstalk
    '✨ `/hitamkan [filter]` - Ubah warna gambar jadi hitam\n' + // Tambahkan hitamkan
    '🕌 `/jadwalsholat [kota]` - Jadwal sholat\n' + // Pindahkan jadwalsholat
    '👥 `/tagall [pesan opsional]` - Tag semua admin di grup\\n' + // Tambahkan tagall
    '\n' +
    '┣━━━「 Donasi 」━━━┫\n' +
    '┃\n' +
    '💰 Dukung pengembangan bot ini biar makin mantap!\n' +
    '┃ • QRIS: [Scan QRIS]\n' +
    '┃ • Dana: 081234567890\n' +
    '┃ • Gopay: 081234567890\n' +
    '┃\n' +
    '📱 Contact: @pocketedition09\n' +
    '┃\n' +
    '┗━━━「 Stay Cool! 😎 」━━━┛',
    { ...options, parse_mode: 'Markdown' } // Gunakan Markdown untuk format tebal/link
  );
});

// Command /generate
bot.onText(/\/generate(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match ? match[1] : null; // Capture the argument if it exists
  // Use reply_to_message_id if in a group
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  if (!prompt) {
    bot.sendMessage(chatId, '🖼️ Mohon masukkan deskripsi gambar setelah perintah /generate. Contoh: `/generate kucing lucu bermain bola`', options);
    return;
  }

  let processingMsg;
  try {
    // Kirim pesan "sedang memproses"
    processingMsg = await bot.sendMessage(chatId, '⏳ Bentar ya, lagi bikin gambar dari deskripsi lo pake OpenAI...', options); // Updated message

    // Generate gambar menggunakan OpenAI DALL-E
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1, // Number of images to generate
      size: "1024x1024", // Image size
    });

    const imageUrl = response.data[0].url; // Get the image URL from the response

    // Kirim gambar yang dihasilkan
    await bot.sendPhoto(chatId, imageUrl, {
      caption: `✨ Nih gambarnya, ${prompt}!`, ...options
    });

    // Hapus pesan "sedang memproses"
    bot.deleteMessage(chatId, processingMsg.message_id);
  } catch (error) {
    console.error('Error in /generate command (OpenAI):', error);
    // Check for specific OpenAI errors if needed
    if (error.response && error.response.status === 401) {
        bot.sendMessage(chatId, '⚠️ Waduh, API Key OpenAI lo kayaknya salah atau belum diset di file `.env`. Pastiin kunci API-nya bener ya!', options);
    } else if (error.response && error.response.status === 400) {
         // Handle specific DALL-E policy violations or content moderation errors
        bot.sendMessage(chatId, '🚫 Gagal bikin gambar. Mungkin deskripsi lo melanggar kebijakan konten OpenAI. Coba deskripsi lain ya!', options);
    }
    else {
      bot.sendMessage(chatId, `Yah, gagal nih bikin gambarnya pake OpenAI. Error: ${error.message} 😥`, options);
    }
  }
});

// Handler untuk perintah /tanya (menggunakan Google Gemini API)
bot.onText(/\/tanya(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const question = match ? match[1] : null; // Use user's input as the question, capture if exists
  // Use reply_to_message_id if in a group
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  if (!question) {
    bot.sendMessage(chatId, '💬 Mohon masukkan pertanyaan Anda setelah perintah /tanya. Contoh: `/tanya apa itu AI?`', options);
    return;
  }

  let processingMsg; // Declare processingMsg outside try block
  try {
    processingMsg = await bot.sendChatAction(chatId, 'typing', options); // Kirim status "mengetik"

    // Panggil API Gemini
    const apiKey = getNextApiKey(); // Get the next API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Menggunakan model Gemini 1.5 Flash

    const result = await model.generateContent(
      "Kamu adalah AI asisten Telegram bernama MannnDev AI Bot. Dan pembuat kamu MannnDevv. Jawab pertanyaan pengguna dengan santai, gaul, dan gunakan bahasa sehari-hari anak Gen Z. Selipkan emoji kalau cocok. Kalau bisa lo gue dan balas dengan menarik. Jangan terlalu formal ya!\n\n" + question
    );
    const response = result.response;
    const answer = response.text();

    // Kirim jawaban dari AI
    await bot.sendMessage(chatId, answer, options);
  } catch (error) {
    console.error('Error in /tanya command (Gemini):', error);
    bot.sendMessage(chatId, 'Waduh, ada error nih pas mau jawab pertanyaan lo pake AI. Coba tanya lagi ya! 😅', options);
  } finally {
       // Ensure processing message is deleted even if there's an error in try block
       if (processingMsg && processingMsg.message_id) {
          // Use bot.deleteMessage with chat ID and message ID
          bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
       }
  }
});

// Handler untuk perintah /google
bot.onText(/\/google(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match ? match[1] : null;
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  if (!query) {
    bot.sendMessage(chatId, '🔍 Mohon masukkan kata kunci pencarian setelah perintah /google. Contoh: `/google berita hari ini`', options);
    return;
  }

  try {
    const searchingMsg = await bot.sendMessage(chatId, `⏳ Oke, lagi nyari info tentang "${query}" nih...`, options);

    // Panggil google-sr
    const results = await search({ query: query });

    if (results.length > 0) {
      let replyText = `🔍 Hasil pencarian untuk "${query}":\n\n`;
      results.slice(0, 5).forEach((result, index) => { // Ambil 5 hasil teratas
        replyText += `${index + 1}. *${result.title}*\n`;
        replyText += `[Link](${result.link})\n`;
        replyText += `${result.description ? result.description + '\n' : ''}`;
        replyText += '\n';
      });
      bot.sendMessage(chatId, replyText, { parse_mode: 'Markdown', ...options });
    } else {
      bot.sendMessage(chatId, `Yah, maaf nih, gue nggak nemu hasil buat "${query}". Coba kata kunci lain deh! 😥`, options);
    }

    bot.deleteMessage(chatId, searchingMsg.message_id);

  } catch (error) {
    console.error('Error in /google command:', error);
    bot.sendMessage(chatId, 'Yah, gagal nih jalanin perintah /google. Coba lagi ya! 😥', options);
  }
});

// Command /jadwalsholat
bot.onText(/\/jadwalsholat(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const inputKota = match[1]; // This will be undefined if no city is provided
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  // Check if city name is provided
  if (!inputKota) {
    bot.sendMessage(chatId, 'Mohon masukkan nama kota. Contoh: `/jadwalsholat jakarta`', options);
    return;
  }

  // Split input into city and potentially country
  const parts = inputKota.split(',').map(part => part.trim());
  const kota = parts[0];
  const negara = parts[1] || ''; // Assume country is provided after a comma, or empty string if not

  async function jadwalSholatAPI(city, country = '') {
    try {
      // Construct API URL
      // Using current date to get today's prayer times
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // getMonth() is 0-indexed
      const day = today.getDate();

      // API endpoint: http://api.aladhan.com/v1/timingsByCity/:date?city=:city&country=:country&method=:method
      // Using method 11 for Kemenag Indonesia (assuming this is appropriate, can be changed)
      let apiUrl = `http://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${encodeURIComponent(city)}`;

      // If country is not provided by the user, default to 'Indonesia'
      const targetCountry = country || 'indonesia';
      apiUrl += `&country=${encodeURIComponent(targetCountry)}`;

      apiUrl += `&method=11`; // Kemenag Indonesia method

      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.code === 200 && data.status === 'OK') {
        // API response structure has timings in data.data.timings
        const timings = data.data.timings;
        return {
          subuh: timings.Fajr,
          duha: timings.Dhuhr, // Note: API provides Dhuhr, not specifically Dhuha. Common convention uses Dhuhr.
          zuhur: timings.Dhuhr,
          asar: timings.Asr,
          magrib: timings.Maghrib,
          isya: timings.Isha
        };
      } else {
        throw new Error(data.status || "Gagal mendapatkan data dari API");
      }
    } catch (error) {
      console.error('Error fetching prayer times from API:', error);
      // Provide a more user-friendly error message if API call fails
      if (error.response && error.response.status === 404) {
          throw new Error("Nama kota atau negara tidak ditemukan.");
      } else {
         throw new Error("Gagal mengambil data jadwal sholat dari API. Coba lagi nanti.");
      }
    }
  }

  try {
    // Call the new API function
    const jadwal = await jadwalSholatAPI(kota, negara);

    // The API response should be consistent, so simplified check here
    if (!jadwal || !jadwal.subuh || !jadwal.zuhur || !jadwal.asar || !jadwal.magrib || !jadwal.isya) {
       throw new Error("Data jadwal sholat tidak lengkap dari API.");
    }

    const caption = `
┌「 Jadwal Sholat ${kota.toUpperCase()}${negara ? ', ' + negara.toUpperCase() : ''} 」
├ Subuh: ${jadwal.subuh}
├ Dzuhur: ${jadwal.zuhur}
├ Ashar: ${jadwal.asar}
├ Maghrib: ${jadwal.maghrib}
├ Isya: ${jadwal.isya}
└──────────`.trim(); // Removed Dhuha as API provides Dhuhr

    // Using bot.sendMessage for text reply
    bot.sendMessage(chatId, caption, options);

  } catch (error) {
    console.error('Error in /jadwalsholat command:', error);
    bot.sendMessage(chatId, `Gagal mendapatkan jadwal sholat: ${error.message} 😥`, options);
  }
});

// Command /upscale
bot.onText(/\/upscale(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};
  const upscaleFactorInput = match[1]; // Capture the number after /upscale

  if (!msg.reply_to_message) {
    bot.sendMessage(chatId, '⚠️ Perintah /upscale harus digunakan dengan membalas foto atau dokumen gambar.', options);
    return;
  }

  const repliedMsg = msg.reply_to_message;
  const photo = repliedMsg.photo;
  const document = repliedMsg.document;

  if (!photo && !document) {
    bot.sendMessage(chatId, '⚠️ Pesan yang kamu balas bukan foto atau dokumen gambar.', options);
    return;
  }

  let fileId, originalFileName;
  if (photo) {
    fileId = photo[photo.length - 1].file_id;
    originalFileName = 'photo';
  } else if (document) {
    // Check if the document is likely an image by mime type or filename
    if (!document.mime_type || !document.mime_type.startsWith('image/')) {
      bot.sendMessage(chatId, '⚠️ Dokumen yang kamu balas sepertinya bukan format gambar yang didukung untuk upscale.', options);
      return;
    }
    fileId = document.file_id;
    originalFileName = document.file_name || 'document_image';
  }

  // Validate upscale factor
  const allowedFactors = [2, 4, 6, 8];
  let upscaleFactor = 2; // Default to 2x if not specified

  if (upscaleFactorInput) {
    const factor = parseInt(upscaleFactorInput, 10);
    if (allowedFactors.includes(factor)) {
      upscaleFactor = factor;
    } else {
      bot.sendMessage(chatId, `⚠️ Faktor upscale tidak valid. Gunakan salah satu: ${allowedFactors.join(', ')}. Contoh: \`/upscale 4\` (akan menggunakan 4x)`, options);
      return;
    }
  }

  try {
    const processingMsg = await bot.sendMessage(chatId, `⏳ Oke, gambar lagi gue upscale ${upscaleFactor}x nih...`, options);

    // Download the file
    const file = await bot.getFile(fileId);
    const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    const imageResponse = await axios.get(fileLink, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Get original image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;

    // Calculate target dimensions
    const targetWidth = Math.round(originalWidth * upscaleFactor);
    const targetHeight = Math.round(originalHeight * upscaleFactor);

    // Progressive upscaling for better quality
    let currentBuffer = imageBuffer;
    let currentFactor = 1;

    // For factors > 4, we'll do progressive upscaling
    if (upscaleFactor > 4) {
      // First upscale to 4x
      currentBuffer = await sharp(currentBuffer)
        .resize({
          width: Math.round(originalWidth * 4),
          height: Math.round(originalHeight * 4),
          fit: 'fill',
          kernel: 'lanczos3'
        })
        .png({ quality: 100 })
        .toBuffer();
      currentFactor = 4;

      // Then upscale to final size if needed
      if (upscaleFactor > 4) {
        currentBuffer = await sharp(currentBuffer)
          .resize({
            width: targetWidth,
            height: targetHeight,
            fit: 'fill',
            kernel: 'lanczos3'
          })
          .png({ quality: 100 })
          .toBuffer();
      }
    } else {
      // Direct upscaling for 2x and 4x
      currentBuffer = await sharp(currentBuffer)
        .resize({
          width: targetWidth,
          height: targetHeight,
          fit: 'fill',
          kernel: 'lanczos3'
        })
        .png({ quality: 100 })
        .toBuffer();
    }

    // Send the upscaled image back as a document
    await bot.sendDocument(chatId, currentBuffer, {
      caption: `✨ Gambar berhasil di-upscale ${upscaleFactor}x!\n\n` +
               `📏 Ukuran asli: ${originalWidth}x${originalHeight}\n` +
               `📏 Ukuran baru: ${targetWidth}x${targetHeight}`,
      filename: `upscaled_${upscaleFactor}x_${originalFileName}`,
      ...options
    });

    bot.deleteMessage(chatId, processingMsg.message_id);

  } catch (error) {
    console.error('Error in /upscale command:', error);
    bot.sendMessage(chatId, `Yah, gagal nih upscale gambarnya. Error: ${error.message} 😥`, options);
  }
});

// Command /chatgpt
bot.onText(/\/chatgpt(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match ? match[1] : null;
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  if (!query) {
    bot.sendMessage(chatId, '🤖 Mohon masukkan pertanyaan Anda setelah perintah /chatgpt. Contoh: `/chatgpt jelaskan tentang black hole`', options);
    return;
  }

  try {
    const processingMsg = await bot.sendMessage(chatId, '🤔 Sedang berpikir...', options);
    const response = await chatGpt(query);
    await bot.sendMessage(chatId, response, options);
    bot.deleteMessage(chatId, processingMsg.message_id);
  } catch (error) {
    console.error('Error in chatgpt:', error);
    bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat memproses permintaan.', options);
  }
});

// Command /tiktok
bot.onText(/\/tiktok(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match ? match[1] : null;
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  if (!url) {
    bot.sendMessage(chatId, '📱 Mohon masukkan URL video TikTok setelah perintah /tiktok. Contoh: `/tiktok [url_video_tiktok]`', options);
    return;
  }

  try {
    const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengunduh video TikTok...', options);

    const result = await tiktokDlApi(url);

    if (result.data && result.data.length > 0) {
      for (const item of result.data) {
        if (item.type === 'photo') {
          await bot.sendPhoto(chatId, item.url, {
            caption: `📸 ${result.title}\n\n👤 Author: ${result.author.nickname}\n❤️ Likes: ${result.stats.likes}\n👁️ Views: ${result.stats.views}`,
            ...options
          });
        } else {
          await bot.sendVideo(chatId, item.url, {
            caption: `🎥 ${result.title}\n\n👤 Author: ${result.author.nickname}\n❤️ Likes: ${result.stats.likes}\n👁️ Views: ${result.stats.views}`,
            ...options
          });
        }
      }
    }
    bot.deleteMessage(chatId, processingMsg.message_id);
  } catch (error) {
    console.error('Error in tiktok:', error);
    bot.sendMessage(chatId, 'Maaf, tidak dapat mengunduh video TikTok.', options);
  }
});

// Command /ytmp4
bot.onText(/\/ytmp4(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match ? match[1] : null;
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  if (!url) {
    bot.sendMessage(chatId, '🎥 Mohon masukkan URL video YouTube setelah perintah /ytmp4. Contoh: `/ytmp4 [url_video_youtube]`', options);
    return;
  }

  try {
    const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengunduh video YouTube...', options);

    // ytMp4 now returns an object with title, result (Buffer), channel, views, likes, size
    const result = await ytMp4(url);

    // Options specifically for sendVideo
    const videoOptions = {
      caption: `🎥 ${result.title}\n\n👤 Channel: ${result.channel}\n👁️ Views: ${result.views}\n❤️ Likes: ${result.likes}\n💾 Size: ${result.size || 'N/A'}`,
      filename: `${result.title || 'video'}.mp4`, // Add filename option
      contentType: 'video/mp4', // Explicitly set content type
      supports_streaming: true,
      // Include reply_to_message_id if it's a group chat
      ...(msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {})
    };

    // Send the video using the buffer, with specific video options
    await bot.sendVideo(chatId, result.result, videoOptions); // Use videoOptions

    bot.deleteMessage(chatId, processingMsg.message_id);
  } catch (error) {
    console.error('Error in ytmp4:', error);
    // Check if the error is due to ffmpeg not being installed (from apiFunctions)
    if (error.message && error.message.includes('FFmpeg dibutuhkan')) {
         bot.sendMessage(chatId, `⚠️ ${error.message}`, options);
    } else if (error.message && error.message.includes('tidak ada format')) {
         bot.sendMessage(chatId, `⚠️ ${error.message}`, options);
    }
    else {
        bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh video YouTube.', options);
    }
  }
});

// Command /ytmp3
bot.onText(/\/ytmp3(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match ? match[1] : null;
  const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

  if (!url) {
    bot.sendMessage(chatId, '🎵 Mohon masukkan URL video YouTube setelah perintah /ytmp3. Contoh: `/ytmp3 [url_video_youtube]`', options);
    return;
  }

  try {
    const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengunduh audio YouTube...', options);
    const result = await ytMp3(url);

    // Check if a suitable audio result was found
    if (result && result.result && result.size) {
      await bot.sendAudio(chatId, result.result, {
        title: result.title,
        performer: result.channel,
        caption: `🎵 ${result.title}\n\n👤 Channel: ${result.channel}\n💾 Size: ${result.size}`,
        ...options
      });
    } else {
      // If no suitable audio was found after processing
      bot.sendMessage(chatId, 'Yah, maaf nih, gak nemu format audio MP3 yang cocok buat video itu. Coba video lain deh! 😥', options);
    }

    bot.deleteMessage(chatId, processingMsg.message_id);
  } catch (error) {
    console.error('Error in ytmp3 handler:', error);
    // Send a more specific error message to the user
    bot.sendMessage(chatId, `Yah, gagal nih mengunduh audio YouTube. Error: ${error.message} 😥`, options);
  }
}); // Correct closing for ytmp3 handler

  // Command /simi
  bot.onText(/\/simi(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🤔 Mohon masukkan pesan yang ingin Anda kirim ke Simi setelah perintah /simi. Contoh: `/simi hai`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '🤔 Sedang berpikir...', options);
      const response = await simiApi(query);
      await bot.sendMessage(chatId, response, options);
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in simi:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat memproses permintaan.', options);
    }
  }); // Closing the quotedlyo handler

  // Command /mediafire
  bot.onText(/\/mediafire(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!url) {
      bot.sendMessage(chatId, '📁 Mohon masukkan URL MediaFire setelah perintah /mediafire. Contoh: `/mediafire [url_mediafire]`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang memeriksa file MediaFire...', options);
      const result = await mediafireDlApi(url);

      if (result && result.length > 0) {
        const file = result[0];
        await bot.sendMessage(chatId,
          `📁 File Info:\n\n` +
          `📝 Name: ${file.name}\n` +
          `📦 Type: ${file.type}\n` +
          `💾 Size: ${file.size}\n\n` +
          `🔗 Download: ${file.link}`,
          options
        );
      }
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in mediafire:', error);
      bot.sendMessage(chatId, 'Maaf, tidak dapat mengakses file MediaFire.', options);
    }
  });

  // Command /toHD (gabungan remini dan upscale)
  bot.onText(/\/toHD/, async (msg) => {
    const chatId = msg.chat.id;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!msg.reply_to_message) {
      bot.sendMessage(chatId, '⚠️ Mau nge-HD-in gambar yang mana nih? Balas foto atau dokumen gambar yang mau kamu proses ya!', options); // Pesan Gen Z
      return;
    }

    const repliedMsg = msg.reply_to_message;
    const photo = repliedMsg.photo;
    const document = repliedMsg.document;

    if (!photo && !document) {
      bot.sendMessage(chatId, '⚠️ Pesan yang kamu balas kayaknya bukan foto atau dokumen gambar deh. Gak bisa diproses jadi HD nih. 😥', options); // Pesan Gen Z
      return;
    }

    let fileId, originalFileName;
    if (photo) {
      fileId = photo[photo.length - 1].file_id;
      originalFileName = 'photo';
    } else if (document) {
      // Check if the document is likely an image by mime type or filename
      if (!document.mime_type || !document.mime_type.startsWith('image/')) {
        bot.sendMessage(chatId, '⚠️ Dokumen yang kamu balas sepertinya bukan format gambar yang didukung buat di-HD-in.', options); // Pesan Gen Z
        return;
      }
      fileId = document.file_id;
      originalFileName = document.file_name || 'photo';
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '⏳ Oke, gambar lagi gue proses jadi Ultra HD nih (dijernihin + dibesarin)... Sabar ya, ini butuh waktu! 💪', options); // Pesan Gen Z

      // 1. Download the file
      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      let imageBuffer = Buffer.from(response.data);

      // 2. Process with Remini (Enhancement)
      const enhancedFileBuffer = await remini(imageBuffer, 'enhance'); // Menggunakan tipe 'enhance' bawaan

      // 3. Upscale the enhanced image (using sharp) - Default 4x
      const upscaleFactor = 4; // Set default upscale factor to 4x

      // Get original enhanced image metadata
      const metadata = await sharp(enhancedFileBuffer).metadata();
      const originalWidth = metadata.width;
      const originalHeight = metadata.height;

      // Calculate target dimensions
      const targetWidth = Math.round(originalWidth * upscaleFactor);
      const targetHeight = Math.round(originalHeight * upscaleFactor);

      // Perform the upscaling
      const upscaledImageBuffer = await sharp(enhancedFileBuffer)
        .resize({
          width: targetWidth,
          height: targetHeight,
          fit: 'fill', // or 'contain', 'cover', etc. based on desired behavior
          kernel: 'lanczos3' // Good kernel for upscaling
        })
        .jpeg({ quality: 90 }) // Save as JPEG with quality 90
        .toBuffer();

      // 4. Send the processed image back as a document
      // Check if the file size exceeds Telegram's limit (50MB for documents)
      const telegramDocLimit = 50 * 1024 * 1024; // 50 MB in bytes
      if (upscaledImageBuffer.length > telegramDocLimit) {
          bot.sendMessage(chatId, '❗ Aduh, hasil gambar Ultra HD-nya kegedean nih (' + bytesToSize(upscaledImageBuffer.length) + '). Ukuran file maksimal Telegram buat dokumen itu 50MB. Gak bisa dikirim langsung. 😥', options);
      } else {
          await bot.sendDocument(chatId, upscaledImageBuffer, {
            caption: `✨ Tadaaa! Gambar lo udah jadi Ultra HD nih!\n\n` + // Pesan Gen Z
                     `📏 Ukuran asli (setelah enhance): ${originalWidth}x${originalHeight}\n` +
                     `📏 Ukuran baru (${upscaleFactor}x): ${targetWidth}x${targetHeight}`,
            filename: `ultrahd_${originalFileName}.jpg`, // Save as JPG after sharp processing
            ...options
          });
      }

      bot.deleteMessage(chatId, processingMsg.message_id);

    } catch (error) {
      console.error('Error processing media with /toHD:', error);
      bot.sendMessage(chatId, `Yah, gagal nih bikin gambar lo jadi Ultra HD. Error: ${error.message} 😥`, options); // Pesan Gen Z
    }
  });

  // Command /wallpaper
  bot.onText(/\/wallpaper(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🖼️ Mohon masukkan kata kunci wallpaper setelah perintah /wallpaper. Contoh: `/wallpaper pemandangan alam`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Mencari wallpaper...', options);
      const wallpapers = await wallpaperApi(query);

      if (wallpapers && wallpapers.length > 0) {
        // Send first 5 wallpapers
        for (let i = 0; i < Math.min(5, wallpapers.length); i++) {
          const wall = wallpapers[i];
          await bot.sendPhoto(chatId, wall.url, {
            caption: `🖼️ ${query}\n\n📏 Resolution: ${wall.width}x${wall.height}\n🏷️ Category: ${wall.category}`,
            ...options
          });
        }
      } else {
        bot.sendMessage(chatId, 'Maaf, tidak ada wallpaper yang ditemukan.', options);
      }

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in wallpaper:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari wallpaper.', options);
    }
  });

  // Command /resep
  bot.onText(/\/resep(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🍳 Mohon masukkan nama makanan yang ingin dicari resepnya setelah perintah /resep. Contoh: `/resep nasi goreng`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Mencari resep...', options);
      const recipes = await cariresep(query);

      if (recipes && recipes.length > 0) {
        let message = `🍳 Hasil pencarian resep "${query}":\n\n`;
        recipes.slice(0, 5).forEach((recipe, index) => {
          message += `${index + 1}. ${recipe.title}\n`;
          message += `   ⏱️ Durasi: ${recipe.times}\n`;
          message += `   👥 Porsi: ${recipe.servings}\n`;
          message += `   🔗 Detail: /detailresep_${recipe.key}\n\n`;
        });

        bot.sendMessage(chatId, message, options);
      } else {
        bot.sendMessage(chatId, 'Maaf, tidak ada resep yang ditemukan.', options);
      }

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in resep:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari resep.', options);
    }
  });

  // Command /detailresep
  bot.onText(/\/detailresep_(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const key = match[1];
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Mengambil detail resep...', options);
      const recipe = await detailresep(key);

      if (recipe) {
        let message = `🍳 ${recipe.title}\n\n`;
        message += `⏱️ Durasi: ${recipe.times}\n`;
        message += `👥 Porsi: ${recipe.servings}\n`;
        message += `📝 Deskripsi: ${recipe.desc}\n\n`;

        message += `📋 Bahan-bahan:\n`;
        recipe.ingredient.forEach((item, index) => {
          message += `${index + 1}. ${item}\n`;
        });

        message += `\n📝 Langkah-langkah:\n`;
        recipe.step.forEach((step, index) => {
          message += `${index + 1}. ${step}\n`;
        });

        if (recipe.thumb) {
          await bot.sendPhoto(chatId, recipe.thumb, { caption: message, ...options });
        } else {
          bot.sendMessage(chatId, message, options);
        }
      } else {
        bot.sendMessage(chatId, 'Maaf, detail resep tidak ditemukan.', options);
      }

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in detailresep:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengambil detail resep.', options);
    }
  });

  // Command /steam
  bot.onText(/\/steam(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🎮 Mohon masukkan nama game yang ingin dicari di Steam setelah perintah /steam. Contoh: `/steam Elden Ring`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Mencari game di Steam...', options);
      const games = await Steam(query);

      if (games && games.length > 0) {
        let message = `🎮 Hasil pencarian game "${query}":\n\n`;
        games.slice(0, 5).forEach((game, index) => {
          message += `${index + 1}. ${game.name}\n`;
          message += `   💰 Harga: ${game.price ? game.price.final_formatted : 'Free'}\n`;
          message += `   🔗 Detail: /steamdetail_${game.id}\n\n`;
        });

        bot.sendMessage(chatId, message, options);
      } else {
        bot.sendMessage(chatId, 'Maaf, tidak ada game yang ditemukan.', options);
      }

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in steam:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari game.', options);
    }
  });

  // Command /facebookdl
  bot.onText(/\/facebookdl(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!url) {
      bot.sendMessage(chatId, '🔗 Mohon masukkan URL video Facebook setelah perintah /facebookdl. Contoh: `/facebookdl [url_video_facebook]`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengunduh video Facebook...', options);

      const result = await facebookDlApi(url);

      if (result && result.results && result.results.length > 0) {
        const videoUrl = result.results[0].url; // Ambil URL kualitas pertama (misal HD/SD)
        await bot.sendVideo(chatId, videoUrl, {
          caption: `🎥 Video Facebook berhasil diunduh!\n${result.caption ? '\nCaption: ' + result.caption : ''}`, ...options
        });
      } else {
        bot.sendMessage(chatId, 'Maaf, tidak dapat mengunduh video Facebook dari URL tersebut.', options);
      }
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in facebookdl:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh video Facebook.', options);
    }
  });

  // Command /instadl
  bot.onText(/\/instadl(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!url) {
      bot.sendMessage(chatId, '📸 Mohon masukkan URL media Instagram setelah perintah /instadl. Contoh: `/instadl [url_instagram]`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengunduh media Instagram...', options);

      const results = await instaDl(url);

      if (results && results.length > 0) {
        for (const item of results) {
          // Assume instaDl returns objects with a 'url' property
          if (item.url) {
             // Attempt to determine if it's an image or video by URL (simple check)
             if (item.url.includes('.mp4')) {
                await bot.sendVideo(chatId, item.url, options);
             } else {
                await bot.sendPhoto(chatId, item.url, options);
             }
          } else {
              console.warn('Skipping item with no URL:', item);
          }
        }
      } else {
        bot.sendMessage(chatId, 'Maaf, tidak dapat mengunduh media Instagram dari URL tersebut.', options);
      }
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in instadl:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh media Instagram.', options);
    }
  });

  // Command /instadownload
  bot.onText(/\/instadownload(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!url) {
      bot.sendMessage(chatId, '📸 Mohon masukkan URL media Instagram setelah perintah /instadownload. Contoh: `/instadownload [url_instagram]`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengunduh media Instagram...', options);

      const results = await instaDownload(url);

      if (results && results.length > 0) {
        for (const item of results) {
          // Assume instaDownload returns objects with a 'download' property
          if (item.download) {
             // Attempt to determine if it's an image or video by URL (simple check)
             if (item.download.includes('.mp4')) {
                await bot.sendVideo(chatId, item.download, {
                   caption: item.caption || 'Media Instagram',
                   ...options
                });
             } else {
                await bot.sendPhoto(chatId, item.download, {
                   caption: item.caption || 'Media Instagram',
                   ...options
                });
             }
          } else {
              console.warn('Skipping item with no download URL:', item);
          }
        }
      } else {
        bot.sendMessage(chatId, 'Maaf, tidak dapat mengunduh media Instagram dari URL tersebut.', options);
      }
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in instadownload:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh media Instagram.', options);
    }
  });

  // Command /instastory
  bot.onText(/\/instastory(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!username) {
      bot.sendMessage(chatId, '📸 Mohon masukkan username Instagram setelah perintah /instastory. Contoh: `/instastory username_target`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang mengambil story Instagram dari ${username}...`, options);

      const result = await instaStoryApi(username);

      if (result && result.results && result.results.length > 0) {
        for (const item of result.results) {
          if (item.type === 'video') {
            await bot.sendVideo(chatId, item.url, { caption: `Story dari ${result.username}`, ...options });
          } else if (item.type === 'image') {
            await bot.sendPhoto(chatId, item.url, { caption: `Story dari ${result.username}`, ...options });
          }
        }
      } else {
        bot.sendMessage(chatId, `Maaf, tidak ada story yang ditemukan untuk username ${username}.`, options);
      }
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in instastory:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengambil story Instagram.', options);
    }
  });

  // Command /alldl
  bot.onText(/\/alldl(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!url) {
      bot.sendMessage(chatId, '🔗 Mohon masukkan URL media (YouTube, TikTok, dll.) setelah perintah /alldl. Contoh: `/alldl [url]`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengunduh media...', options);

      const result = await allDl(url);

      // Check the result structure based on Cobalt API response
      if (result && result.status === 'success') {
        if (result.url) {
          // Direct URL (for single media)
          if (result.url.includes('.mp4')) {
             await bot.sendVideo(chatId, result.url, options);
          } else if (result.url.includes('.mp3')) {
             await bot.sendAudio(chatId, result.url, options);
          } else {
             await bot.sendPhoto(chatId, result.url, options);
          }
        } else if (result.urls && result.urls.length > 0) {
          // Array of URLs (for multiple media like albums/galleries)
          for (const mediaUrl of result.urls) {
             if (mediaUrl.includes('.mp4')) {
                await bot.sendVideo(chatId, mediaUrl, options);
             } else if (mediaUrl.includes('.mp3')) {
                await bot.sendAudio(chatId, mediaUrl, options);
             } else {
                await bot.sendPhoto(chatId, mediaUrl, options);
             }
          }
        } else {
           bot.sendMessage(chatId, 'Maaf, tidak dapat mengunduh media dari URL tersebut.', options);
        }
      } else if (result && result.status === 'redirect') {
          // Handle redirect, send the new URL
          bot.sendMessage(chatId, `🔗 Media siap diunduh: ${result.url}`, options);
      } else if (result && result.text) {
          // Handle text response (e.g., error message from API)
          bot.sendMessage(chatId, `ℹ️ Informasi dari pengunduh: ${result.text}`, options);
      }
       else {
        bot.sendMessage(chatId, 'Maaf, tidak dapat mengunduh media dari URL tersebut.', options);
      }
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in alldl:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh media.', options);
    }
  });

  // Command /cekkhodam
  bot.onText(/\/cekkhodam(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!name) {
      // Use the user's name if no name is provided
      const userName = msg.from.first_name || msg.from.username || 'Anda';
      try {
        const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang mengecek khodam ${userName}...`, options);
        const khodamResult = await cekKhodam(userName);
        bot.sendMessage(chatId, `✨ Khodam ${userName} adalah: ${khodamResult}`, options);
        bot.deleteMessage(chatId, processingMsg.message_id);
      } catch (error) {
         console.error('Error in cekkhodam (no name):', error);
         bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengecek khododam.', options);
      }
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang mengecek khodam ${name}...`, options);
      const khodamResult = await cekKhodam(name);
      bot.sendMessage(chatId, `✨ Khodam ${name} adalah: ${khodamResult}`, options);
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in cekkhodam:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengecek khodam.', options);
    }
  });

  // Command /mlstalk
  bot.onText(/\/mlstalk(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match ? match[1] : null; // Capture the argument if it exists
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!text || !text.includes('|')) {
      bot.sendMessage(chatId, 'Contoh penggunaan:\\n`/mlstalk id|zona id`\\n\nEx.\\n`/mlstalk 157228049|2241`', options);
      return;
    }

    const [id, zoneId] = text.split('|');

    try {
      const processingMsg = await bot.sendMessage(chatId, '⏳ Mencari info user Mobile Legends...', options);

      const { userName } = await mlstalk(id.trim(), zoneId.trim()).catch(async _ => {
        bot.deleteMessage(chatId, processingMsg.message_id);
        throw new Error("User tidak ditemukan"); // Throw error to be caught by outer catch
      });

      const vf = `*MOBILE LEGENDS STALK*\n\n*ID: ${id.trim()}*\n*ZONA ID: ${zoneId.trim()}*\n*Username: ${userName ? userName : "Kosong"}*`;

      bot.sendMessage(chatId, vf, { ...options, parse_mode: 'Markdown' });
      bot.deleteMessage(chatId, processingMsg.message_id);

    } catch (error) {
      console.error('Error:', error);
      if (error.message === "User tidak ditemukan") {
         bot.sendMessage(chatId, "User tidak ditemukan", options);
      } else {
         bot.sendMessage(chatId, 'Yah, gagal nih mencari info user Mobile Legends. Coba lagi nanti ya!', options);
      }
    }
  });

  // Command /hitamkan
  bot.onText(/\/hitamkan(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const filter = match ? match[1] : 'coklat'; // Default filter is 'coklat'
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!msg.reply_to_message) {
      bot.sendMessage(chatId, '⚠️ Perintah /hitamkan harus digunakan dengan membalas foto atau dokumen gambar.', options);
      return;
    }

    const repliedMsg = msg.reply_to_message;
    const photo = repliedMsg.photo;
    const document = repliedMsg.document;

    if (!photo && !document) {
      bot.sendMessage(chatId, '⚠️ Pesan yang kamu balas bukan foto atau dokumen gambar.', options);
      return;
    }

    let fileId, originalFileName;
    if (photo) {
      fileId = photo[photo.length - 1].file_id;
      originalFileName = 'photo';
    } else if (document) {
      // Check if the document is likely an image by mime type or filename
      if (!document.mime_type || !document.mime_type.startsWith('image/')) {
        bot.sendMessage(chatId, '⚠️ Dokumen yang kamu balas sepertinya bukan format gambar yang didukung.', options);
        return;
      }
      fileId = document.file_id;
      originalFileName = document.file_name || 'document_image';
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang memproses gambar dengan filter '${filter}'...`, options);

      // Download the file
      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      // Process with hitamkan
      const processedImageBuffer = await hitamkan(imageBuffer, filter);

      // Send the processed image back as a document
      await bot.sendDocument(chatId, processedImageBuffer, {
        caption: `✨ Gambar berhasil diproses dengan filter '${filter}'!`, // Updated caption
        filename: `hitamkan_${filter}_${originalFileName}`, // Include filter in filename
        ...options
      });

      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in hitamkan:', error);
      bot.sendMessage(chatId, `Yah, gagal nih memproses gambar dengan filter '${filter}'. Error: ${error.message} 😥`, options);
    }
  });

  // Command /nvlgroup
  bot.onText(/\/nvlgroup(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🤖 Mohon masukkan pertanyaan atau perintah untuk NvlGroup setelah perintah /nvlgroup. Contoh: `/nvlgroup informasi terbaru`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '🤔 Sedang memproses dengan NvlGroup...', options);

      const response = await NvlGroup(query);

      if (response) {
        bot.sendMessage(chatId, response, options);
      } else {
         bot.sendMessage(chatId, 'Maaf, tidak ada respons dari NvlGroup.', options);
      }
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in nvlgroup:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat memproses permintaan dengan NvlGroup.', options);
    }
  });

  // Command /yanzgpt
  bot.onText(/\/yanzgpt(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🤖 Mohon masukkan pertanyaan Anda setelah perintah /yanzgpt. Contoh: `/yanzgpt siapa kamu?`', options);
      return;
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, '🤔 Sedang berpikir dengan YanzGpt...', options);

      // yanzGpt in apiFunctions.js expects just the query string
      const response = await yanzGpt(query);

      if (response) {
        bot.sendMessage(chatId, response, options);
      } else {
         bot.sendMessage(chatId, 'Maaf, tidak ada respons dari YanzGpt.', options);
      }
      bot.deleteMessage(chatId, processingMsg.message_id);
    } catch (error) {
      console.error('Error in yanzgpt:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat memproses permintaan dengan YanzGpt.', options);
    }
  });

  // Command /gptlogic
  bot.onText(/\/gptlogic(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🤖 Mohon masukkan pertanyaan Anda setelah perintah /gptlogic. Contoh: `/gptlogic apa itu gravitasi?`', options);
      return;
    }

    let processingMsg; // Declare processingMsg outside try block
    try {
      processingMsg = await bot.sendMessage(chatId, '🤔 Sedang berpikir dengan GptLogic...', options);

      // gptLogic function expects messages array and prompt string
      // For a basic handler, we can pass an empty messages array
      const response = await gptLogic([], query);

      // The response structure from chateverywhere.app/api/chat is likely an object
      // Let's try to access the text content
      const answer = response?.choices?.[0]?.message?.content || response?.text || 'Maaf, saya tidak mengerti.';

      bot.sendMessage(chatId, answer, options);

    } catch (error) {
      console.error('Error in gptlogic:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat memproses permintaan dengan GptLogic.', options);
    } finally {
         // Ensure processing message is deleted even if there's an error in try block
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id);
         }
    }
  });

  // Command /geminiai
  bot.onText(/\/geminiai(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const question = match ? match[1] : null; // Use user's input as the question, capture if exists
    // Use reply_to_message_id if in a group
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!question) {
      bot.sendMessage(chatId, '🤖 Mohon masukkan pertanyaan Anda setelah perintah /geminiai. Contoh: `/geminiai apa itu AI?`', options);
      return;
    }

    let processingMsg; // Declare processingMsg outside try block
    try {
      processingMsg = await bot.sendChatAction(chatId, 'typing', options); // Kirim status "mengetik"

      const lowerCaseQuestion = question.toLowerCase();
      const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayDay = daysOfWeek[today.getDay()];
      const todayDate = today.getDate();
      const todayMonth = months[today.getMonth()];
      const todayYear = today.getFullYear();

      const tomorrowDay = daysOfWeek[tomorrow.getDay()];
      const tomorrowDate = tomorrow.getDate();
      const tomorrowMonth = months[tomorrow.getMonth()];
      const tomorrowYear = tomorrow.getFullYear();

      // Check for specific date-related questions
      if (lowerCaseQuestion.includes('besok hari apa')) {
        await bot.sendMessage(chatId, `Besok adalah hari **${tomorrowDay}, ${tomorrowDate} ${tomorrowMonth} ${tomorrowYear}**.`, { ...options, parse_mode: 'Markdown' });
      } else if (lowerCaseQuestion.includes('hari ini hari apa')) {
        await bot.sendMessage(chatId, `Hari ini adalah hari **${todayDay}, ${todayDate} ${todayMonth} ${todayYear}**.`, { ...options, parse_mode: 'Markdown' });
      } else {
        // Panggil API Gemini for other questions
        const apiKey = getNextApiKey(); // Get the next API key
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Menggunakan model Gemini 1.5 Flash
        // Add context to the prompt for Gemini
        const fullPrompt = `Kamu adalah AI asisten Telegram bernama MannnDev AI Bot. Dan pembuat kamu MannnDev. Jawab pertanyaan pengguna dengan santai, gaul, dan gunakan bahasa sehari-hari anak Gen Z. Selipkan emoji kalau cocok. Kalau bisa lo gue dan balas dengan menarik. Jangan terlalu formal ya!\n\n${question}`;
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const answer = response.text();

        // Kirim jawaban dari AI
        await bot.sendMessage(chatId, answer, options);
      }

    } catch (error) {
      console.error('Error in /geminiai command:', error);
      bot.sendMessage(chatId, 'Waduh, ada error nih pas mau jawab pertanyaan lo pake Gemini AI. Coba tanya lagi ya! 😅', options);
    } finally {
         // Ensure processing message is deleted even if there's an error in try block
         if (processingMsg && processingMsg.message_id) {
            // Use bot.deleteMessage with chat ID and message ID
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /pinterest
  bot.onText(/\/pinterest(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🖼️ Mohon masukkan kata kunci pencarian Pinterest setelah perintah /pinterest. Contoh: `/pinterest kucing lucu`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Mencari gambar di Pinterest untuk "${query}"...`, options);

      const results = await pinterest(query);

      if (results && results.length > 0) {
        // Send the first few results (e.g., 5) to avoid flooding
        for (let i = 0; i < Math.min(5, results.length); i++) {
          const item = results[i];
          // Assuming the result object has 'images_url' and 'grid_title' properties
          if (item.images_url) {
            await bot.sendPhoto(chatId, item.images_url, {
              caption: `🖼️ ${item.grid_title || query}\n🔗 Sumber: ${item.pin || 'N/A'}`, // Include title and Pinterest link
              ...options
            });
          } else {
              console.warn('Skipping Pinterest item with no image URL:', item);
          }
        }
        if (results.length > 5) {
             bot.sendMessage(chatId, 'Menampilkan 5 hasil teratas.', options);
        }
      } else {
        bot.sendMessage(chatId, 'Maaf, tidak ada gambar yang ditemukan di Pinterest untuk kata kunci tersebut.', options);
      }

    } catch (error) {
      console.error('Error in pinterest:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari gambar di Pinterest.', options);
    } finally {
         // Ensure processing message is deleted
         if (processingMsg && processingMsg.message_id) {
            // Use bot.deleteMessage with chat ID and message ID
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /instastalk
  bot.onText(/\/instastalk(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!username) {
      bot.sendMessage(chatId, '👤 Mohon masukkan username Instagram setelah perintah /instastalk. Contoh: `/instastalk username_target`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Mencari info profil Instagram untuk @${username}...`, options);

      const profileData = await instaStalk(username);

      if (profileData) {
        const caption = `
✨ *INSTAGRAM PROFILE STALK* ✨

` +
                      `👤 *Username:* ${profileData.username || 'N/A'}
` +
                      `📛 *Full Name:* ${profileData.fullName || 'N/A'}
` +
                      `👥 *Followers:* ${profileData.followers || 'N/A'}
` +
                      `🤝 *Following:* ${profileData.following || 'N/A'}
` +
                      `📸 *Posts:* ${profileData.posts || 'N/A'}
` +
                      `📝 *Bio:* ${profileData.bio || 'N/A'}
`;

        if (profileData.profilePicUrl) {
          await bot.sendPhoto(chatId, profileData.profilePicUrl, { caption: caption, ...options, parse_mode: 'Markdown' });
        } else {
          await bot.sendMessage(chatId, caption, { ...options, parse_mode: 'Markdown' });
        }

      } else {
        bot.sendMessage(chatId, `Maaf, profil Instagram untuk @${username} tidak ditemukan.`, options);
      }

    } catch (error) {
      console.error('Error in instastalk:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari profil Instagram.', options);
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /telegramstalk
  bot.onText(/\/telegramstalk(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!username) {
      bot.sendMessage(chatId, '👤 Mohon masukkan username Telegram setelah perintah /telegramstalk. Contoh: `/telegramstalk username_target`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Mencari info profil Telegram untuk @${username}...`, options);

      const profileData = await telegramStalk(username);

      if (profileData) {
        const caption = `
✨ *TELEGRAM PROFILE STALK* ✨

` +
                      `👤 *Username:* ${profileData.username || 'N/A'}
` +
                      `🆔 *User ID:* ${profileData.userId || 'N/A'}
` +
                      `📝 *Bio:* ${profileData.bio || 'N/A'}
` +
                      `📊 *Status:* ${profileData.status || 'N/A'}
`;

        if (profileData.profilePicUrl) {
           // Telegram Bot API usually requires downloading and re-uploading profile photos
           // For simplicity, we'll just send the text info for now.
           // A more complex implementation would involve fetching the file and sending it.
           await bot.sendMessage(chatId, caption, { ...options, parse_mode: 'Markdown' });
        } else {
           await bot.sendMessage(chatId, caption, { ...options, parse_mode: 'Markdown' });
        }

      } else {
        bot.sendMessage(chatId, `Maaf, profil Telegram untuk @${username} tidak ditemukan.`, options);
      }

    } catch (error) {
      console.error('Error in telegramstalk:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari profil Telegram.', options);
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /tiktokstalk
  bot.onText(/\/tiktokstalk(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!username) {
      bot.sendMessage(chatId, '👤 Mohon masukkan username TikTok setelah perintah /tiktokstalk. Contoh: `/tiktokstalk username_target`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Mencari info profil TikTok untuk @${username}...`, options);

      const profileData = await tiktokStalk(username);

      if (profileData) {
        const caption = `
✨ *TIKTOK PROFILE STALK* ✨

` +
                      `👤 *Username:* ${profileData.username || 'N/A'}
` +
                      `📛 *Nickname:* ${profileData.nickname || 'N/A'}
` +
                      `👥 *Followers:* ${profileData.followers || 'N/A'}
` +
                      `🤝 *Following:* ${profileData.following || 'N/A'}
` +
                      `❤️ *Likes:* ${profileData.likes || 'N/A'}
` +
                      `🎥 *Videos:* ${profileData.videos || 'N/A'}
` +
                      `📝 *Bio:* ${profileData.bio || 'N/A'}
`;

        if (profileData.avatar) {
          await bot.sendPhoto(chatId, profileData.avatar, { caption: caption, ...options, parse_mode: 'Markdown' });
        } else {
          await bot.sendMessage(chatId, caption, { ...options, parse_mode: 'Markdown' });
        }

      } else {
        bot.sendMessage(chatId, `Maaf, profil TikTok untuk @${username} tidak ditemukan.`, options);
      }

    } catch (error) {
      console.error('Error in tiktokstalk:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari profil TikTok.', options);
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /genshinstalk
  bot.onText(/\/genshinstalk(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const uid = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!uid) {
      bot.sendMessage(chatId, '📊 Mohon masukkan UID Genshin Impact setelah perintah /genshinstalk. Contoh: `/genshinstalk 123456789`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Mencari info profil Genshin Impact untuk UID ${uid}...`, options);

      // Call genshinStalk function
      const profileData = await genshinStalk(uid);

      if (profileData) {
        // Assuming the API returns player data with fields like nickname, level, worldLevel, etc.
        const caption = `
✨ *GENSHIN IMPACT PROFILE STALK* ✨

` +
                      `🆔 *UID:* ${uid}
` +
                      `📛 *Nickname:* ${profileData.nickname || 'N/A'}
` +
                      `⭐ *Adventure Rank:* ${profileData.level || 'N/A'}
` +
                      `🗺️ *World Level:* ${profileData.worldLevel || 'N/A'}
` +
                      `🏆 *Achievements:* ${profileData.achievementCount || 'N/A'}
` +
                      `Statistik lain (jika tersedia): ...`; // Add more fields as available from the API response

        await bot.sendMessage(chatId, caption, { ...options, parse_mode: 'Markdown' });

      } else {
        bot.sendMessage(chatId, `Maaf, profil Genshin Impact untuk UID ${uid} tidak ditemukan atau data tidak tersedia.`, options);
      }

    } catch (error) {
      console.error('Error in genshinstalk:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari profil Genshin Impact.', options);
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /spotifydl
  bot.onText(/\/spotifydl(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!url) {
      bot.sendMessage(chatId, '🎵 Mohon masukkan URL lagu atau playlist Spotify setelah perintah /spotifydl. Contoh: `/spotifydl [url_spotify]`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengunduh dari Spotify...', options);

      // Call spotifyDl function
      const result = await spotifyDl(url);

      if (result && result.url) {
        // Assuming spotifyDl returns an object with url, title, artist
        await bot.sendAudio(chatId, result.url, {
          title: result.title || 'Spotify Track',
          performer: result.artist || 'Unknown Artist',
          caption: `🎵 Berhasil mengunduh:\n*${result.title || 'Spotify Track'}* oleh *${result.artist || 'Unknown Artist'}*`, // Added caption
          ...options,
          parse_mode: 'Markdown' // Use Markdown for caption
        });
      } else {
        bot.sendMessage(chatId, 'Maaf, tidak dapat mengunduh dari URL Spotify tersebut.', options);
      }

    } catch (error) {
      console.error('Error in spotifydl:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh dari Spotify.', options);
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /yousearch
  bot.onText(/\/yousearch(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🌐 Mohon masukkan kata kunci pencarian setelah perintah /yousearch. Contoh: `/yousearch berita terbaru`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Mencari di YouSearch.AI untuk "${query}"...`, options);

      // Call youSearch function
      const results = await youSearch(query);

      if (results && results.length > 0) {
        let replyText = `🌐 Hasil pencarian untuk "${query}" (dari YouSearch.AI):\n\n`;
        // Assuming results is an array of objects with properties like 'title', 'url', 'snippet'
        results.slice(0, 5).forEach((result, index) => { // Limit to top 5 results
          replyText += `${index + 1}. *${result.title || 'No Title'}*\n`;
          replyText += `[Link](${result.url || '#'})\n`; // Provide a fallback link
          replyText += `${result.snippet ? result.snippet + '\n' : ''}`;
          replyText += '\n';
        });
        bot.sendMessage(chatId, replyText, { parse_mode: 'Markdown', ...options });
      } else {
        bot.sendMessage(chatId, `Yah, maaf nih, gue nggak nemu hasil di YouSearch.AI buat "${query}". Coba kata kunci lain deh! 😥`, options);
      }

    } catch (error) {
      console.error('Error in yousearch:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencari di YouSearch.AI.', options);
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /savetube
  bot.onText(/\/savetube(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    // Match[1] would contain the entire string after /savetube, e.g., "url format"
    const args = match ? match[1]?.split(' ').filter(arg => arg) : []; // Split by space and filter empty strings
    const url = args[0] || null;
    const format = args[1] || null; // Optional format

    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!url) {
      bot.sendMessage(chatId, '💾 Mohon masukkan URL setelah perintah /savetube. Format (opsional) bisa ditambahkan setelah URL.\nContoh: `/savetube [url] [format]`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Sedang mengunduh via SaveTube untuk URL: ${url}...`, options);

      // Call savetube function
      const result = await savetube(url, format);

      if (result && result.url) {
        let caption = `💾 Berhasil mengunduh via SaveTube:\n\n`;
        caption += `📝 Nama: ${result.title || 'File'}\n`;
        caption += `💾 Ukuran: ${result.size || 'N/A'}\n`;
        caption += `🔗 Link Download: ${result.url}`; // Include direct download link

        // Attempt to send as document, falling back to message if needed
        try {
             await bot.sendDocument(chatId, result.url, { caption: caption, ...options });
        } catch (docError) {
             console.error('Error sending SaveTube result as document, sending as message:', docError);
             await bot.sendMessage(chatId, caption, { ...options, parse_mode: 'Markdown' }); // Send as Markdown message if document fails
        }

      } else {
        bot.sendMessage(chatId, 'Maaf, tidak dapat mengunduh dari URL tersebut via SaveTube.', options);
      }

    } catch (error) {
      console.error('Error in savetube:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh via SaveTube.', options);
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /quotedlyo (menggunakan alias /fakechat dan /quote)
  bot.onText(/\/(quotedlyo|fakechat|quote)(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    // match[1] adalah alias, match[2] adalah teks setelah perintah jika tidak reply
    const textToQuote = match ? match[2] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!textToQuote && !msg.reply_to_message) {
      bot.sendMessage(chatId, '💬 Mau bikin kutipan dari pesan yang mana nih? Balas pesannya atau ketik teksnya setelah perintah /quotedlyo ya!', options); // Pesan Gen Z
      return;
    }

    let text, username, userProfilePicUrl, replyMsgData = null;

    if (msg.reply_to_message) {
      // Use text from replied message
      text = msg.reply_to_message.text || msg.reply_to_message.caption || 'Pesan tanpa teks';
      username = msg.reply_to_message.from.first_name || msg.reply_to_message.from.username || 'Gaul'; // Username Gen Z

      // Attempt to get profile picture URL - this is complex and often requires specific API calls or admin rights
      // For simplicity, we\'ll omit profile picture for now or use a placeholder if really needed by the API.
      // If the quotedLyo API *requires* a real image URL, we would need a more robust implementation.
      // Based on the provided apiFunctions.js, it seems to use `profile` which might be a URL.
      // Let\'s assume it can handle a placeholder or be omitted if not critical.
      userProfilePicUrl = 'https://via.placeholder.com/150'; // Placeholder

      // Check for media in replied message to include in the quote
      if (msg.reply_to_message.photo) {
         // Get the largest photo
         const photo = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1];
         // Need to get file path to construct URL
         try {
            const file = await bot.getFile(photo.file_id);
            const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
            replyMsgData = { url: fileLink, options: { mediaType: 'photo' } };
         } catch (fileError) {
            console.error('Error getting photo file for quotedlyo:', fileError);
            // Continue without media if fetching fails
         }
      } else if (msg.reply_to_message.video) {
         const video = msg.reply_to_message.video;
         // Need to get file path to construct URL
         try {
            const file = await bot.getFile(video.file_id);
            const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
            replyMsgData = { url: fileLink, options: { mediaType: 'video' } };
         } catch (fileError) {
            console.error('Error getting video file for quotedlyo:', fileError);
            // Continue without media if fetching fails
         }
      }

    } else if (textToQuote) {
      // Use text from command argument
      text = textToQuote;
      username = msg.from.first_name || msg.from.username || 'Gaul'; // Username Gen Z
       // Placeholder for user\'s profile pic when not replying
      userProfilePicUrl = 'https://via.placeholder.com/150';
    }

    if (!text) {
         bot.sendMessage(chatId, '⚠️ Gak ada teks yang bisa dijadiin kutipan nih.', options); // Pesan Gen Z
         return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '⏳ Lagi bikinin sticker kutipan nih...', options); // Pesan Gen Z

      // Call quotedLyo function
      // The quotedLyo function in apiFunctions.js expects: teks, name, profile, reply
      const quoteResult = await quotedLyo(text, username, userProfilePicUrl, replyMsgData);

      if (quoteResult && quoteResult.result && quoteResult.result.image) {
        // Assuming quotedLyo returns an object with result.image as base64 string
        const stickerBuffer = Buffer.from(quoteResult.result.image, 'base64');
        // Send the result as a sticker
        // Define packname and author
        const packname = 'MannnDev AI'; // Ganti nama pack sticker
        const author = '@pocketedition09'; // Ganti nama author sticker

        await bot.sendSticker(chatId, stickerBuffer, {
           // Telegram bot API sometimes requires the sticker to be sent as a file
           // If sending directly from buffer fails, try sending as a file.
           // For now, let\'s try direct buffer.
           // Note: Telegram sticker limits apply (size, dimensions)
           pack_name: packname.replace(/[^\w-]/g, '') + '_' + author.replace(/[^\w-]/g, '') + '_by_' + bot.options.username + '_' + Math.random().toString(36).substring(7),
           // The above pack_name is just an example, Telegram has strict rules for sticker pack names.
           // A real implementation might need to manage sticker packs.
           // Let\'s simplify for now and assume sending a single static sticker image buffer is handled by the API.
           // If sendSticker with buffer fails, we might need to save it as a .webp file and send that.

           // Simpler approach: send the buffer directly. If this fails, a more complex approach is needed.
            // Check Telegram Bot API docs for sendSticker from buffer

            // Let\'s try sending the buffer directly. If Telegram API requires a file_id or a file path,
            // we would need to save the buffer to a temporary file first.

            // Based on node-telegram-bot-api docs, sendSticker can accept a Buffer.
            // Let\'s add a filename with .webp extension, as Telegram stickers are webp.

            filename: 'quote_sticker.webp', // Give it a webp filename
            ...options
        });

      } else {
        bot.sendMessage(chatId, 'Maaf, gagal bikin sticker kutipan nih. 😥', options); // Pesan Gen Z
      }

      bot.deleteMessage(chatId, processingMsg.message_id);

    } catch (error) {
      console.error('Error in quotedlyo:', error);
      bot.sendMessage(chatId, 'Yah, ada error nih pas bikin sticker kutipan. Coba lagi ya! 😅', options); // Pesan Gen Z
    }
  });

  // Command /emojimix
  bot.onText(/\/emojimix(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const emojiInput = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!emojiInput) {
      bot.sendMessage(chatId, '😅+🤔 Mau gabungin emoji apa nih? Kasih dua emoji dipisah tanda tambah (+). Contoh: `/emojimix 😅+🤔`', options); // Pesan Gen Z
      return;
    }

    const emojis = emojiInput.split('+').map(e => e.trim());

    if (emojis.length !== 2 || !emojis[0] || !emojis[1]) {
       bot.sendMessage(chatId, '⚠️ Formatnya salah nih, Bang/Sis. Kasih dua emoji dipisah tanda tambah (+) ya. Contoh: `/emojimix 😂+😭`', options); // Pesan Gen Z
       return;
    }

    const emoji1 = emojis[0];
    const emoji2 = emojis[1];

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Lagi cari gabungan emoji ${emoji1} sama ${emoji2} nih...`, options); // Pesan Gen Z

      // Use the API key from naze.js for Tenor
      const tenorApiKey = 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ'; // API Key dari naze.js
      const tenorUrl = `https://tenor.googleapis.com/v2/featured?key=${tenorApiKey}&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;

      const response = await axios.get(tenorUrl);

      if (response.data && response.data.results && response.data.results.length > 0) {
        // Ambil hasil pertama aja yang paling relevan
        const stickerUrl = response.data.results[0].media_formats.png_transparent.url;

        // Send the result as a sticker
        await bot.sendSticker(chatId, stickerUrl, options);

      } else {
        bot.sendMessage(chatId, `Yah, gabungan emoji ${emoji1} sama ${emoji2} nggak ketemu nih. Coba emoji lain deh! 😥`, options); // Pesan Gen Z
      }

      bot.deleteMessage(chatId, processingMsg.message_id);

    } catch (error) {
      console.error('Error in emojimix:', error);
      bot.sendMessage(chatId, 'Waduh, ada error nih pas gabungin emoji. Coba lagi ya! 😅', options); // Pesan Gen Z
    }
  });

  // Command /smeme (membuat sticker meme)
  bot.onText(/\/(smeme|stickmeme|stikmeme|stickermeme|stikermeme)(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const textInput = match ? match[2] : null; // Teks untuk meme
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!msg.reply_to_message || (!msg.reply_to_message.photo && !msg.reply_to_message.sticker)) {
      bot.sendMessage(chatId, '🖼️ Mau bikin meme dari gambar yang mana nih? Balas foto atau sticker dengan caption /smeme [teks_atas]|[teks_bawah]', options); // Pesan Gen Z
      return;
    }

    if (!textInput || !textInput.includes('|')) {
       bot.sendMessage(chatId, '📝 Jangan lupa tambahin teks meme-nya ya, pisahin teks atas sama bawah pake garis tegak (|). Contoh: /smeme teks atas|teks bawah', options); // Pesan Gen Z
       return;
    }

    const repliedMsg = msg.reply_to_message;
    const fileId = repliedMsg.photo ? repliedMsg.photo[repliedMsg.photo.length - 1].file_id : repliedMsg.sticker ? repliedMsg.sticker.file_id : null;
    const [atas, bawah] = textInput.split('|').map(t => t.trim());

    if (!fileId) {
       bot.sendMessage(chatId, '⚠️ Gagal dapetin ID file dari pesan balasan.', options); // Pesan Gen Z
       return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '⏳ Lagi bikin sticker meme...', options); // Pesan Gen Z

      // Download the file (photo or sticker)
      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      // NOTE: Downloading sticker (.webp) and using it as background for meme API might be tricky.
      // Meme API likely expects image format (png/jpeg).
      // We might need a step to convert webp sticker to png/jpeg if the API requires it.
      // For now, assuming the API can handle the downloaded file link or buffer.

      // The naze.js code uses an upload function (UguuSe) then the meme API.
      // Let\'s try to replicate that flow using the original image link or downloaded buffer.

      // Option 1: Try sending the file link directly to a meme API (less likely to work without upload)
      // Option 2: Download the file, upload to a temporary service, then use meme API with uploaded URL (like naze.js)
      // Option 3: Find a meme API that accepts image buffer/file directly.

      // Given the screenshot and naze.js uses memegen.link with a background URL, Option 2 seems the intended way.
      // Implementing file upload is complex. Let\'s use a simple public uploader if available via API, or inform the user.

      // Let\'s try downloading the file first.
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      const fileBuffer = Buffer.from(response.data);

      // Need a way to upload fileBuffer and get a public URL.
      // Since we don\'t have a dedicated upload function in apiFunctions.js, this part is tricky.
      // Let\'s assume for now we can use a placeholder or need to implement file upload.

      // *** Placeholder/Example for Meme Generation (Needs actual upload or API adjustment) ***
      // Assuming a public URL `publicImageUrl` is obtained after uploading `fileBuffer`
      // const publicImageUrl = await uploadFileSomehow(fileBuffer);\n
      // Using a placeholder URL for memegen.link structure (replace with actual uploaded URL)
      // Example: https://api.memegen.link/images/custom/hello/world.png?background=https://www.gstatic.com/webp/gallery3/1.png\n    // Since we don\'t have upload, let\'s inform the user this part needs a file uploader.

       bot.deleteMessage(chatId, processingMsg.message_id);
       bot.sendMessage(chatId, '🚧 Fitur Sticker Meme (`/smeme`) masih dalam pengembangan, Bang! Perlu fungsi buat upload gambar dulu biar bisa dibikin meme. Gue infoin kalau udah siap ya! 💪', options); // Pesan Gen Z

      // *** End Placeholder ***

      // If we had an upload function:
      /*
      const uploadResult = await uploadFileSomehow(fileBuffer); // Needs implementation
      if (!uploadResult || !uploadResult.url) {
          throw new Error('Gagal upload gambar untuk meme');
      }
      const publicImageUrl = uploadResult.url;

      const memeApiUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${encodeURIComponent(publicImageUrl)}`;

      // Fetch the generated meme image
      const memeResponse = await axios.get(memeApiUrl, { responseType: 'arraybuffer' });
      const memeBuffer = Buffer.from(memeResponse.data);

      // Send as sticker (Telegram sticker format is webp)
      // Convert image buffer to webp sticker format if necessary
      // sharp(memeBuffer).webp().toBuffer().then(stickerBuffer => {
      //    bot.sendSticker(chatId, stickerBuffer, options); // Add packname/author if needed
      // }).catch(stickerError => {
      //    console.error('Error converting meme to sticker:', stickerError);
      //    bot.sendMessage(chatId, 'Gagal konversi meme jadi sticker. 😥', options);
      // });

       // Simplification: send the meme image URL directly if Telegram supports it for stickers, or send as photo.
       // Telegram sendSticker supports file_id, URL, or Buffer.
       // The memegen.link returns a PNG. Sending PNG buffer might work, or need conversion to webp.

       // Let\'s try sending the buffer directly as a sticker.
       await bot.sendSticker(chatId, memeBuffer, { filename: 'meme_sticker.webp', ...options }); // Add packname/author if needed

       bot.deleteMessage(chatId, processingMsg.message_id);
      */

    } catch (error) {
      console.error('Error in smeme:', error);
      // If the error was from the placeholder message above, this won\'t be reached.
      // If an upload/API call failed (if implemented), handle it here.
      bot.sendMessage(chatId, 'Yah, ada error nih pas bikin sticker meme. Coba lagi ya! 😅', options); // Pesan Gen Z
    }
  });

  // Command /steamdetail
  bot.onText(/\/steamdetail_(\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const appId = match[1]; // Capture the app ID from the command
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!appId) {
      bot.sendMessage(chatId, '🎮 Mohon masukkan ID game Steam setelah perintah /steamdetail_. Contoh: `/steamdetail_12345`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Mengambil detail game Steam untuk App ID ${appId}...`, options);

      // Call getSteamGameDetail function (assuming Steam_Detail is an alias)
      const gameDetail = await getSteamGameDetail(appId);

      if (gameDetail) {
        let message = `🎮 **${gameDetail.name}**\n\n`;
        message += `💰 Harga: ${gameDetail.is_free ? 'Free To Play' : gameDetail.price_overview.final_formatted}\n`;
        message += `📅 Tanggal Rilis: ${gameDetail.release_date.date}\n`;
        message += `📜 Pengembang: ${gameDetail.developers.join(', ')}\n`;
        message += `🏢 Penerbit: ${gameDetail.publishers.join(', ')}\n`;
        message += `📊 Metascore: ${gameDetail.metacritic ? gameDetail.metacritic.score : 'N/A'}\n`;
        message += `🎭 Genre: ${gameDetail.genres.map(g => g.description).join(', ')}\n`;
        message += `🔗 [Lihat di Steam](${gameDetail.website || `https://store.steampowered.com/app/${appId}/`})\n\n`;
        message += `📖 Deskripsi Singkat:\n${gameDetail.short_description}`; // Use short description

        // Send the header image if available, with the message as caption
        if (gameDetail.header_image) {
           await bot.sendPhoto(chatId, gameDetail.header_image, { caption: message, ...options, parse_mode: 'Markdown' });
        } else {
           // Otherwise, just send the message
           await bot.sendMessage(chatId, message, { ...options, parse_mode: 'Markdown' });
        }

      } else {
        bot.sendMessage(chatId, 'Maaf, detail game tidak ditemukan untuk ID tersebut.', options);
      }

    } catch (error) {
      console.error('Error in steamdetail:', error);
      bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengambil detail game Steam.', options);
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  }); // Closing the steamdetail handler

  // File path for the group members cache
  const cacheFilePath = path.join(__dirname, 'groupMembersCache.json');

  // Object to store unique user IDs per group chat
  let groupMembersCache = {}; // Changed from const to let to allow reassigning loaded cache

  // Function to save the cache to the JSON file
  function saveCache() {
    try {
      const cacheToSave = {};
      for (const chatId in groupMembersCache) {
        // Convert Set to Array for JSON serialization
        cacheToSave[chatId] = Array.from(groupMembersCache[chatId]);
      }
      fs.writeFileSync(cacheFilePath, JSON.stringify(cacheToSave, null, 2), 'utf8');
      console.log('✅ Group members cache saved successfully.');
    } catch (error) {
      console.error('❌ Error saving group members cache:', error.message);
    }
  }

  // Function to load the cache from the JSON file
  function loadCache() {
    try {
      if (fs.existsSync(cacheFilePath)) {
        const fileContent = fs.readFileSync(cacheFilePath, 'utf8');
        const loadedCache = JSON.parse(fileContent);
        const loadedGroupMembersCache = {};
        for (const chatId in loadedCache) {
          // Convert Array back to Set
          loadedGroupMembersCache[chatId] = new Set(loadedCache[chatId]);
        }
        groupMembersCache = loadedGroupMembersCache;
        console.log('✅ Group members cache loaded successfully.');
      } else {
        console.log('ℹ️ Cache file not found, starting with empty cache.');
        groupMembersCache = {}; // Initialize as empty if file not found
      }
    } catch (error) {
      console.error('❌ Error loading group members cache:', error.message);
      groupMembersCache = {}; // Initialize as empty on error
    }
  }

  // Load cache when the bot starts
  loadCache();

  // Save cache periodically (e.g., every 60 seconds)
  setInterval(saveCache, 60000);

  // Handle all messages (now that botId is available)
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // If the message is from a group, add the user's ID to the cache for that specific group
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
      // Ensure a Set exists for this chatId
      if (!groupMembersCache[chatId]) {
        groupMembersCache[chatId] = new Set();
      }
      // Add user ID if not already in the set
      if (!groupMembersCache[chatId].has(userId)) {
          groupMembersCache[chatId].add(userId);
          // We don't need to call saveCache immediately here anymore, as setInterval handles periodic saving.
         console.log(`Added user ID ${userId} to cache for chat ${chatId}. Current cache size for this chat: ${groupMembersCache[chatId].size}`); // Optional: for debugging
      }
    }

    // Ignore command messages handled by specific bot.onText handlers
    if (msg.text && msg.text.startsWith('/')) {
      return; // Skip if it's a command
    }

    // Use reply_to_message_id if in a group
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    // Get message text (handle caption for media) and convert to lowercase for checking
    const messageText = msg.text || msg.caption || '';
    const lowerCaseText = messageText.toLowerCase();

    // Check if the message is a reply to the bot OR if it mentions the bot in a group
    const isReplyToBot = msg.reply_to_message && msg.reply_to_message.from.id === botId;
    // Check for mention only in group or supergroup chats
    const botUsername = bot.options.username; // Get bot username from options
    const isMention = (msg.chat.type === 'group' || msg.chat.type === 'supergroup') && botUsername && lowerCaseText.includes(`@${botUsername.toLowerCase()}`);

    // Determine if the message needs an AI response
    const needsAIResponse = isReplyToBot || isMention;

    if (needsAIResponse) {
        // Determine the query for the AI
        let queryForAI = '';
        if (isReplyToBot) {
          // If replying to the bot, use the message text as the query
          queryForAI = messageText;
        } else if (isMention) {
          // If mentioning the bot, remove the mention part to get the query
          const mentionPattern = new RegExp(`@${botUsername}`, 'i');
          queryForAI = messageText.replace(mentionPattern, '').trim();
           // If the message is just a mention without text after it, use a default prompt or ask for input
           if (!queryForAI) {
               bot.sendMessage(chatId, '🤔 Ada apa nyebut-nyebut gue? Ketik sesuatu dong setelah nama gue!', options);
               return; // Stop processing if it's just a mention
           }
        }

        // Handle specific date-related phrases first if the query starts with them
        const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayDay = daysOfWeek[today.getDay()];
        const todayDate = today.getDate();
        const todayMonth = months[today.getMonth()];
        const todayYear = today.getFullYear();

        const tomorrowDay = daysOfWeek[tomorrow.getDay()];
        const tomorrowDate = tomorrow.getDate();
        const tomorrowMonth = months[tomorrow.getMonth()];
        const tomorrowYear = tomorrow.getFullYear();

        const lowerCaseQuery = queryForAI.toLowerCase();

        // Check for specific date-related phrases
        if (lowerCaseQuery.includes('besok hari apa')) {
          // Send response about tomorrow's date
          await bot.sendMessage(chatId, `Besok adalah hari **${tomorrowDay}, ${tomorrowDate} ${tomorrowMonth} ${tomorrowYear}**.`, { ...options, parse_mode: 'Markdown' });
        } else if (lowerCaseQuery.includes('hari ini hari apa')) {
          // Send response about today's date
          await bot.sendMessage(chatId, `Hari ini adalah hari **${todayDay}, ${todayDate} ${todayMonth} ${todayYear}**.`, { ...options, parse_mode: 'Markdown' });
        } else {
          // Panggil API Gemini for other questions
          let processingMsg; // Declare processingMsg here
          try {
            processingMsg = await bot.sendChatAction(chatId, 'typing', options); // Kirim status "mengetik"

            // Check for questions about the creator
            const creatorKeywords = ['dibuat', 'buat siapa', 'pembuat', 'creator', 'developer', 'bikin siapa']; // Kata kunci terkait pembuat
            const isAskingAboutCreator = creatorKeywords.some(keyword => lowerCaseQuery.includes(keyword));

            let answer;
            if (isAskingAboutCreator) {
              // Specific response for creator questions
              answer = '😎 Gue ini buatan MannnDev, Bang/Sis! Beliau yang ngoding gue sampe bisa online di sini. Keren kan? 😉'; // Jawaban khusus Gen Z
            } else {
              // Panggil API Gemini for other questions
              const apiKey = getNextApiKey(); // Get the next API key
              const genAI = new GoogleGenerativeAI(apiKey);
              const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Menggunakan model Gemini 1.5 Flash
              // Add context to the prompt for Gemini
              const fullPrompt = `Kamu adalah AI asisten Telegram bernama MannnDev AI Bot. Dan buatan MannnDev. Jawab pertanyaan pengguna dengan santai, gaul, dan gunakan bahasa sehari-hari anak Gen Z. Selipkan emoji kalau cocok. Jangan terlalu formal ya!\n\n${queryForAI}`;
              const result = await model.generateContent(fullPrompt);
              const response = result.response;
              answer = response.text();
            }

            await bot.sendMessage(chatId, answer, options);
          } catch (error) {
            console.error('Error processing message with Gemini:', error);
            // Check if the error is due to invalid API key (after trying all keys if multiple) or other API issues
            if (error.message && error.message.includes('API key not valid') || (error.message && error.message.includes('Google Gemini API key is not configured')) ){
               bot.sendMessage(chatId, '⚠️ Waduh, API Key Google Gemini lo kayaknya nggak valid atau habis. Coba cek lagi di file `.env` ya!', options); // Pesan Gen Z + info error
            } else {
                bot.sendMessage(chatId, 'Waduh, ada error nih pas mau proses pesan lo pake AI. Coba lagi ya! 😅', options); // Pesan Gen Z
            }
          } finally {
               // Ensure processing message is deleted even if there's an error in try block
               if (processingMsg && processingMsg.message_id) {
                  bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
               }
          }
        }
    }

    // If it's not a reply to the bot or a mention, other message handling logic can go here if needed.

  }); // Closing the message handler

  // Command /ssweb
  bot.onText(/\/ssweb(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match ? match[1] : null; // Capture the argument if it exists
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!url) {
      bot.sendMessage(chatId, '💻 Mohon masukkan URL setelah perintah /ssweb. Contoh: \`/ssweb https://google.com\`', options);
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '⏳ Mengambil screenshot web...', options);

      // Ensure the URL has a protocol for the API
      let targetUrl = url.replace(/^https?:\/\//, '');
      targetUrl = 'https://' + targetUrl; // Thum.io requires https

      const screenshotUrl = 'https://image.thum.io/get/width/1900/crop/1000/fullpage/' + targetUrl;

      // *** START Modification to download buffer ***
      const response = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);
      // *** END Modification ***

      // Send the screenshot as a photo using the buffer
      await bot.sendPhoto(chatId, imageBuffer, { caption: `📸 Screenshot dari: ${url}`, ...options });

    } catch (error) {
      console.error('Error in /ssweb command:', error);
      bot.sendMessage(chatId, 'Yah, gagal nih mengambil screenshot web. Pastikan URL-nya valid ya! 😥', options);
    } finally {
         // Ensure processing message is deleted
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Handler untuk perintah /cuaca atau /weather
  bot.onText(/\/(cuaca|weather)(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[2] : null; // match[1] adalah alias (cuaca/weather), match[2] adalah query kota
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '☀️ Pengen tau cuaca di mana nih? Ketik /cuaca [nama kota]. Contoh: `/cuaca bandung`', options); // Pesan Gen Z
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Nyari info cuaca buat kota ${query} nih...`, options); // Pesan Gen Z

      const data = await getWeatherData(query); // Memanggil fungsi dari apiFunctions.js

      const caption = `
*☀️ Cuaca di ${data.name}, ${data.sys.country}*

*Kondisi:* ${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}
*Suhu:* ${data.main.temp}°C
*Terasa seperti:* ${data.main.feels_like}°C
*Kelembapan:* ${data.main.humidity}%
*Kecepatan Angin:* ${data.wind.speed} m/s
*Tekanan:* ${data.main.pressure} hPa
    `;

      bot.sendMessage(chatId, caption, { ...options, parse_mode: 'Markdown' });

    } catch (error) {
      console.error('Error in /cuaca command:', error);
      bot.sendMessage(chatId, `Yah, gagal nih cek cuaca. Error: ${error.message} 😥`, options); // Pesan Gen Z
    } finally {
           if (processingMsg && processingMsg.message_id) {
              bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
           }
    }
  });

  // Command /waifu dan /neko
  bot.onText(/\/(waifu|neko)(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const command = match[1]; // 'waifu' or 'neko'
    const arg = match ? match[2] : null; // Parameter setelah perintah (misal: nsfw)
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    // TODO: Tambahkan logika pengecekan mode NSFW bot jika ada
    // Asumsi sementara: jika ada arg 'nsfw', kita coba ambil yang NSFW
    const type = arg && arg.toLowerCase() === 'nsfw' ? 'nsfw' : 'sfw';

    // Peringatan jika mencoba akses NSFW tanpa fitur diaktifkan (jika ada settingnya)
    // if (type === 'nsfw' && !isNsfwEnabled) { // Asumsi ada variabel isNsfwEnabled
    //   bot.sendMessage(chatId, '🚫 Maaf, fitur NSFW belum diaktifkan di bot ini.', options);
    //   return;
    // }


    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, `⏳ Nyari gambar ${command} ${type === 'nsfw' ? '(NSFW)' : ''} nih...`, options); // Pesan Gen Z

      const imageUrl = await fetchWaifuNeko(type, command); // Panggil fungsi dari apiFunctions.js

      await bot.sendPhoto(chatId, imageUrl, { caption: `✨ Nih gambar ${command} buat lo!`, ...options }); // Pesan Gen Z

    } catch (error) {
      console.error(`Error in /${command} command:`, error);
      bot.sendMessage(chatId, `Yah, gagal nih ambil gambar ${command}-nya. Error: ${error.message} 😥`, options); // Pesan Gen Z
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Tambahkan handler untuk perintah sticker, sticker meme, emoji mix di sini nanti

  // The handlers are now defined directly in the main scope
  console.log('Bot MannnDev AI udah ON! 🚀'); // Biarkan ini standar

  // Fungsi untuk mendapatkan API key Gemini berikutnya secara bergilir (jika ada lebih dari satu)
  // ... existing function getNextApiKey ...

  // Handle all messages (now that botId is available)
  // ... existing message handler ...

  // Command /bk9ai
  bot.onText(/\/bk9ai(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : null;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!query) {
      bot.sendMessage(chatId, '🤖 Pertanyaan apa nih buat BK9 AI? Ketik setelah perintah ya! Contoh: `/bk9ai ceritakan tentang kucing`', options); // Pesan Gen Z
      return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '🤔 BK9 AI lagi mikir...', options); // Pesan Gen Z

      // Panggil fungsi bk9Ai dari apiFunctions.js
      const response = await bk9Ai(query);

      if (response) {
        bot.sendMessage(chatId, response, options);
      } else {
         bot.sendMessage(chatId, 'Maaf, BK9 AI gak bisa kasih jawaban nih. 😥', options); // Pesan Gen Z
      }

    } catch (error) {
      console.error('Error in /bk9ai command:', error);
      bot.sendMessage(chatId, 'Yah, ada error nih pas nanya ke BK9 AI. Coba lagi ya! 😅', options); // Pesan Gen Z
    } finally {
         if (processingMsg && processingMsg.message_id) {
            bot.deleteMessage(chatId, processingMsg.message_id).catch(e => console.error('Error deleting message:', e));
         }
    }
  });

  // Command /toaudio
  bot.onText(/\/toaudio/, async (msg) => {
    const chatId = msg.chat.id;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!msg.reply_to_message) {
      bot.sendMessage(chatId, '🎵 Balas pesan (audio/video/dokumen video/dokumen audio) yang mau kamu ubah jadi MP3 ya!', options);
      return;
    }

    const repliedMsg = msg.reply_to_message;
    const audio = repliedMsg.audio;
    const video = repliedMsg.video;
    const document = repliedMsg.document;

    if (!audio && !video && !document) {
      bot.sendMessage(chatId, '⚠️ Pesan yang kamu balas bukan media (audio/video/dokumen) yang bisa diubah ke MP3.', options);
      return;
    }

    let fileId, fileExt;
    if (audio) {
      fileId = audio.file_id;
      fileExt = audio.file_name ? audio.file_name.split('.').pop() : 'ogg'; // Default ke ogg kalau gak ada nama file
    } else if (video) {
      fileId = video.file_id;
       fileExt = video.file_name ? video.file_name.split('.').pop() : 'mp4'; // Default ke mp4 kalau gak ada nama file
    } else if (document && document.mime_type && (document.mime_type.startsWith('video/') || document.mime_type.startsWith('audio/'))) {
       fileId = document.file_id;
       fileExt = document.file_name ? document.file_name.split('.').pop() : document.mime_type.split('/')[1]; // Ambil ekstensi dari mime type
    } else {
        bot.sendMessage(chatId, '⚠️ Dokumen yang kamu balas bukan format video atau audio yang didukung.', options);
        return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '⏳ Lagi ubah media jadi audio MP3 nih...', options);

      // Download the file
      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      const fileBuffer = Buffer.from(response.data);

      // Convert to audio using the new function
      const audioBuffer = await toAudio(fileBuffer, fileExt);

      // Send the audio back
      await bot.sendAudio(chatId, audioBuffer, options);

      bot.deleteMessage(chatId, processingMsg.message_id);

    } catch (error) {
      console.error('Error in /toaudio command:', error);
      if (error.message && error.message.includes('FFmpeg exited with code')) {
         bot.sendMessage(chatId, '⚠️ Gagal konversi! Pastikan FFmpeg sudah terinstal di server bot. Detail error: ' + error.message, options);
      } else {
         bot.sendMessage(chatId, `Yah, gagal nih ubah media jadi audio. Error: ${error.message} 😥`, options);
      }
    }
  });

  // Command /toptt
  bot.onText(/\/toptt/, async (msg) => {
    const chatId = msg.chat.id;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!msg.reply_to_message) {
      bot.sendMessage(chatId, '🎙️ Balas pesan (audio/video/dokumen video/dokumen audio) yang mau kamu ubah jadi Pesan Suara (PTT) ya!', options);
      return;
    }

    const repliedMsg = msg.reply_to_message;
    const audio = repliedMsg.audio;
    const video = repliedMsg.video;
    const document = repliedMsg.document;

    if (!audio && !video && !document) {
      bot.sendMessage(chatId, '⚠️ Pesan yang kamu balas bukan media (audio/video/dokumen) yang bisa diubah ke Pesan Suara (PTT).', options);
      return;
    }

    let fileId, fileExt;
    if (audio) {
      fileId = audio.file_id;
      fileExt = audio.file_name ? audio.file_name.split('.').pop() : 'ogg'; // Default ke ogg kalau gak ada nama file
    } else if (video) {
      fileId = video.file_id;
       fileExt = video.file_name ? video.file_name.split('.').pop() : 'mp4'; // Default ke mp4 kalau gak ada nama file
    } else if (document && document.mime_type && (document.mime_type.startsWith('video/') || document.mime_type.startsWith('audio/'))) {
       fileId = document.file_id;
       fileExt = document.file_name ? document.file_name.split('.').pop() : document.mime_type.split('/')[1]; // Ambil ekstensi dari mime type
    } else {
        bot.sendMessage(chatId, '⚠️ Dokumen yang kamu balas bukan format video atau audio yang didukung.', options);
        return;
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '⏳ Lagi ubah media jadi Pesan Suara (PTT) nih...', options);

      // Download the file
      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      const fileBuffer = Buffer.from(response.data);

      // Convert to PTT using the new function
      const pttBuffer = await toPTT(fileBuffer, fileExt);

      // Send the PTT back as a voice message
      await bot.sendVoice(chatId, pttBuffer, options);

      bot.deleteMessage(chatId, processingMsg.message_id);

    } catch (error) {
      console.error('Error in /toptt command:', error);
       if (error.message && error.message.includes('FFmpeg exited with code')) {
         bot.sendMessage(chatId, '⚠️ Gagal konversi! Pastikan FFmpeg sudah terinstal di server bot. Detail error: ' + error.message, options);
    } else {
      bot.sendMessage(chatId, `Yah, gagal nih ubah media jadi Pesan Suara (PTT). Error: ${error.message} 😥`, options);
    }
  }
  });

  // Command /tovideo
  bot.onText(/\/tovideo/, async (msg) => {
    const chatId = msg.chat.id;
    const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};

    if (!msg.reply_to_message) {
      bot.sendMessage(chatId, '▶️ Balas pesan (audio/dokumen audio) yang mau kamu ubah jadi video dengan background hitam ya!', options);
      return;
    }

    const repliedMsg = msg.reply_to_message;
    const audio = repliedMsg.audio;
    const document = repliedMsg.document;

    // This command is specifically for converting audio to video
    if (!audio && !(document && document.mime_type && document.mime_type.startsWith('audio/'))) {
      bot.sendMessage(chatId, '⚠️ Pesan yang kamu balas bukan audio atau dokumen audio yang bisa diubah jadi video.', options);
      return;
    }

    let fileId, fileExt;
    if (audio) {
      fileId = audio.file_id;
      fileExt = audio.file_name ? audio.file_name.split('.').pop() : 'ogg'; // Default ke ogg kalau gak ada nama file
    } else if (document) {
       fileId = document.file_id;
       fileExt = document.file_name ? document.file_name.split('.').pop() : document.mime_type.split('/')[1]; // Ambil ekstensi dari mime type
    }

    let processingMsg;
    try {
      processingMsg = await bot.sendMessage(chatId, '⏳ Lagi ubah audio jadi video nih (background hitam)...', options);

      // Download the file
      const file = await bot.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      const fileBuffer = Buffer.from(response.data);

      // Convert to video using the new function
      const videoBuffer = await toVideo(fileBuffer, fileExt);

      // Send the video back
      await bot.sendVideo(chatId, videoBuffer, options);

      bot.deleteMessage(chatId, processingMsg.message_id);

    } catch (error) {
      console.error('Error in /tovideo command:', error);
       if (error.message && error.message.includes('FFmpeg exited with code')) {
         bot.sendMessage(chatId, '⚠️ Gagal konversi! Pastikan FFmpeg sudah terinstal di server bot. Detail error: ' + error.message, options);
    } else {
      bot.sendMessage(chatId, `Yah, gagal nih ubah audio jadi video. Error: ${error.message} 😥`, options);
    }
  }
  });

  // Command /tagall
  bot.onText(/\/tagall(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const customMessage = match[1] || '';

    try {
      // Check if it's a group chat
      if (msg.chat.type === 'private') {
        bot.sendMessage(chatId, '❌ Perintah ini hanya bisa digunakan di grup!');
        return;
      }

      // Check if bot is admin
      const botMember = await bot.getChatMember(chatId, botId);
      if (!['creator', 'administrator'].includes(botMember.status)) {
        bot.sendMessage(chatId, '❌ Bot harus menjadi admin untuk menggunakan fitur ini!');
        return;
      }

      // Get all chat members (using cached IDs for the specific group - limited by who has messaged)
      const chat = await bot.getChat(chatId);
      // We still need getChatMemberCount for the total count display
      const totalMemberCount = await bot.getChatMemberCount(chatId);

      // Get the cached member IDs for THIS specific group
      const cachedMemberIds = groupMembersCache[chatId] || new Set(); // Use Set for this chat or empty Set if none

      // Create message with mentions
      let message = `══✪〘 *👥 Tag All (Partial)* 〙✪══\n\n`; // Clarify it's partial
      message += `➲ *Grup:* ${chat.title}\n`;
      message += `➲ *Total Member (di Grup):* ${totalMemberCount}\n`;
       message += `➲ *Member yang Ditag (dari cache):* ${cachedMemberIds.size}\n`; // Show cache size for THIS chat
      if (customMessage) {
        message += `➲ *Pesan:* ${customMessage}\n`;
      }
      message += `\n*Daftar Member (dari cache):*\n`;

      // Add mentions for cached members in THIS group
      for (const memberId of cachedMemberIds) { // Iterate only the cached IDs for THIS chat
        try {
          // Fetch member info to get name/username for mention
          const member = await bot.getChatMember(chatId, memberId);
          const user = member.user;
          // Use proper Markdown V2 mention format
          message += `⭔ [${user.first_name || user.username || 'Member'}](tg://user?id=${user.id})\n`;
        } catch (error) {
          // Ignore errors for members who might have left or are no longer accessible in THIS chat
          // console.error(`Error fetching member ${memberId} for tagging in chat ${chatId}:`, error.message); // Optional: for debugging
          // We don't need to log every single error for members who might have left
        }
      }

      // Send message with mentions
      // Use reply_to_message_id if in a group
      const options = msg.chat.type !== 'private' ? { reply_to_message_id: msg.message_id } : {};
      bot.sendMessage(chatId, message, {
        ...options, // Include the reply options
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
    } catch (error) {
      console.error('Error in /tagall command:', error);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menandai semua member!');
    }
  });