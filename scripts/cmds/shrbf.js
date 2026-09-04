const axios = require("axios");

const running = new Map(); // "global" => true/false
let targetImageUrl = null; // نخزنو الصورة هنا

module.exports = {
  config: {
    name: "pics",
    aliases: ["صور", "pic", "جلوبال"],
    version: "4.0.0",
    author: "shtot",
    countDown: 5,
    role: 1,
    shortDescription: "إعادة إرسال الصورة فجميع الكروبات",
    category: "fun"
  },

  onStart: async function ({ message, event, args, api }) {
    const threadID = event.threadID;

    // 1. إيقاف
    if (args[0] === "off" || args[0] === "stop") {
      if (!running.get("global")) {
        return message.reply("❌ ما كاينة حتى عملية خدامة.");
      }
      running.set("global", false);
      return message.reply("🛑 تم إيقاف الإرسال فجميع الكروبات.");
    }

    // 2. منع تشغيل 2 عمليات
    if (running.get("global")) {
      return message.reply("⚠️ راه العملية خدامة دابا فجميع الكروبات.\nاستعمل: pics off");
    }

    // 3. خاصو يرد على صورة
    if (!event.messageReply ||!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return message.reply("❌ رد على الصورة اللي بغيتي نعاودها فجميع الكروبات و كتب: pics");
    }

    const attachment = event.messageReply.attachments[0];
    if (attachment.type!== "photo") {
      return message.reply("❌ خاصك ترد على صورة.");
    }

    targetImageUrl = attachment.url;
    running.set("global", true);

    // نجيبو جميع الكروبات
    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    const groupThreads = allThreads.filter(t => t.isGroup && t.threadID);

    await message.reply(
      `🖼️ بديت الإرسال فـ ${groupThreads.length} كروب.\n` +
      `⏱️ كل 15 ثانية غادي نعاودها\n` +
      `🛑 للإيقاف: pics off`
    );

    // 4. اللوب اللانهائي
    while (running.get("global") === true) {
      try {
        const res = await axios.get(targetImageUrl, { responseType: "stream", timeout: 20000 });

        if (running.get("global")!== true) break;

        // نرسلو لجميع الكروبات
        for (const thread of groupThreads) {
          if (running.get("global")!== true) break;

          try {
            await api.sendMessage({
              body: "🔁",
              attachment: res.data
            }, thread.threadID);

            await new Promise(r => setTimeout(r, 2000)); // انتظار 2ث بين كل كروب باش منبلوكاوش
          } catch(e) {
            console.log("فشل فالكروب:", thread.threadID)
          }
        }

        // الانتظار 15 ثانية قبل الدورة الجاية
        await new Promise(resolve => setTimeout(resolve, 15000));

      } catch (error) {
        console.error("PICS GLOBAL ERROR:", error.message);
        running.set("global", false);
        return message.reply("❌ وقع خطأ. يمكن الصورة تحذفات.");
      }
    }
