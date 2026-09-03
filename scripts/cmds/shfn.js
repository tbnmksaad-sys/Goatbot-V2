module.exports = {
  config: {
    name: "slkk",
    aliases: ["sticker", "ستيكر"],
    version: "1.0.0",
    author: "shtot",
    countDown: 2,
    role: 0,
    shortDescription: "يرسل ستيكر Facebook عشوائي",
    category: "fun"
  },

  onStart: async function ({ api, event, args }) {
    const keyword = args.join(" ").trim();

    if (!keyword) {
      return api.sendMessage(
        "🎨 كتب النوع ديال الستيكـر\n\nمثال:\nslkk حزين\nslkk ضحك\nslkk حب",
        event.threadID
      );
    }

    try {
      if (!api.stickers || !api.stickers.search) {
        return api.sendMessage(
          "❌ نسخة الـFCA ديال البوت ما كتدعمش البحث على Facebook Stickers.",
          event.threadID
        );
      }

      const stickers = await api.stickers.search(keyword);

      if (!stickers || stickers.length === 0) {
        return api.sendMessage(
          `😔 ملقيتش ستيكرات ديال: ${keyword}`,
          event.threadID
        );
      }

      const sticker =
        stickers[Math.floor(Math.random() * stickers.length)];

      return api.sendMessage(
        { sticker: String(sticker.stickerID) },
        event.threadID
      );

    } catch (err) {
      console.error("SLKK ERROR:", err);

      return api.sendMessage(
        "❌ وقع مشكل فإرسال الستيكـر.",
        event.threadID
      );
    }
  }
};
