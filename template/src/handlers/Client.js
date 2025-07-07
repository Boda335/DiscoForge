const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  User,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const { options } = require("../../settings/config");
const path = require("path");
const chalk = require("chalk");

class NEXUS extends Client {
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
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
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    // 🎨 Styles
    const styles = {
      successColor: chalk.bold.green,
      warningColor: chalk.bold.yellow,
      infoColor: chalk.bold.blue,
      commandColor: chalk.bold.cyan,
      userColor: chalk.bold.magenta,
      errorColor: chalk.bold.red,
      highlightColor: chalk.bold.hex("#FFA500"),
      accentColor: chalk.bold.hex("#00FF7F"),
      secondaryColor: chalk.hex("#ADD8E6"),
      primaryColor: chalk.bold.hex("#FF1493"),
      dividerColor: chalk.hex("#FFD700"),
    };

    this.styles = styles;

    // 🧠 Collections
    this.events = new Collection();
    this.cooldowns = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.ComponentsAction = new Collection();
    this.mcategories = fs.readdirSync("src/Commands");

    // 🔧 Config
    this.config = require("../../settings/config");

    // 🖨️ Log function
    this.log = (...parts) => {
      const formatted = parts
        .map((part) => {
          if (typeof part === "string") return part;
          if (Array.isArray(part) && part.length === 2) {
            const [styleKey, text] = part;
            const colorFunc = this.styles[styleKey];
            return colorFunc ? colorFunc(text) : text;
          }
          return "";
        })
        .join(" ");
      console.log(formatted);
    };
    
  }

  start(token) {
    ["handler", "utils"].forEach((handler) => {
      require(`./${handler}`)(this);
    });
    this.login(token);
  }

  /**
   * @param {User} user
   * @returns
   */
  getFooter(user) {
    const obj = {
      text: `Requested By ${user.username || user.tag}`,
      iconURL: user.displayAvatarURL(),
    };

    return options.embedFooter ? obj : null;
  }

  embed(interaction, data) {
    let user = interaction.user ? interaction.user : interaction.author;
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch(() => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch(() => {});
    }
  }
}

module.exports = NEXUS;
