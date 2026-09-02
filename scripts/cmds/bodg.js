const games = global.extractGames || (global.extractGames = new Map());

const LETTERS = [
  "ا","ب","ت","ث","ج","ح","خ","د","ذ","ر",
  "ز","س","ش","ص","ض","ط","ظ","ع","غ","ف",
  "ق","ك","ل","م","ن","ه","و","ي"
];

/*
 * 100 فئة
 * كل فئة فيها كلمة واحدة
 */
const WORDS = [
  { category: "الخضر", word: "طماطم" },
  { category: "الفواكه", word: "تفاح" },
  { category: "الحيوانات", word: "أسد" },
  { category: "الطيور", word: "حمامة" },
  { category: "البلدان", word: "المغرب" },
  { category: "المدن", word: "فاس" },
  { category: "المهن", word: "طبيب" },
  { category: "الأكلات", word: "كسكس" },
  { category: "المشروبات", word: "ماء" },
  { category: "الملابس", word: "قميص" },

  { category: "الأثاث", word: "كرسي" },
  { category: "المدرسة", word: "كتاب" },
  { category: "الكتابة", word: "قلم" },
  { category: "الإلكترونيات", word: "هاتف" },
  { category: "الحواسيب", word: "حاسوب" },
  { category: "السيارات", word: "تويوتا" },
  { category: "الرياضات", word: "تنس" },
  { category: "الألعاب", word: "شطرنج" },
  { category: "الألوان", word: "أحمر" },
  { category: "الأشكال", word: "دائرة" },

  { category: "الأرقام", word: "خمسة" },
  { category: "الأيام", word: "الجمعة" },
  { category: "الشهور", word: "يناير" },
  { category: "الفصول", word: "الشتاء" },
  { category: "الطقس", word: "مطر" },
  { category: "الطبيعة", word: "شجرة" },
  { category: "الزهور", word: "وردة" },
  { category: "الحشرات", word: "نحلة" },
  { category: "البحر", word: "سمكة" },
  { category: "الجبال", word: "جبل" },

  { category: "الصحراء", word: "رمل" },
  { category: "الأنهار", word: "نهر" },
  { category: "الحدائق", word: "عشب" },
  { category: "المطبخ", word: "ملعقة" },
  { category: "الحمام", word: "مرآة" },
  { category: "النوم", word: "سرير" },
  { category: "السفر", word: "حقيبة" },
  { category: "المواصلات", word: "قطار" },
  { category: "الطائرات", word: "طائرة" },
  { category: "السفن", word: "باخرة" },

  { category: "الدراجات", word: "دراجة" },
  { category: "الفضاء", word: "قمر" },
  { category: "الكواكب", word: "المريخ" },
  { category: "النجوم", word: "نجم" },
  { category: "العلوم", word: "ذرة" },
  { category: "الرياضيات", word: "مربع" },
  { category: "الطب", word: "دواء" },
  { category: "الجسم", word: "يد" },
  { category: "الوجه", word: "عين" },
  { category: "الحواس", word: "أنف" },

  { category: "العائلة", word: "أب" },
  { category: "الأطفال", word: "لعبة" },
  { category: "المنزل", word: "باب" },
  { category: "الغرف", word: "مطبخ" },
  { category: "الحديقة", word: "زهرة" },
  { category: "البحرية", word: "حوت" },
  { category: "الحيوانات البرية", word: "نمر" },
  { category: "الحيوانات الأليفة", word: "قط" },
  { category: "المزرعة", word: "بقرة" },
  { category: "الزراعة", word: "قمح" },

  { category: "الحبوب", word: "أرز" },
  { category: "التوابل", word: "فلفل" },
  { category: "الحلويات", word: "كعكة" },
  { category: "الفطور", word: "خبز" },
  { category: "الفواكه الصيفية", word: "بطيخ" },
  { category: "الفواكه الجافة", word: "لوز" },
  { category: "المكسرات", word: "جوز" },
  { category: "الألبان", word: "حليب" },
  { category: "الموسيقى", word: "غيتار" },
  { category: "الآلات الموسيقية", word: "بيانو" },

  { category: "السينما", word: "فيلم" },
  { category: "التصوير", word: "كاميرا" },
  { category: "الرسم", word: "فرشاة" },
  { category: "القراءة", word: "رواية" },
  { category: "الكتب", word: "مجلة" },
  { category: "الصحافة", word: "جريدة" },
  { category: "التلفاز", word: "شاشة" },
  { category: "الإنترنت", word: "موقع" },
  { category: "التكنولوجيا", word: "روبوت" },
  { category: "البرمجة", word: "كود" },

  { category: "الأمن", word: "شرطة" },
  { category: "الجيش", word: "جندي" },
  { category: "القانون", word: "محكمة" },
  { category: "البنوك", word: "مال" },
  { category: "التجارة", word: "متجر" },
  { category: "العمل", word: "مكتب" },
  { category: "البناء", word: "مهندس" },
  { category: "الصناعة", word: "مصنع" },
  { category: "الغابة", word: "شجرة" },
  { category: "الأشجار", word: "نخلة" },

  { category: "السماء", word: "سحاب" },
  { category: "الليل", word: "ظلام" },
  { category: "النهار", word: "شمس" },
  { category: "النار", word: "لهب" },
  { category: "الماء", word: "ماء" },
  { category: "الثلج", word: "ثلج" },
  { category: "الهواء", word: "ريح" },
  { category: "الأرض", word: "تراب" },
  { category: "الأحذية", word: "حذاء" },
  { category: "الإكسسوارات", word: "خاتم" },

  { category: "الساعات", word: "ساعة" },
  { category: "الحقائب", word: "حقيبة" },
  { category: "المفاتيح", word: "مفتاح" },
  { category: "النظافة", word: "صابون" },
  { category: "الاستحمام", word: "منشفة" },
  { category: "المكتبة", word: "رف" },
  { category: "الفصل الدراسي", word: "سبورة" },
  { category: "الجامعة", word: "طالب" },
  { category: "المطار", word: "جواز" },
  { category: "الفندق", word: "غرفة" }
];

function cleanWord(text) {
  return String(text || "")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, "")
    .toLowerCase();
}

/*
 * اختيار فئة عشوائية
 * بدون ترتيب ثابت
 */
function getRandomQuestion(game) {

  let available = WORDS.filter(
    item => !game.used.includes(item.word)
  );

  if (available.length === 0) {
    game.used = [];
    available = [...WORDS];
  }

  const question =
    available[
      Math.floor(Math.random() * available.length)
    ];

  game.used.push(question.word);

  return question;
}

function createGrid(word) {

  const size = 10;

  const grid = Array.from(
    { length: size },
    () => Array(size).fill("")
  );

  const target = cleanWord(word);

  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  let placed = false;

  for (
    let tries = 0;
    tries < 500 && !placed;
    tries++
  ) {

    const [dr, dc] =
      directions[
        Math.floor(
          Math.random() * directions.length
        )
      ];

    const row =
      Math.floor(Math.random() * size);

    const col =
      Math.floor(Math.random() * size);

    const endRow =
      row + dr * (target.length - 1);

    const endCol =
      col + dc * (target.length - 1);

    if (
      endRow < 0 ||
      endRow >= size ||
      endCol < 0 ||
      endCol >= size
    ) continue;

    let possible = true;

    for (
      let i = 0;
      i < target.length;
      i++
    ) {

      const r = row + dr * i;
      const c = col + dc * i;

      if (
        grid[r][c] &&
        grid[r][c] !== target[i]
      ) {
        possible = false;
        break;
      }
    }

    if (!possible) continue;

    for (
      let i = 0;
      i < target.length;
      i++
    ) {

      const r = row + dr * i;
      const c = col + dc * i;

      grid[r][c] = target[i];
    }

    placed = true;
  }

  for (let r = 0; r < size; r++) {

    for (let c = 0; c < size; c++) {

      if (!grid[r][c]) {

        grid[r][c] =
          LETTERS[
            Math.floor(
              Math.random() * LETTERS.length
            )
          ];
      }
    }
  }

  return grid;
}

function showGrid(grid) {

  return grid
    .map(row =>
      row
        .map(letter => `【${letter}】`)
        .join("")
    )
    .join("\n");
}

async function startRound(api, threadID) {

  const game = games.get(threadID);

  if (!game || game.stopped) return;

  /*
   * اللعبة فيها 10 جولات فقط
   */
  if (game.round > 10) {
    return finishGame(api, threadID);
  }

  game.locked = false;

  /*
   * اختيار عشوائي من 100 فئة
   */
  const question =
    getRandomQuestion(game);

  game.category =
    question.category;

  game.word =
    question.word;

  game.grid =
    createGrid(question.word);

  await api.sendMessage(

`🎮 ══════════════════
       الجولة ${game.round}/10
══════════════════

📂 الفئة:
👉 ${game.category}

🔎 جبد كلمة من فئة:
👉 ${game.category}

من داخل هاد الشبكة:

${showGrid(game.grid)}

⏱️ الوقت: 15 ثانية

🥇 أول واحد يكتب الكلمة الصحيحة
⭐ يربح نقطة!

━━━━━━━━━━━━━━━━━━`,

    threadID
  );

  if (game.timer) {
    clearTimeout(game.timer);
  }

  game.timer = setTimeout(
    async () => {

      const current =
        games.get(threadID);

      if (
        !current ||
        current.stopped ||
        current.locked
      ) return;

      current.locked = true;

      await api.sendMessage(

`⏰ سالا الوقت!

❌ ما جاوب حتى واحد.

📂 الفئة:
${current.category}

💡 الكلمة الصحيحة:
👉 ${current.word}

➡️ دوزنا للجولة الموالية...`,

        threadID
      );

      current.round++;

      setTimeout(() => {

        startRound(api, threadID);

      }, 1800);

    },
    15000
  );
}

async function finishGame(api, threadID) {

  const game =
    games.get(threadID);

  if (!game) return;

  if (game.timer) {
    clearTimeout(game.timer);
  }

  const ranking =
    [...game.scores.values()]
      .sort(
        (a, b) =>
          b.score - a.score
      );

  let result =
    "❌ ما كاين حتى لاعب جمع نقطة.";

  if (ranking.length) {

    result =
      ranking
        .map(
          (player, index) =>
            `${index + 1}. 👤 ${player.name} — ⭐ ${player.score}`
        )
        .join("\n");
  }

  let winner = "";

  if (ranking.length) {

    const best = ranking[0];

    winner =
      `\n\n👑 ═══ الفائز ═══\n\n` +
      `🏆 ${best.name}\n` +
      `⭐ ${best.score} نقطة`;
  }

  games.delete(threadID);

  await api.sendMessage(

`🏁 ══════════════════
      نهاية اللعبة
══════════════════

🎮 سالاو 10 جولات!

🏆 الترتيب النهائي:

${result}
${winner}

━━━━━━━━━━━━━━━━━━

🔄 كتب:
extract

باش تبدأ لعبة جديدة.`,

    threadID
  );
}

module.exports = {

  config: {

    name: "extract",

    aliases: [
      "استخرج",
      "استخراج",
      "كلمة"
    ],

    version: "7.0.0",

    author: "shtot",

    countDown: 3,

    role: 0,

    shortDescription:
      "لعبة استخراج الكلمات",

    category: "games"
  },

  onStart:
    async function ({ api, event }) {

      const threadID =
        event.threadID;

      if (games.has(threadID)) {

        return api.sendMessage(
          "⚠️ اللعبة راه خدامة دابا!",
          threadID
        );
      }

      games.set(
        threadID,
        {

          round: 1,

          word: null,

          category: null,

          grid: null,

          locked: false,

          stopped: false,

          timer: null,

          /*
           * الكلمات المستعملة
           */
          used: [],

          /*
           * نقاط اللاعبين
           */
          scores: new Map()
        }
      );

      await api.sendMessage(

`🎮 ══════════════════
   لعبة استخراج الكلمات
══════════════════

🔥 بدات اللعبة!

📚 100 فئة مختلفة

🔢 10 جولات فقط

⏱️ 15 ثانية لكل جولة

🥇 أول واحد يلقى الكلمة
⭐ يربح نقطة

🔀 الفئة والكلمة
كيختارهم البوت عشوائياً
من بين 100 فئة.

🏆 فالنهاية:
الأكثر ⭐ هو الفائز!

🚀 الجولة الأولى...`,

        threadID
      );

      setTimeout(() => {

        startRound(
          api,
          threadID
        );

      }, 1500);
    },

  onChat:
    async function ({ api, event }) {

      const threadID =
        event.threadID;

      const game =
        games.get(threadID);

      if (
        !game ||
        game.stopped ||
        game.locked
      ) return;

      const answer =
        cleanWord(event.body);

      if (!answer) return;

      const correct =
        cleanWord(game.word);

      /*
       * الجواب خاطئ
       */
      if (answer !== correct) return;

      /*
       * أول جواب صحيح
       */
      game.locked = true;

      if (game.timer) {
        clearTimeout(game.timer);
      }

      const userID =
        event.senderID;

      let name = "لاعب";

      try {

        const info =
          await api.getUserInfo(userID);

        if (
          info &&
          info[userID]
        ) {

          name =
            info[userID].name ||
            info[userID].firstName ||
            name;
        }

      } catch (e) {}

      /*
       * إضافة نقطة
       */
      const player =
        game.scores.get(userID);

      if (player) {

        player.score++;

      } else {

        game.scores.set(
          userID,
          {
            name: name,
            score: 1
          }
        );
      }

      const score =
        game.scores.get(userID).score;

      await api.sendMessage(

`🎉 ═══ جواب صحيح ═══

🥇 أول واحد لقاها:
👤 ${name}

📂 الفئة:
${game.category}

💡 الكلمة:
👉 ${game.word}

⭐ +1 نقطة

🏆 مجموع ${name}:
⭐ ${score}

➡️ الجولة الموالية...`,

        threadID
      );

      /*
       * الجولة الموالية
       */
      game.round++;

      /*
       * بعد الجولة 10
       * تنتهي اللعبة
       */
      if (game.round > 10) {

        return setTimeout(
          () => {
            finishGame(
              api,
              threadID
            );
          },
          1500
        );
      }

      setTimeout(
        () => {

          startRound(
            api,
            threadID
          );

        },
        1500
      );
    }
};
