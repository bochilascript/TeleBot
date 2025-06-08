# MannnDev AI Bot 🤖

Bot Telegram multifungsi dengan berbagai fitur AI dan utilitas.

## Fitur Utama

### AI & Chat
- Chat dengan Gemini AI (Gemini Pro & Gemini Flash)
- Generate gambar menggunakan Stable Diffusion XL
- Kualitas gambar 1024x1024 pixels
- Mendukung prompt dalam bahasa Indonesia

### Download & Media
- Download video TikTok (dengan/s tanpa watermark)
- Download video Instagram
- Download video YouTube (MP4 & MP3)
- Tiktok Downloader (MP4 & MP3)

### Stalking & Info
- Stalk profil TikTok
- Stalk profil Genshin Impact
- Cek jadwal sholat
- Cek cuaca
- Cek info game Steam

### Utilitas
- Konversi media (audio, video, PTT)
- Dan banyak lagi!

## Cara Setup

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` dan isi dengan token yang diperlukan:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
GOOGLE_API_KEY=your_api_key_token_here
GOOGLE_MODEL_TEXT=gemini-2.5-flash-preview-05-20
GOOGLE_MODEL_IMAGE=gemini-2.0-flash-preview-image-generation
RAPID_API_KEY=your_rapid_apikey_here
```

3. Dapatkan token yang diperlukan:
   - Telegram Bot Token: Buat bot baru melalui [@BotFather](https://t.me/BotFather)
   - Google API Key: Dapatkan dari [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Rapid Api Key: Dapatkan dari [Rapid](https://rapidapi.com)

4. Jalankan bot:
```bash
- cd [Dir Bot]
- npm install
- npm start
```

5. Termux:
```bash
- apt update && apt upgrade -y
- pkg update && pkg upgrade -y
- pkg install git
- pkg install ffmpeg
- pkg install yt-dlp
- pkg install imagemagick
- git clone https://github.com/bochilascript/TelegramBOTV1.git
- cd dir (tempat clone bot)
- npm install
- npm start
(kalo ada error dengan tulisan "❌ Could not load the "sharp" module using the android-arm64 runtime
")
masukkan perintah ini: npm install --cpu=wasm32 sharp
-npm start
```

## Cara Penggunaan

### AI & Chat
- `/menu` - Mulai bot
- `/geminiai` - Tanya ke AI
- `/ngobrol` - Chat dengan AI
- `/generate` - Generate gambar AI
  Contoh: `/generate sunset di pantai dengan pohon kelapa`

### Download Media
- `/tiktok` - Download video TikTok
- `/instagram` - Download video Instagram
- `/ytmp4` - Download video YouTube
- `/ytmp3` - Download audio YouTube
- `/ttsearch` - Cari video TikTok (Bisa Download MP4 & MP3)

### Stalking & Info
- `/tiktokstalk` - Stalk profil TikTok
- `/genshinstalk` - Stalk profil Genshin
- `/jadwalsholat` - Cek jadwal sholat
- `/cuaca` - Cek info cuaca
- `/steam` - Cek info game Steam

### Utilitas
- `/toaudio` - Konversi ke audio
- `/tovideo` - Konversi ke video
- `/toptt` - Konversi ke PTT

## Catatan

- Bot menggunakan API pihak ketiga untuk beberapa fitur
- Beberapa fitur mungkin memerlukan waktu beberapa detik untuk diproses
- Gunakan perintah dengan benar sesuai format yang ditentukan
- Untuk bantuan lebih lanjut, gunakan perintah `/menu`

## Dukungan

Jika mengalami masalah atau memiliki pertanyaan, silakan buat issue di repository ini. 
## Support OS
```
PC/Laptop : 
- Windows
- Linux
Android : 
- Termux
```
