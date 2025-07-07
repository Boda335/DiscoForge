const bot = {
  TOKEN: "BOT_TOKEN",
  PREFIX: "BOT_PREFIX",
  ID: "CLIENT_ID",
  MONGO_URL: "MONGODB_URL",
  Owners: ["OWNER_ID", "OWNER_ID2", "OWNER_ID3"],
  Dev: "[`Boda3350`](<https://discord.com/users/1139143053387509840>)",
  DevTeam: "[`neXus-Team`](https://dsc.gg/enexus)",
  errorLogs: "WEBHOOK_URL",
};

const embedSettings = {
  successcolor: "#00ff00",
  color: "#6b0901",
  wrongcolor: "#b50b0b",
};
const options = {
  embedFooter: true,
};
const emojiSettings = {
  ERROR: "✖",
  SUCCESS: "✅",
  disabled: "🔴",
  enabled: "🟢",
  cleared: "🧹",
  time: "⏲️",
  ping: "🏓",
  bot: "🤖",
};

const links = {
  inviteURL: `https://discord.com/api/oauth2/authorize?client_id=BOTID&permissions=6508997968&scope=bot%20applications.commands`,
  DiscordServer: `https://dsc.gg/enexus`,
  Devloper: `https://discord.com/users/1139143053387509840`,
};

const slashSettings = {
  global: true,
  guildIDS: ["1344065394368839701"],
};

module.exports = {
  ...bot,
  embed: embedSettings,
  emoji: emojiSettings,
  links,
  options,
  slash: slashSettings,
};
