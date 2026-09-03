const fs = require("fs");
const path = require("path");
const axios = require("axios");

const DATA_DIR = path.join(__dirname, "stk_data");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFile(threadID) {
    return path.join(DATA_DIR, `${threadID}.json`);
}

function loadStickers(threadID) {
    const file = getFile(threadID);

    if (!fs.existsSync(file))
        return [];

    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
        return [];
    }
}

function saveStickers(threadID, stickers) {
    fs.writeFileSync(
        getFile(threadID),
        JSON.stringify(stickers, null, 2)
    );
}

module.exports = {
    config: {
        name: "stk",
        aliases: ["sticker", "ستيكر"],
        version: "1.0.0",
        author: "shtot",
        countDown: 2,
        role: 0,
        shortDescription: "حفظ وإرسال الستيكـرات",
        category: "fun"
    },

    onStart: async function ({ message, event, args }) {

        const threadID = event.threadID;
        let stickers = loadStickers(threadID);

        // =========================
        // stk
        // إرسال ستيكر عشوائي
        // =========================
        if (args.length === 0) {

            if (stickers.length === 0) {
                return message.reply(
                    "😔 ما عندك حتى ستيكر محفوظ.\n\n" +
                    "📌 رد على صورة وكتب:\n" +
                    "stk save"
                );
            }

            const random =
                stickers[Math.floor(Math.random() * stickers.length)];

            return message.reply({
                attachment: {
                    type: "image",
                    payload: {
                        url: random.url
                    }
                }
            });
        }

        const command = args[0].toLowerCase();

        // =========================
        // stk save
        // حفظ صورة بالرد
        // =========================
        if (command === "save") {

            const reply = event.messageReply;

            if (!reply || !reply.attachments || reply.attachments.length === 0) {
                return message.reply(
                    "❌ خاصك ترد على صورة أولاً.\n\n" +
                    "مثال:\n" +
                    "رد على الصورة وكتب stk save"
                );
            }

            const image = reply.attachments.find(
                att => att.type === "photo" || att.type === "image"
            );

            if (!image || !image.url) {
                return message.reply(
                    "❌ هادي ماشي صورة صالحة للحفظ."
                );
            }

            try {

                const response = await axios.get(image.url, {
                    responseType: "arraybuffer"
                });

                const id = Date.now();
                const fileName = `${threadID}_${id}.jpg`;
                const filePath = path.join(DATA_DIR, fileName);

                fs.writeFileSync(filePath, response.data);

                // رابط الصورة الأصلي كيستعمل للإرسال
                stickers.push({
                    id: id,
                    url: image.url
                });

                saveStickers(threadID, stickers);

                return message.reply(
                    `✅ تحفظ الستيكـر بنجاح!\n\n` +
                    `🎨 الرقم ديالو: ${stickers.length}\n` +
                    `📦 عندك دابا: ${stickers.length} ستيكر`
                );

            } catch (error) {
                console.error(error);

                return message.reply(
                    "❌ وقع مشكل وأنا كنحاول نحفظ الستيكـر."
                );
            }
        }

        // =========================
        // stk list
        // =========================
        if (
            command === "list" ||
            command === "count" ||
            command === "عدد"
        ) {

            if (stickers.length === 0) {
                return message.reply(
                    "📦 عندك 0 ستيكر محفوظ."
                );
            }

            let text =
                `🎨 عندك ${stickers.length} ستيكر محفوظ:\n\n`;

            stickers.forEach((sticker, index) => {
                text += `🖼️ ستيكر ${index + 1}\n`;
            });

            return message.reply(text);
        }

        // =========================
        // stk رقم
        // إرسال ستيكر محدد
        // =========================
        if (/^\d+$/.test(command)) {

            const number = parseInt(command);

            if (number < 1 || number > stickers.length) {
                return message.reply(
                    `❌ ما كاينش ستيكر رقم ${number}.\n\n` +
                    `📦 عندك غير ${stickers.length} ستيكر.`
                );
            }

            const sticker = stickers[number - 1];

            return message.reply({
                attachment: {
                    type: "image",
                    payload: {
                        url: sticker.url
                    }
                }
            });
        }

        // =========================
        // stk del رقم
        // =========================
        if (
            command === "del" ||
            command === "delete" ||
            command === "حذف"
        ) {

            const number = parseInt(args[1]);

            if (!number || number < 1 || number > stickers.length) {
                return message.reply(
                    `❌ الرقم غير صحيح.\n📦 عندك ${stickers.length} ستيكر.`
                );
            }

            stickers.splice(number - 1, 1);

            saveStickers(threadID, stickers);

            return message.reply(
                `🗑️ تحيد الستيكـر رقم ${number} بنجاح.\n` +
                `📦 بقاو عندك ${stickers.length} ستيكر.`
            );
        }

        // =========================
        // stk clear
        // =========================
        if (
            command === "clear" ||
            command === "مسح"
        ) {

            if (stickers.length === 0) {
                return message.reply(
                    "📦 ما عندك حتى ستيكر باش تمسحو."
                );
            }

            saveStickers(threadID, []);

            return message.reply(
                "🗑️ تم مسح جميع الستيكـرات ديال هاد المجموعة."
            );
        }

        // =========================
        // المساعدة
        // =========================
        return message.reply(
            "🎨 نظام الستيكـرات\n\n" +
            "📌 الأوامر:\n\n" +
            "• stk\n" +
            "إرسال ستيكر عشوائي\n\n" +
            "• stk save\n" +
            "حفظ صورة بالرد عليها\n\n" +
            "• stk list\n" +
            "شوف شحال عندك\n\n" +
            "• stk 1\n" +
            "إرسال الستيكـر رقم 1\n\n" +
            "• stk del 1\n" +
            "حذف الستيكـر رقم 1\n\n" +
            "• stk clear\n" +
            "مسح جميع الستيكـرات"
        );
    }
};
