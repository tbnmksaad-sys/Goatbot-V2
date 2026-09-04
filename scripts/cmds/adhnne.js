module.exports.config = {
  name: "سبام",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "عماد تيارتي ",
  description: "سبام صورة في جميع المجموعات مع تحديد العدد والتأخير",
  commandCategory: "الإدارة",
  usages: "[عدد المرات] [التأخير بالثواني] (رد على صورة)",
  cooldowns: 5
};

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  // التحقق من الرد على صورة
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("❌ يجب عليك الرد على رسالة تحتوي على صورة!", threadID, messageID);
  }

  const imageAttachments = messageReply.attachments.filter(att => att.type === "photo");
  if (imageAttachments.length === 0) {
      return api.sendMessage("❌ الرسالة يجب أن تحتوي على صورة!", threadID, messageID);
  }

  // التحقق من المعاملات
  if (args.length < 2) {
      return api.sendMessage("⚠️ الاستخدام: سبام [عدد المرات] [التأخير بالثواني]", threadID, messageID);
  }

  const count = parseInt(args[0]);
  const delay = parseFloat(args[1]);

  if (isNaN(count) || isNaN(delay) || count <= 0 || delay < 0) {
      return api.sendMessage("❌ يجب أن يكون العدد رقم موجب والتأخير رقم غير سالب!", threadID, messageID);
  }

  if (count > 100) {
      return api.sendMessage("⚠️ العدد الأقصى هو 100 رسالة!", threadID, messageID);
  }

  if (delay > 60) {
      return api.sendMessage("⚠️ التأخير الأقصى هو 60 ثانية!", threadID, messageID);
  }

  // حفظ الصور مؤقتاً
  const imagePaths = [];
  try {
      for (let i = 0; i < imageAttachments.length; i++) {
          const url = imageAttachments[i].url;
          const imgPath = path.join(__dirname, `cache/spam_image_${Date.now()}_${i}.jpg`);
          const response = await axios.get(url, { responseType: 'arraybuffer' });
          fs.writeFileSync(imgPath, Buffer.from(response.data));
          imagePaths.push(imgPath);
      }

      // الحصول على قائمة المجموعات
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      const groupThreads = threadList.filter(thread => thread.isGroup && thread.threadID !== threadID);

      if (groupThreads.length === 0) {
          return api.sendMessage("❌ لا توجد مجموعات متاحة للإرسال إليها!", threadID, messageID);
      }

      api.sendMessage(`🚀 بدء السبام في ${groupThreads.length} مجموعة\n📊 عدد المرات: ${count}\n⏰ التأخير: ${delay} ثانية`, threadID, messageID);

      let successCount = 0;
      let errorCount = 0;

      // إرسال الرسائل
      for (let i = 0; i < count; i++) {
          for (const group of groupThreads) {
              try {
                  // إضافة مؤشر الكتابة
                  api.sendTypingIndicator(group.threadID);

                  // تأخير عشوائي صغير لتجنب الحظر
                  await sleep(Math.random() * 1000 + 500);

                  // إنشاء مرفقات الصور
                  const attachments = imagePaths.map(imgPath => fs.createReadStream(imgPath));

                  // إرسال الرسالة
                  await api.sendMessage({
                      attachment: attachments
                  }, group.threadID);

                  successCount++;
              } catch (error) {
                  console.log(`خطأ في إرسال للمجموعة ${group.threadID}:`, error.message);
                  errorCount++;
              }
          }

          // التأخير بين الدورات (إلا في الدورة الأخيرة)
          if (i < count - 1 && delay > 0) {
              await sleep(delay * 1000);
          }

          // تقرير التقدم كل 10 دورات
          if ((i + 1) % 10 === 0) {
              api.sendMessage(`📈 التقدم: ${i + 1}/${count} - نجح: ${successCount} - فشل: ${errorCount}`, threadID);
          }
      }

      // تنظيف الملفات المؤقتة
      imagePaths.forEach(imgPath => {
          try {
              fs.unlinkSync(imgPath);
          } catch (err) {
              console.log("خطأ في حذف الملف:", err);
          }
      });

      // تقرير نهائي
      api.sendMessage(`✅ تم الانتهاء من السبام!\n📈 النتائج النهائية:\n- المجموعات: ${groupThreads.length}\n- المرات: ${count}\n- نجح: ${successCount}\n- فشل: ${errorCount}\n- معدل النجاح: ${((successCount / (successCount + errorCount)) * 100).toFixed(2)}%`, threadID);

  } catch (error) {
      // تنظيف الملفات في حالة حدوث خطأ
      imagePaths.forEach(imgPath => {
          try {
              fs.unlinkSync(imgPath);
          } catch (err) {
              console.log("خطأ في حذف الملف:", err);
          }
      });

      console.error("خطأ في سبام الصورة:", error);
      api.sendMessage(`❌ حدث خطأ أثناء السبام: ${error.message}`, threadID, messageID);
  }
};
