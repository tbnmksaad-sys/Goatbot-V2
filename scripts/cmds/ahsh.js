module.exports = {
  config: {
    name: "knnn",
    aliases: ["knnn2"],
    version: "5.7.0",
    author: "knnn",
    countDown: 3,
    role: 0,
    shortDescription: "KNNN loading animation",
    category: "fun"
  },

  onStart: async function ({ api, event }) {

    const bars = [
      "▰▰▱▱▱▱▱▱▱▱ 25%",
      "▰▰▰▰▰▱▱▱▱▱ 50%",
      "▰▰▰▰▰▰▰▱▱▱ 75%",
      "▰▰▰▰▰▰▰▰▰▰ 100% ✅"
    ];

    const msg = await api.sendMessage(
      "⏳ جاري التحميل...\n\n" + bars[0],
      event.threadID
    );

    for (let i = 1; i < bars.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        await api.editMessage(
          "⏳ جاري التحميل...\n\n" + bars[i],
          msg.messageID
        );
      } catch (error) {
        console.error("Loading error:", error);
        return;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      await api.editMessage(
        "╭━━━〔 👑 shtot 👑 〕━━━╮\n" +
        "┃\n" +
        "┃  ✨ سحتوت ✨\n" +
        "┃  📸 Insta: smlihi\n" +
        "┃  📘 Facebook: shtot sh\n" +
        "┃  🔥  بووت سحتوت⚠️🦅 👑\n" +
        "┃\n" +
        "╰━━━━━━━━━━━━━━━━━━╯",
        msg.messageID
      );
    } catch (error) {
      console.error("Final message error:", error);
    }
  }
};
