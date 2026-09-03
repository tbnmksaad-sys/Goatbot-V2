module.exports = {
  config: {
    name: "gif",
    aliases: ["gifs", "GIF"],
    version: "1.0.0",
    author: "shtot",
    countDown: 2,
    role: 0,
    shortDescription: "يرسل GIF حسب النوع",
    category: "fun"
  },

  onStart: async function ({ api, event, args }) {
    const keyword = args.join(" ").trim();

    if (!keyword) {
      return api.sendMessage(
        "🎬 كتب النوع ديال الـGIF\n\n" +
        "مثال:\n" +
        "gif حزين\n" +
        "gif ضحك\n" +
        "gif أنمي\n" +
        "gif ناروتو",
        event.threadID
      );
    }

    try {
      // البحث باستعمال خاصية GIF الموجودة في الـAPI
      if (!api.gifs || !api.gifs.search) {
        return api.sendMessage(
          "❌ نسخة FCA ديال البوت ما كتدعمش البحث على GIF.",
          event.threadID
        );
      }

      const gifs = await api.gifs.search(keyword);

      if (!gifs || gifs.length === 0) {
        return api.sendMessage(
          `😔 ملقيتش GIF ديال: ${keyword}`,
          event.threadID
        );
      }

      const gif =
        gifs[Math.floor(Math.random() * gifs.length)];

      // إذا رجع API رابط GIF
      const gifUrl =
        gif.url ||
        gif.gifURL ||
        gif.gifUrl ||
        gif.media_url ||
        gif.src;

      if (!gifUrl) {
        return api.sendMessage(
          "❌ لقيت GIF ولكن ما قدرتش نجيب رابط الإرسال.",
          event.threadID
        );
      }

      return api.sendMessage(
        {
          attachment: await global.utils.getStreamFromURL(gifUrl)
        },
        event.threadID
      );

    } catch (err) {
      console.error("GIF ERROR:", err);

      return api.sendMessage(
        "❌ وقع مشكل فالبحث على الـGIF.",
        event.threadID
      );
    }
  }
};
