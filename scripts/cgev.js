module.exports = {
  config: {
    name: "ألعاب",
    aliases: [],
    version: "3.0.0",
    author: "shtot",
    countDown: 3,
    role: 0,
    shortDescription: "قائمة أوامر البوت",
    category: "info"
  },

  onStart: async function ({ message }) {

    const text = `
╭━━━〔 🤖 KNNN BOT 〕━━━╮
┃
┃ 🛡️ تغير كنيات والحماية
┃
┃ • /nickset Shtot
┃ • /nickset clear
┃ • /nickset lock
┃ • /nickset unlock
┃ • /nickset grouplock
┃ • /nickset groupunlock
┃ • /nickset off
┃
┃ 🧹 مسح الكنيات
┃
┃ • msh
┃
┃ 🎮 لعبة الإموجي
┃
┃ • emoji join
┃ • emoji start
┃ • emoji list
┃ • emoji stop
┃ • emoji off
┃
┃ 🧠 لعبة أسئلة ثقافة عامة
┃
┃ • quiz
┃ • quiz stop
┃ • quiz kick
┃
┃ ❌⭕ لعبة X O
┃
┃ • ttt
┃
┃ 🔁 Auto Reply
┃
┃ • autoreply on [الرسالة]
┃ • autoreply off
┃
┃ 😈 إزعاج
┃
┃ • shhh
┃
┃ 🎙️ تحويل النص إلى صوت
┃
┃ • voice
┃
┃ 👑 معلومات صاحب البوت
┃
┃ • Shtot
┃ • knnn
┃ • تعريف
┃
╰━━━━━━━━━━━━━━━━━━╯
`;

    return message.reply(text);
  }
};
