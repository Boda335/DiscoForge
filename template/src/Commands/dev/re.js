const reloadCommandsAndEvents = require("../../handlers/handler");
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
  name: "reload",
  description:
    "Reload commands, events, and components without restarting the bot",
  cooldown: 10,
  category: "OWNER",
  botPermissions: [],
  userPermissions: [],
  options: [],
  command: {
    enabled:true,
    aliases: ["rl", "re"],
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
  },

  async msgExecute(client, message, args) {
    try {
      const type = args[0]?.toLowerCase() || "all";
      const { slashCommandsCount, eventsCount, interactionHandlersCount } =
        await reloadCommandsAndEvents(client, type);

      const msgData = `\`\`\`
${
  ["all", "commands"].includes(type)
    ? `DONE Load All Commands: ${slashCommandsCount}`
    : ""
}
${
  ["all", "events"].includes(type) ? `DONE Load All Events: ${eventsCount}` : ""
}
${
  ["all", "components"].includes(type)
    ? `DONE Load All Components: ${interactionHandlersCount}`
    : ""
}
\`\`\``;

      await message.reply({ content: msgData });
    } catch (error) {
      console.error(error);
      await message.reply({
        content: `❌ حدث خطأ أثناء إعادة التحميل: ${error.message}`,
      });
    }
  },

  async interactionExecute(client, interaction) {
    try {
      const type = interaction.options.getString("type") || "all";
      const { slashCommandsCount, eventsCount, interactionHandlersCount } =
        await reloadCommandsAndEvents(client, type);

      const msgData = `\`\`\`
${
  ["all", "commands"].includes(type)
    ? `DONE Load All Commands: ${slashCommandsCount}`
    : ""
}
${
  ["all", "events"].includes(type) ? `DONE Load All Events: ${eventsCount}` : ""
}
${
  ["all", "components"].includes(type)
    ? `DONE Load All Components: ${interactionHandlersCount}`
    : ""
}
\`\`\``;

      await interaction.reply({ content: msgData });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `❌ حدث خطأ أثناء إعادة التحميل: ${error.message}`,
        ephemeral: true,
      });
    }
  },

  autocompleteExecute: (client, interaction) => {},
};
