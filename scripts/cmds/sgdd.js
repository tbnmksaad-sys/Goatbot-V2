const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "فديو",
    aliases: ["video", "vid"],
    version: "1.0.0",
    author: "shtot",
    countDown: 5,
    role: 0,
    shortDescription: "البحث عن مقطع فيديو",
    category: "media"
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply(
        "🎬 كتب شنو بغيتي نقلب ليك عليه\n\nمثال:\nفديو pause flow nihil\nفديو فيديوهات مضحكة\nفديو قطط مضحكة"
      );
    }

    const query = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(
      cacheDir,
      `video_${Date.now()}.mp4`
    );

    try {
      message.reply(`🔎 كنقلب على: ${query} ...`);

      const result = await yts.search(query);

      if (!result || !result.videos || !result.videos.length) {
        return message.reply("❌ ملقيتش فيديو مناسب لهاد البحث.");
      }

      // اختيار أول نتيجة مناسبة
      const video = result.videos[0];

      if (!video.url || !ytdl.validateURL(video.url)) {
        return message.reply("❌ وقع مشكل فالرابط ديال الفيديو.");
      }

      // تحميل الفيديو
      const stream = ytdl(video.url, {
        quality: "18",
        filter: "audioandvideo"
      });

      const writeStream = fs.createWriteStream(filePath);

      stream.pipe(writeStream);

      writeStream.on("finish", async () => {
        try {
          await message.reply({
            body:
              `🎬 ${video.title}\n\n` +
              `🔎 البحث: ${query}`,
            attachment: fs.createReadStream(filePath)
          });

          // حذف الملف من بعد الإرسال
          setTimeout(() => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }, 5000);

        } catch (err) {
          console.error(err);
          message.reply("❌ مقدرتش نصيفط الفيديو.");
        }
      });

      stream.on("error", (err) => {
        console.error(err);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        message.reply(
          "❌ مقدرتش نحمل هاد الفيديو، جرب بحث آخر."
        );
      });

    } catch (err) {
      console.error("VIDEO ERROR:", err);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      message.reply(
        "❌ وقع خطأ أثناء البحث عن الفيديو."
      );
    }
  }
};
