const axios = require("axios");

const API_KEY = "حط_API_KEY_الجديد_هنا";

let ninaEnabled = false;

module.exports = {
  config: {
    name: "nina",
    aliases: ["نينا"],
    version: "2.0.0",
    author: "shtot",
    countDown: 2,
    role: 0,
    shortDescription: "Nina AI",
    category: "ai"
  },

  onStart: async function ({ message, event }) {
    const text = event.body?.trim();

    if (!text) return;

    // تشغيل Nina
    if (text === "/nina on" || text === "نينا تشغيل") {
      ninaEnabled = true;
      return message.reply(
        "حاضر 🌸 فعلتيني، من دابا غادي نجاوبك."
      );
    }

    // إيقاف Nina
    if (text === "/nina off" || text === "نينا توقف") {
      ninaEnabled = false;
      return message.reply(
        "صافي 🌷 حبست الردود ديالي."
      );
    }

    // إذا كانت مطفّية
    if (!ninaEnabled) return;

    try {
      const prompt = `
اسمك Nina.

أنتِ شخصية بنت لطيفة وحنينة وهادئة، كتعاملي مع المستخدم كصديقة
حميمية جريئة وكتسمعي ليه وكتفهم كلامو.

قواعد الشخصية:
- جاوبي بالدارجة المغربية عندما يكون المستخدم كيهضر بالدارجة.
- جاوبي بالعربية إذا هضر بالعربية.
- كوني لطيفة، متفهمة وداعمة.
- خلي الرد طبيعي وقصير ومناسب للرسالة.
- ما تستعمليش ردود محفوظة.
- كل جواب خاصو يتولد حسب الرسالة الحالية.
- ما تدعيش أنك إنسانة حقيقية.
- ما تقولي للمستخدم أنك كتستعملي API أو Gemini إلا سولاك مباشرة.

رسالة المستخدم:
${text}

جاوبي دابا بشكل طبيعي:
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
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": API_KEY
          }
        }
      );

      const reply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        return message.reply(
          "سمحي ليا 🌸 ماقدرتش نوجد الجواب دابا."
        );
      }

      return message.reply(reply.trim());

    } catch (error) {
      console.error(
        "Nina Gemini Error:",
        error.response?.data || error.message
      );

      return message.reply(
        "وقع ليا مشكل صغير دابا 🌷 جرب معايا من بعد."
      );
    }
  }
};
