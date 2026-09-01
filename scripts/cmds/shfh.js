module.exports = {
  config: {
    name: "تعريف",
    aliases: [],
    version: "1.0.0",
    author: "shtot sh",
    countDown: 2,
    role: 0,
    shortDescription: "بطاقة تعريف صاحب البوت",
    category: "info"
  },

  onStart: async function ({ message }) {
    const text = `
╭━━━━━━━━━━━━━━━━━━╮
       👑 𝐒𝐇𝐓𝐎𝐓 𝐒𝐇
      𝐏𝐑𝐎𝐅𝐈𝐋𝐄
╰━━━━━━━━━━━━━━━━━━╯

👤 الاسم:
➜ 𝐒𝐀𝐀𝐃

🎂 العمر:
➜ 𝟐𝟎 سنة

🤖 صاحب البوت:
➜ 𝐒𝐇𝐓𝐎𝐓 𝐒𝐇

📘 Facebook:
➜ 𝐒𝐇𝐓𝐎𝐓 𝐒𝐇

📸 Instagram:
➜ 𝐒𝐌𝐋𝐈𝐇𝐈

━━━━━━━━━━━━━━━━━━
       ⚡ 𝐒𝐇𝐓𝐎𝐓 𝐁𝐎𝐓 ⚡
━━━━━━━━━━━━━━━━━━
`;

    return message.reply(text);
  }
};
