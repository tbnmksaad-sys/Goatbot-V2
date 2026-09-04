const fs = require("fs-extra");
const path = require("path");

const qqqqGroups = new Map();

module.exports = {
  config: {
    name: "qqqq",
    aliases: [],
    version: "1.0.0",
    author: "shtot",
    countDown: 2,
    role: 1,
    shortDescription: "AutoReply بصورة",
    category: "admin"
  },

  onStart: async function ({ message, event, args }) {
    const threadID = event.threadID;

    // إيقاف
    if (args[0]?.toLowerCase() === "off") {
      const data = qqqqGroups.get(threadID);

      if (!data) {
        return message.reply("⚠️ الخدمة ماشي مفعلة.");
      }

      qqqqGroups.delete(threadID);

      try {
        if (data.file && await fs.pathExists(data.file)) {
          await fs.remove(data.file);
        }
      } catch (e) {}

      return message.reply("🛑 تم إيقاف QQQQ.");
    }

    // التشغيل
    if (args[0]?.toLowerCase() !== "on") {
      return message.reply(
        "📌 طريقة الاستعمال:\n\n" +
        "1️⃣ رد على رسالة فيها صورة\n" +
        "2️⃣ كتب: qqqq on\n\n" +
        "🛑 للإيقاف:\n" +
        "qqqq off"
      );
    }

    // التحقق من الرد على صورة
    if (!event.messageReply || !event.messageReply.attachments) {
      return message.reply(
        "📸 خاصك ترد على رسالة فيها صورة ثم تكتب:\nqqqq on"
      );
    }

    const photo = event.messageReply.attachments.find(
      att => att.type === "photo" && att.url
    );

    if (!photo) {
      return message.reply("❌ الرسالة اللي رديتي عليها ما فيهاش صورة.");
    }

    if (qqqqGroups.has(threadID)) {
      return message.reply("⚠️ QQQQ راه خدام أصلاً فهاد المجموعة.");
    }

    const cacheDir = path.join(__dirname, "cache");

    await fs.ensureDir(cacheDir);

    const file = path.join(
      cacheDir,
      `qqqq_${threadID}_${Date.now()}.jpg`
    );

    try {
      const response = await global.utils.downloadFile(
        photo.url,
        file
      );

      if (!response) {
        throw new Error("فشل تحميل الصورة");
      }

      qqqqGroups.set(threadID, {
        file: file,
        busy: false
      });

      return message.reply(
        "✅ تم تشغيل QQQQ\n\n" +
        "📸 كل رسالة جديدة غادي يجاوب عليها بصورة واحدة.\n" +
        "🛑 للإيقاف: qqqq off"
      );

    } catch (error) {
      try {
        if (await fs.pathExists(file)) {
          await fs.remove(file);
        }
      } catch (e) {}

      console.error("QQQQ Download Error:", error);

      return message.reply("❌ وقع مشكل فتحميل الصورة.");
    }
  },

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;

    const data = qqqqGroups.get(threadID);

    if (!data) return;

    // تجاهل رسائل البوت
    if (event.senderID === api.getCurrentUserID()) return;

    // منع الردود المتزامنة
    if (data.busy) return;

    data.busy = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      await api.sendMessage(
        {
          attachment: fs.createReadStream(data.file)
        },
        threadID
      );

    } catch (error) {
      console.error("QQQQ Error:", error);
    } finally {
      data.busy = false;
    }
  }
};
