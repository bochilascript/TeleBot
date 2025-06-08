/**
 * Escape karakter HTML yang bisa bikin Telegram error
 * @param {String} text
 * @returns {String}
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Konversi markdown triple backtick menjadi HTML <pre><code>
 * Support semua bahasa: ```js, ```python, ```html, dll
 * @param {String} text
 * @returns {String}
 */
function convertMarkdownToHtmlCodeBlock(text) {
  return text.replace(/```(\w+)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escaped = escapeHtml(code.trim());
    return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
  });
}

/**
 * Kirim pesan HTML aman ke Telegram
 * - Auto convert dari markdown triple backtick ke <pre><code>
 * - Escape karakter berbahaya
 * - Fallback kirim file jika gagal
 *
 * @param {TelegramBot} bot
 * @param {Number|String} chatId
 * @param {String} text
 * @param {Object} options
 */
async function safeSendHtml(bot, chatId, text, options = {}) {
  const finalText = convertMarkdownToHtmlCodeBlock(text);
  try {
    await bot.sendMessage(chatId, finalText, {
      parse_mode: "HTML",
      ...options,
    });
  } catch (err) {
    console.error("HTML send error:", err.message);
    try {
      await bot.sendMessage(chatId, text, options);
    } catch (err2) {
      console.error("Fallback error:", err2.message);
      await bot.sendDocument(chatId, Buffer.from(text, "utf-8"), {
        filename: "fallback.txt",
        caption: "⚠️ Gagal mengirim sebagai teks. Ini fallback-nya.",
        ...options,
      });
    }
  }
}

module.exports = {
  safeSendHtml,
  convertMarkdownToHtmlCodeBlock,
  escapeHtml,
};
