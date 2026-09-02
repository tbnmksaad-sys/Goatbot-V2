const autoReplyGroups = new Map();

module.exports = {
  config: {
    name: "autoreply",
    aliases: ["ar"],
    version: "1.0.0",
    author: "shtot",
    countDown: 1,
    role: 1,
    shortDescription: "4 ردود تلقائية مقابل كل رسالة",
    category: "fun"
  },

  onStart: async function ({ message, event, args }) {
    const threadID = event.threadID;

    // إيقاف
    if (args[0]?.toLowerCase() === "off") {
      autoReplyGroups.delete(threadID);
      return message.reply("🛑 تم إيقاف Auto Reply.");
    }

    // تشغيل
    if (args[0]?.toLowerCase() === "on") {
      const replyText = args.slice(1).join(" ");

      if (!replyText) {
        return message.reply(
          "⚠️ خاصك تحدد الرسالة.\n\nمثال:\nautoreply on KNNN 😂"
        );
      }

      autoReplyGroups.set(threadID, replyText);

      return message.reply(
        `✅ تم تشغيل Auto Reply\n🔁 كل رسالة = 4 ردود\n💬 الرد: ${replyText}`
      );
    }

    return message.reply(
      "📌 الاستعمال:\n\n" +
      "autoreply on [الرسالة]\n" +
      "autoreply off"
    );
  },

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!autoReplyGroups.has(threadID)) return;

    // تجاهل رسائل البوت
    if (event.senderID === api.getCurrentUserID()) return;

    const replyText = autoReplyGroups.get(threadID);

    try {
      for (let i = 0; i < 4; i++) {
        await api.sendMessage(replyText, threadID);
      }
    } catch (error) {
      console.error("AutoReply Error:", error);
    }
  }
};
