const pending = new Map();

module.exports = {
  config: {
    name: "طلبات",
    aliases: ["requests", "req"],
    version: "1.0.0",
    author: "shtot",
    countDown: 2,
    role: 2,
    shortDescription: "عرض وقبول طلبات المجموعات",
    category: "admin"
  },

  onStart: async function ({ api, event, args }) {
    try {

      // قبول طلب
      if (args[0] === "قبول" || args[0] === "accept") {
        const number = parseInt(args[1]);

        if (!number || !pending.has(event.senderID)) {
          return api.sendMessage(
            "❌ استعمل: طلبات قبول 1",
            event.threadID
          );
        }

        const list = pending.get(event.senderID);
        const item = list[number - 1];

        if (!item) {
          return api.sendMessage("❌ الرقم غير موجود.", event.threadID);
        }

        // دوال القبول الموجودة في بعض نسخ الـAPI
        const accept =
          api.acceptGroupRequest ||
          api.acceptThreadRequest ||
          api.acceptJoinRequest;

        if (typeof accept !== "function") {
          return api.sendMessage(
            "❌ نسخة الـAPI ديالك ما فيهاش دالة قبول طلبات المجموعات.",
            event.threadID
          );
        }

        await accept.call(api, item.threadID);

        pending.delete(event.senderID);

        return api.sendMessage(
          `✅ تم قبول الطلب رقم ${number}.\n📌 ${item.name || "مجموعة بدون اسم"}`,
          event.threadID
        );
      }

      // عرض المجموعات
      const threads = await api.getThreadList(
        100,
        null,
        ["INBOX"]
      );

      const groups = threads.filter(
        t => t.isGroup && t.threadID
      );

      if (!groups.length) {
        return api.sendMessage(
          "📭 ما لقيت حتى مجموعة.",
          event.threadID
        );
      }

      pending.set(event.senderID, groups);

      let msg = "📋 مجموعات البوت:\n\n";

      groups.forEach((g, i) => {
        msg += `${i + 1}️⃣ ${g.name || "بدون اسم"}\n`;
      });

      msg += `\n📊 العدد: ${groups.length}`;
      msg += `\n\nاستعمل:\nطلبات قبول 1`;

      return api.sendMessage(msg, event.threadID);

    } catch (err) {
      console.error(err);
      return api.sendMessage(
        "❌ وقع خطأ: " + err.message,
        event.threadID
      );
    }
  }
};
