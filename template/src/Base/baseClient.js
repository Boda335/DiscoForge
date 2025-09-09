// src/base/BaseNexus.js
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const UpdateChecker = require('../handlers/UpdateChecker');
class BaseNexus extends Client {
  constructor() {
    super({
      partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.MessageContent,
      ],
      shards: 'auto',
      failIfNotExists: false,
      allowedMentions: {
        parse: ['everyone', 'roles', 'users'],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });
    const styles = {
      successColor: {
        color: chalk.bold.green,
        emoji: '🟢',
      },
      warningColor: {
        color: chalk.bold.yellow,
        emoji: '🟡',
      },
      infoColor: {
        color: chalk.bold.blue,
        emoji: '🔷',
      },
      commandColor: {
        color: chalk.bold.cyan,
        emoji: '⚙️',
      },
      userColor: {
        color: chalk.bold.magenta,
        emoji: '🙍',
      },
      errorColor: {
        color: chalk.bold.red,
        emoji: '🔴',
      },
      highlightColor: {
        color: chalk.bold.hex('#FFA500'),
        emoji: '📍',
      },
      accentColor: {
        color: chalk.bold.hex('#00FF7F'),
        emoji: '💎',
      },
      secondaryColor: {
        color: chalk.hex('#ADD8E6'),
        emoji: '🔹',
      },
      primaryColor: {
        color: chalk.bold.hex('#FF1493'),
        emoji: '💠',
      },
      dividerColor: {
        color: chalk.hex('#FFD700'),
        emoji: '━',
      },
    };
    this.styles = styles;
    // 🧠 Collections
    this.events = new Collection();
    this.cooldowns = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.ComponentsAction = new Collection();
    this.mcategories = fs.readdirSync('src/Commands');

    // 🔧 Config
    this.config = require('../../settings/config');

    // 🖨️ Log function
    this.log = (...parts) => {
      const formatted = parts
        .map((part) => {
          if (typeof part === 'string') return part;

          if (Array.isArray(part) && part.length === 2) {
            const [styleKey, text] = part;
            const styleObj = this.styles[styleKey];

            if (styleObj) {
              return `${styleObj.emoji} ${styleObj.color(text)}`;
            }
            return text;
          }

          return '';
        })
        .join(' ');

      console.log(formatted);
    };
  }
  Checker() {
    setTimeout(async () => {
      try {
        const result = await UpdateChecker.checkVersionWithResult();

        if (result.success) {
          if (result.updateAvailable) {
            this.log(
              ['warningColor', 'DiscoForge has a new update available:'],
              ['infoColor', result.latest],
              ['warningColor', ', you are on'],
              ['infoColor', result.current],
            );
          } else {
            this.log(
              ['successColor', 'DiscoForge is up to date, you are on the latest version:'],
              ['infoColor', result.current],
            );
          }
        } else {
          console.error('⚠️ Update check failed:', result.error);
        }
      } catch (err) {
        console.error('⚠️ Unexpected error in Checker:', err);
      }
    }, 5000);
  }
}

module.exports = BaseNexus;
