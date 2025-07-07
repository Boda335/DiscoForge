const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
/**
 * @type {import("../../Base/baseCommand")}
 */
module.exports = {
  name: "ping",
  description:
    "Ping the bot and get the current latency",
  cooldown: 10,
  category: "OWNER",
  botPermissions: [],
  userPermissions: [],
  options: [],
  command: {
    enabled: false,
    aliases: ["p", "latency"],
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
  },

  async msgExecute(client, message, args) {
    message.reply({
      content: `:ping_pong: **Pong ${client.ws.ping} ms**`,
    });
  },

  async interactionExecute(client, interaction) {
    interaction.reply({
      content: `:ping_pong: **Pong ${client.ws.ping} ms**`,
      ephemeral: true,
    });
  },

  autocompleteExecute: (client, interaction) => {},
};
