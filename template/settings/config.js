require('dotenv').config();
const bot = {
  TOKEN: process.env.TOKEN || 'BOT_TOKEN',
  PREFIX: process.env.PREFIX || 'BOT_PREFIX',
  ID: process.env.ID || 'CLIENT_ID',
  MONGO_URL: process.env.MONGO_URL || 'MONGODB_URL',
  Owners: ['OWNER_ID', 'OWNER_ID2', 'OWNER_ID3'],
  Dev: `\`\`\`[Boda3350]\`\`\`(https://discord.com/users/1139143053387509840)`,
  DevTeam: `\`\`\`[Nexus Studio Team]\`\`\`(https://discord.gg/9cfgTktxHm)`,
};

const embedSettings = {
  color: '#ff6301',
  successcolor: '#28a745',
  warningcolor: '#ffcc00',
  errorcolor: '#b50b0b',
};
const options = {
  embedFooter: true,
};
const emojiSettings = {
  ERROR: '❌',
  SUCCESS: '✅',
  disabled: '🔴',
  enabled: '🟢',
  cleared: '🧹',
  time: '⏲️',
  ping: '🏓',
  bot: '🤖',
};

const links = {
  inviteURL: `https://discord.com/api/oauth2/authorize?client_id=BOTID&permissions=6508997968&scope=bot%20applications.commands`,
  DiscordServer: `https://discord.gg/9cfgTktxHm`,
  Devloper: `https://discord.com/users/1139143053387509840`,
};

const slashSettings = {
  global: true,
  guildIDS: ['1344065394368839701'],
};

module.exports = {
  ...bot,
  embed: embedSettings,
  emoji: emojiSettings,
  links,
  options,
  slash: slashSettings,
};
