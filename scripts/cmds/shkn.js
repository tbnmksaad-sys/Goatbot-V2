module.exports.config = {
  name: "sbmm",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "shtot",
  description: "AutoReply بصورة واحدة",
  commandCategory: "الإدارة",
  usages: "sbmm تشغيل/إيقاف (رد على صورة)",
  cooldowns: 3
};

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const active = new Map();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  // إيقاف
  if (args[0] && ["off", "stop", "ايقاف", "إيقاف"].includes(args[0].toLowerCase())) {
    if (!active.has(threadID)) {
      return api.sendMessage("❌ الخدمة ماشي مفعلة.", threadID, messageID);
    }

    const data = active.get(threadID);
    active.delete(threadID);

    try {
      await fs.remove(data.image);
    } catch {}

    return api.sendMessage("🛑 تم إيقاف AutoReply.", threadID, messageID);
  }

  // التحقق من الصورة
  if (!messageReply || !messageReply.attachments) {
    return api.sendMessage(
      "📸 رد على رسالة فيها صورة ثم كتب:\nsbmm تشغيل",
      threadID,
      messageID
    );
  }

  const photo = messageReply.attachments.find(
    att => att.type === "photo" && att.url
  );

  if (!photo) {
    return api.sendMessage("❌ خاصك ترد على صورة.", threadID, messageID);
  }

  if (active.has(threadID)) {
    return api.sendMessage(
      "⚠️ AutoReply راه خدام أصلاً.",
      threadID,
      messageID
    );
  }

  const file = path.join(
    __dirname,
    "cache",
    `autoreply_${threadID}_${Date.now()}.jpg`
  );

  try {
    await fs.ensureDir(path.dirname(file));

    const response = await axios.get(photo.url, {
      responseType: "arraybuffer",
      timeout: 15000
    });

    await fs.writeFile(file, Buffer.from(response.data));

    active.set(threadID, {
      image: file,
      busy: false
    });

    return api.sendMessage(
      "✅ تم تشغيل AutoReply.\n📸 كل رسالة جديدة غادي يجاوب عليها بصورة واحدة.\n🛑 للإيقاف: sbmm off",
      threadID,
      messageID
    );

  } catch (error) {
    try {
      await fs.remove(file);
    } catch {}

    return api.sendMessage(
      "❌ وقع خطأ في تحميل الصورة.",
      threadID,
      messageID
    );
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID } = event;

  const data = active.get(threadID);
  if (!data) return;

  if (event.senderID === api.getCurrentUserID()) return;

  if (data.busy) return;

  data.busy = true;

  try {
    await sleep(800);

    await api.sendMessage(
      {
        attachment: fs.createReadStream(data.image)
      },
      threadID
    );

  } catch (error) {
    console.log("AutoReply Error:", error.message);
  } finally {
    data.busy = false;
  }
};
