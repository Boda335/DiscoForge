const NEXUS = require('../handlers/Nexus.js');
const fs = require('fs');
const path = require('path');

/**
 * @param {NEXUS} client
 * @param {import('discord.js').Interaction} interaction
 */
async function handleInteraction(client, interaction) {
  if (!interaction.customId) {
    console.error('The interaction does not have a customId.');
    return;
  }

  const interactionsPath = path.join(__dirname, '../ComponentsAction/');
  const parts = interaction.customId?.split('_');

  const getAllFiles = (dirPath) => {
    let results = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(filePath));
      } else if (filePath.endsWith('.js')) {
        results.push(filePath);
      }
    }

    return results;
  };

  const interactionFiles = getAllFiles(interactionsPath);

  for (const file of interactionFiles) {
    try {
      const handler = require(file);
      if (typeof handler !== 'object' || !handler.action) continue;
      if (handler.enabled === false) continue;

      const matchByName = interaction.customId === handler.name;
      const matchByCustom = handler.customId && interaction.customId === handler.customId;
      const matchByPrefix = handler.name && handler.name.startsWith(parts[0]);

      if (matchByName || matchByCustom || matchByPrefix) {
        if (
          handler.userPermissions &&
          !interaction.member.permissions.has(handler.userPermissions)
        ) {
          return interaction.reply({
            content: `🚫 You need \`${handler.userPermissions.join(
              ', ',
            )}\` to use this interaction.`,
            ephemeral: true,
          });
        }

        if (
          handler.botPermissions &&
          !interaction.guild.members.me.permissions.has(handler.botPermissions)
        ) {
          return interaction.reply({
            content: `🤖 I need \`${handler.botPermissions.join(', ')}\` to perform this action.`,
            ephemeral: true,
          });
        }

        await handler.action(client, interaction, parts);
        return;
      }
    } catch (error) {
      console.error(`✖ Failed to handle interaction from file ${file}:`, error);
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'There was an error while executing the interaction.',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing the interaction.',
            ephemeral: true,
          });
        }
      } catch (e) {
        console.error('❗ Failed to send error reply:', e);
      }
    }
  }
}

module.exports = handleInteraction;
