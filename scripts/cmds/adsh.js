const axios = require("axios");

const API_KEY = "curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent" \
  -H 'Content-Type: application/json' \
  -H 'X-goog-api-key: AQ.Ab8RN6KST7XYogl-XpKbukJhwsLrLaUAvao7qNtlXVhUIAwgcw' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }'";

const sinaEnabled = new Map();

module.exports = {
  config: {
    name: "sina",
    aliases: ["سينا"],
    version: "3.0.0",
    author: "shtot",
    countDown: 2,
    role: 0,
    shortDescription: "Sina AI",
    category: "ai"
  },

  onStart: async function ({ message, event }) {
    const text = event.body?.trim();

    if (!text) return;

    const threadID = event.threadID;

    // تشغيل سينا
    if (
      text.toLowerCase() === "/sina on" ||
      text === "سينا تشغيل"
    ) {
      sinaEnabled.set(threadID, true);

      return message.reply(
        "حاضر 🌸 فعلتيني، من دابا سينا غادي تجاوبك."
      );
    }

    // إيقاف سينا
    if (
      text.toLowerCase() === "/sina off" ||
      text === "سينا توقف"
    ) {
      sinaEnabled.set(threadID, false);

      return message.reply(
        "صافي 🌷 حبست الردود ديالي."
      );
    }

    // سينا مطفّية
    if (sinaEnabled.get(threadID) !== true) return;

    // ما تجاوبش على أوامر البوت
    if (text.startsWith("/")) return;

    try {
      const prompt = `
اسمك Sina.

أنتِ شخصية افتراضية لطيفة وهادئة وحنينة.
تعاملي مع المستخدم بطريقة طبيعية ومحترمة.

القواعد:
- إذا هضر المستخدم بالدارجة المغربية، جاوبي بالدارجة المغربية.
- إذا هضر بالعربية، جاوبي بالعربية.
- إذا هضر بلغة أخرى، جاوبيه بنفس اللغة قدر الإمكان.
- خلي الرد طبيعي وقصير ومناسب للرسالة.
- كل جواب خاصو يتولد حسب الرسالة الحالية.
- ما تستعمليش ردود محفوظة.
- ما تدعيش أنك إنسانة حقيقية.
- ما تقولي أنك كتستعملي API أو Gemini إلا إذا سولاك مباشرة.
- جاوبي مباشرة بلا مقدمات طويلة.

رسالة المستخدم:
${text}

الجواب:
`;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 250
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": API_KEY
          },
          timeout: 30000
        }
      );

      const reply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!reply) {
        return message.reply(
          "سمحي ليا 🌸 ماقدرتش نوجد الجواب دابا."
        );
      }

      return message.reply(reply);

    } catch (error) {
      console.error(
        "Sina Gemini Error:",
        error.response?.data || error.message
      );

      return message.reply(
        "وقع ليا مشكل صغير دابا 🌷 جرب معايا من بعد."
      );
    }
  }
};
