module.exports = {
  config: {
    name: "games",
    aliases: [],
    version: "4.0.0",
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
┃ 🛡️ تغيير الكنيات والحماية
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
┃ 🎮 لعبة الإيموجي
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
┃ 🔁 الرد التلقائي
┃
┃ • autoreply on [message]
┃ • autoreply off
┃
┃ 😈 الإزعاج
┃
┃ • shhh
┃
┃ 🎙️ تحويل النص إلى صوت
┃
┃ • voice
┃
┃ 👑 معلومات صاحب البوت
┃
┃ • تعريف-knnn
┃
╰━━━━━━━━━━━━━━━━━━╯
`;

    return message.reply(text);
  }
};
