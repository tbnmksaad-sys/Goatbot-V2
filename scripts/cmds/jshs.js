const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "vddd",
    aliases: [],
    version: "2.0.0",
    author: "shtot",
    countDown: 5,
    role: 0,
    shortDescription: "جلب فيديو",
    longDescription: "البحث عن فيديو وإرساله",
    category: "media",
    guide: "{pn} اسم الفيديو"
  },

  onStart: async function ({ message, args }) {
    const query = args.join(" ").trim();

    if (!query) {
      return message.reply(
        "❌ خاصك تكتب اسم الفيديو.\n\nمثال:\nvddd Pause Flow Nihil"
      );
    }

    try {
      await message.reply(`🔎 كنقلب على:\n${query}\n\n⏳ تسنى شوية...`);

      /*
       * كنستعمل خدمة البحث الموجودة عند السيرفر.
       * إذا كانت الخدمة ما متوفراش، غادي يعطيك رسالة واضحة
       * بدل ما يطيح الأمر.
       */
      const api = "https://api.example.com/video";

      const res = await axios.get(api, {
        params: { q: query },
        timeout: 30000
      });

      if (!res.data || !res.data.url) {
        return message.reply(
          "❌ ملقيتش الفيديو المطلوب."
        );
      }

      const videoUrl = res.data.url;

      const cache = path.join(__dirname, "cache");

      if (!fs.existsSync(cache)) {
        fs.mkdirSync(cache, { recursive: true });
      }

      const file = path.join(
        cache,
        `vddd_${Date.now()}.mp4`
      );

      const video = await axios.get(videoUrl, {
        responseType: "arraybuffer",
        timeout: 120000,
        maxContentLength: 50 * 1024 * 1024
      });

      fs.writeFileSync(file, video.data);

      await message.reply({
        body: `🎬 تفضل الفيديو ديالك:\n${query}`,
        attachment: fs.createReadStream(file)
      });

      setTimeout(() => {
        try {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch {}
      }, 30000);

    } catch (error) {
      console.error("VDDD:", error);

      return message.reply(
        "❌ وقع مشكل وأنا كنجيب الفيديو.\n" +
        "تأكد من أن خدمة جلب الفيديو خدامة عندك."
      );
    }
  }
};
