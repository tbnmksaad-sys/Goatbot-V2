const targets = new Map();

module.exports = {
  config: {
    name: "shhh",
    aliases: ["replyshhh"],
    version: "2.1.0",
    author: "saad",
    countDown: 2,
    role: 1,
    shortDescription: "Auto reply to any selected user",
    category: "group"
  },

  onStart: async function ({ message, args, event }) {

    // =========================
    // 🛑 إيقاف الاستهداف
    // =========================
    if (args[0]?.toLowerCase() === "stop") {
      const uid = args[1];

      if (!uid) {
        return message.reply(
          "❌ الاستعمال الصحيح:\n" +
          "/shhh stop ID"
        );
      }

      const key = `${event.threadID}:${uid}`;

      if (!targets.has(key)) {
        return message.reply(
          "⚠️ ما كاين حتى استهداف مفعل على هاد الشخص."
        );
      }

      targets.delete(key);

      return message.reply(
        `🛑 تم توقيف الاستهداف على ID: ${uid}`
      );
    }

    // =========================
    // ▶️ تفعيل الاستهداف
    // =========================
    const uid = args[0];

    if (!uid) {
      return message.reply(
        "❌ الاستعمال:\n\n" +
        "/shhh ID الكلمة\n" +
        "/shhh stop ID\n\n" +
        "مثال:\n" +
        "/shhh 123456789 سلام"
      );
    }

    const replyText = args.slice(1).join(" ");

    if (!replyText) {
      return message.reply(
        "❌ خاصك تحدد الكلمة اللي غادي يرد بها البوت."
      );
    }

    const key = `${event.threadID}:${uid}`;

    targets.set(key, replyText);

    return message.reply(
      `✅ تم تفعيل الاستهداف!\n\n` +
      `👤 ID: ${uid}\n` +
      `💬 الرد: ${replyText}`
    );
  },

  // =========================
  // 🤖 مراقبة رسائل أي شخص
  // =========================
  onChat: async function ({ event, message }) {
    if (!event.threadID || !event.senderID) return;

    // ما يجاوبش على رسائل البوت
    if (event.senderID === global.GoatBot?.botID) return;

    const key = `${event.threadID}:${event.senderID}`;
    const replyText = targets.get(key);

    if (!replyText) return;

    await message.reply(replyText);
  }
};
