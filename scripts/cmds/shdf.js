const running = new Map();

module.exports = {
  config: {
    name: "msh",
    aliases: ["مسح", "mshnick"],
    version: "4.0.0",
    author: "shtot",
    countDown: 5,
    role: 1,
    shortDescription: "مسح كنيات أعضاء المجموعة",
    category: "group"
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    // إذا كانت العملية خدامة
    if (running.get(threadID)) {
      return api.sendMessage(
        "⚠️ راه عملية مسح الكنيات خدامة دابا.",
        threadID
      );
    }

    try {
      const info = await api.getThreadInfo(threadID);
      const members = info.participantIDs || [];
      const nicknames = info.nicknames || {};

      // غير الأعضاء اللي عندهم كنية
      const targets = members.filter(uid => {
        const nick = nicknames[uid];
        return typeof nick === "string" && nick.trim() !== "";
      });

      const total = targets.length;

      if (total === 0) {
        return api.sendMessage(
          "ℹ️ ماكاين حتى شي كنية باش تتمسح.",
          threadID
        );
      }

      running.set(threadID, true);

      // العدد قبل البداية
      await api.sendMessage(
        `🧹 غادي نبدا مسح الكنيات...\n\n📊 كاينين: ${total} كنية\n⚡ السرعة: جوج كنيات كل ثانية\n\n⛔ كتب: stop باش توقف`,
        threadID
      );

      let count = 0;

      for (let i = 0; i < targets.length; i += 2) {

        // التحقق واش توقفات العملية
        if (!running.get(threadID)) {
          await api.sendMessage(
            `⛔ حبست العملية.\n\n🗑️ تم مسح: ${count} كنية\n📌 بقاو: ${total - count}`,
            threadID
          );
          return;
        }

        const batch = targets.slice(i, i + 2);

        await Promise.all(
          batch.map(async uid => {
            try {
              await api.changeNickname("", threadID, uid);
              count++;
            } catch (err) {
              console.log(`تعذر مسح كنية ${uid}:`, err.message);
            }
          })
        );

        // ثانية بين كل دفعة
        if (i + 2 < targets.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      running.delete(threadID);

      await api.sendMessage(
        `✅ سالينا مسح الكنيات\n\n👥 تم مسح: ${count} كنية من أصل ${total}`,
        threadID
      );

    } catch (err) {
      running.delete(threadID);
      console.error(err);

      await api.sendMessage(
        "❌ وقع خطأ أثناء جلب معلومات المجموعة.",
        threadID
      );
    }
  },

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    const text = (event.body || "").trim().toLowerCase();

    // أمر التوقيف
    if (text === "stop") {
      if (!running.get(threadID)) {
        return api.sendMessage(
          "ℹ️ ماكاينة حتى عملية مسح خدامة دابا.",
          threadID
        );
      }

      running.set(threadID, false);

      return api.sendMessage(
        "⛔ صافي حبست عملية مسح الكنيات.",
        threadID
      );
    }
  }
};
