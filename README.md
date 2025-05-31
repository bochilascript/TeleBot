# MannnDev AI Bot 🤖

Bot Telegram untuk generate gambar HD menggunakan AI.

## Fitur

- Generate gambar HD menggunakan Stable Diffusion XL
- Kualitas gambar 1024x1024 pixels
- Mendukung prompt dalam bahasa Indonesia
- Antarmuka yang mudah digunakan

## Cara Setup

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` dan isi dengan token yang diperlukan:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

3. Dapatkan token yang diperlukan:
   - Telegram Bot Token: Buat bot baru melalui [@BotFather](https://t.me/BotFather)
   - Replicate API Token: Daftar di [Replicate](https://replicate.com) dan dapatkan API token

4. Jalankan bot:
```bash
npm start
```

## Cara Penggunaan

1. Mulai bot dengan perintah `/start`
2. Gunakan perintah `/generate` diikuti dengan deskripsi gambar yang diinginkan
   Contoh: `/generate sunset di pantai dengan pohon kelapa`
3. Tunggu beberapa saat, bot akan mengirimkan gambar yang dihasilkan
4. Gunakan perintah `/help` untuk melihat panduan lengkap

## Catatan

- Proses generate gambar membutuhkan waktu beberapa detik
- Kualitas gambar tergantung pada deskripsi yang diberikan
- Gunakan deskripsi yang detail untuk hasil yang lebih baik 