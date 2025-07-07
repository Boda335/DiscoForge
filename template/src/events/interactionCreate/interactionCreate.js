const {
  cooldown,
  getPermissionName,
  handleInteraction,
} = require("../../handlers/functions");
const { emoji } = require("../../../settings/config");
const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

/**
 * @type {import('../../handlers/Client').NEXUS}
 */
module.exports = {
  name: "interactionCreate",
  once: false,

  /**
   * @param {import('discord.js').Interaction} interaction
   * @param {NEXUS} client
   */
  async execute(interaction, client) {

    if (interaction.isAutocomplete()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd || typeof cmd.autocompleteExecute !== "function") return;

      try {
        await cmd.autocompleteExecute(client, interaction);
      } catch (error) {
        console.error("❌ Error in autocompleteExecute:", error);
      }
      return;
    }

    // ✅ Slash Command Handling
    if (interaction.isCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) {
        return client.embed(
          interaction,
          `${emoji.ERROR} \`${interaction.commandName}\` Command Not Found `
        );
      }

      const args = [];
      for (let option of interaction.options.data) {
        if (option.type === ApplicationCommandOptionType.Subcommand) {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }

      if (cmd) {
        if (!interaction.member.permissions.has(cmd.userPermissions)) {
          const needPerms = getPermissionName(
            new PermissionsBitField(cmd.userPermissions).bitfield
          );
          return client.embed(
            interaction,
            `**:rolling_eyes: You need ${needPerms
              .map((p) => `\`${p}\``)
              .join(", ")} for this command**`
          );
        } else if (
          !interaction.guild.members.me.permissions.has(cmd.botPermissions)
        ) {
          const needPerms = getPermissionName(
            new PermissionsBitField(cmd.botPermissions).bitfield
          );
          return client.embed(
            interaction,
            `**:rolling_eyes: I need ${needPerms
              .map((p) => `\`${p}\``)
              .join(", ")} for this command**`
          );
        } else if (cooldown(interaction, cmd)) {
          return client.embed(
            interaction,
            `**⏰ - Please wait \`${cooldown(interaction, cmd).toFixed()}\` to use this command.**`
          );
        } else if (
          cmd.category === "owner" &&
          !client.config.Owners.includes(interaction.user.id)
        ) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.embed.wrongcolor)
                .setDescription(
                  ":rolling_eyes: **This command is for the bot owner only**"
                ),
            ],
          });
        } else {
          await cmd.interactionExecute(client, interaction, args);
        }
      }
    }

    // ✅ Button / Modal / Select Menu Handling
    if (
      interaction.isButton() ||
      interaction.isModalSubmit() ||
      interaction.isAnySelectMenu()
    ) {
      const parts = interaction.customId?.split("_");
      await handleInteraction(client, interaction, parts);
    }
  },
};
