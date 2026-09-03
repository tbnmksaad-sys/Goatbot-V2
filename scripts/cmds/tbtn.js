const running = new Map();
const nicknameLocks = new Map();
const groupNameLocks = new Map();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  config: {
    name: "nickset",
    aliases: ["nick"],
    version: "3.0.0",
    author: "shtot",
    countDown: 3,
    role: 1,
    shortDescription: "Manage group nicknames and group name lock",
    category: "group",
    guide: {
      en:
        "{pn} <nickname>\n" +
        "{pn} clear\n" +
        "{pn} lock\n" +
        "{pn} unlock\n" +
        "{pn} grouplock\n" +
        "{pn} groupunlock\n" +
        "{pn} off"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    const threadID = event.threadID;
    const action = args[0]?.toLowerCase();

    // STOP nickname process
    if (action === "off") {
      running.set(threadID, false);
      return message.reply("🛑 Nickname process stopped.");
    }

    // UNLOCK NICKNAMES
    if (action === "unlock") {
      nicknameLocks.delete(threadID);
      return message.reply("🔓 Nickname lock disabled.");
    }

    // LOCK NICKNAMES
    if (action === "lock") {
      try {
        const info = await api.getThreadInfo(threadID);
        const saved = {};

        for (const uid of info.participantIDs) {
          saved[uid] = info.nicknames?.[uid] || "";
        }

        nicknameLocks.set(threadID, saved);

        return message.reply(
          "🔒 Nickname lock enabled.\n" +
          "Saved nicknames will be restored if they change."
        );
      } catch (err) {
        console.error(err);
        return message.reply("❌ Could not enable nickname lock.");
      }
    }

    // 🔒 GROUP NAME LOCK
    if (action === "grouplock") {
      try {
        const info = await api.getThreadInfo(threadID);

        groupNameLocks.set(threadID, info.threadName || "");

        return message.reply(
          `🔒 Group name locked.\n` +
          `Saved name: ${info.threadName || "(no name)"}`
        );
      } catch (err) {
        console.error(err);
        return message.reply("❌ Could not lock group name.");
      }
    }

    // 🔓 GROUP NAME UNLOCK
    if (action === "groupunlock") {
      groupNameLocks.delete(threadID);

      return message.reply(
        "🔓 Group name lock disabled."
      );
    }

    // CLEAR OR SET NICKNAMES
    const clear = action === "clear";

    if (!clear && args.length === 0) {
      return message.reply(
        "❌ Usage:\n\n" +
        "/nickset Shtot\n" +
        "/nickset clear\n" +
        "/nickset lock\n" +
        "/nickset unlock\n" +
        "/nickset grouplock\n" +
        "/nickset groupunlock\n" +
        "/nickset off"
      );
    }

    if (running.get(threadID)) {
      return message.reply(
        "⚠️ A nickname process is already running."
      );
    }

    running.set(threadID, true);

    try {
      const info = await api.getThreadInfo(threadID);
      const members = info.participantIDs;

      // Save current nicknames before clearing
      if (clear) {
        const saved = {};

        for (const uid of members) {
          saved[uid] = info.nicknames?.[uid] || "";
        }

        nicknameLocks.set(threadID, saved);
      }

      const newNickname = args.join(" ");

      await message.reply(
        clear
          ? `🧹 Clearing nicknames of ${members.length} members...`
          : `🚀 Changing nicknames of ${members.length} members...`
      );

      // 5 members per batch
      for (let i = 0; i < members.length; i += 5) {

        if (running.get(threadID) === false) {
          running.delete(threadID);
          return message.reply("🛑 Process stopped.");
        }

        const batch = members.slice(i, i + 5);

        await Promise.all(
          batch.map(async uid => {
            try {
              await api.changeNickname(
                clear ? "" : newNickname,
                threadID,
                uid
              );
            } catch (err) {
              console.log(
                `Failed for ${uid}: ${err.message}`
              );
            }
          })
        );

        if (i + 5 < members.length) {
          await sleep(500);
        }
      }

      running.delete(threadID);

      return message.reply(
        clear
          ? "✅ All nicknames cleared."
          : "✅ All nicknames changed."
      );

    } catch (err) {
      running.delete(threadID);
      console.error(err);

      return message.reply(
        "❌ An error occurred."
      );
    }
  },

  // WATCH GROUP EVENTS
  onEvent: async function ({ event, api }) {
    const threadID = event.threadID;

    /*
     * 🔒 GROUP NAME LOCK
     */
    if (groupNameLocks.has(threadID)) {
      const savedName = groupNameLocks.get(threadID);

      try {
        const info = await api.getThreadInfo(threadID);
        const currentName = info.threadName || "";

        if (currentName !== savedName) {
          try {
            await api.setTitle(
              savedName,
              threadID
            );
          } catch (err) {
            console.log(
              "Could not restore group name:",
              err.message
            );
          }
        }
      } catch (err) {
        console.log(
          "Group name lock error:",
          err.message
        );
      }
    }

    /*
     * 🔒 NICKNAME LOCK
     */
    if (!nicknameLocks.has(threadID)) {
      return;
    }

    const saved = nicknameLocks.get(threadID);

    if (
      event.logMessageType === "log:thread-name" ||
      event.logMessageType === "log:subscribe" ||
      event.logMessageType === "log:unsubscribe"
    ) {
      return;
    }

    try {
      const info = await api.getThreadInfo(threadID);

      for (const uid of info.participantIDs) {
        if (!(uid in saved)) continue;

        const current = info.nicknames?.[uid] || "";
        const original = saved[uid] || "";

        if (current !== original) {
          try {
            await api.changeNickname(
              original,
              threadID,
              uid
            );
          } catch (err) {
            console.log(
              `Could not restore nickname for ${uid}:`,
              err.message
            );
          }
        }
      }
    } catch (err) {
      console.log(
        "Nickname lock error:",
        err.message
      );
    }
  }
};
