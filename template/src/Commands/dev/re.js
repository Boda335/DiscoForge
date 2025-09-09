const reloadAll = require('../../handlers/reloadAll');
const { ApplicationCommandType } = require('discord.js');
/**
 * @type {import("../../Base/baseCommand")}
 */
module.exports = {
  name: 'reload',
  description: 'Reload commands, events, and components without restarting the bot',
  cooldown: 10,
  category: 'OWNER',
  botPermissions: [],
  userPermissions: [],
  type: ApplicationCommandType.ChatInput,
  options: [],
  command: {
    enabled: true,
    aliases: ['rl', 're'],
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
  },

  async msgExecute(client, message, args) {
    try {
      const type = args[0]?.toLowerCase() || 'all';
      const { slashCommandsCount, eventsCount, loadedCount, functionsCount } = await reloadAll(
        client,
        type,
      );

      const msgData = `\`\`\`
${['all', 'commands'].includes(type) ? `DONE Load All Commands: ${slashCommandsCount}` : ''}
${['all', 'events'].includes(type) ? `DONE Load All Events: ${eventsCount}` : ''}
${['all', 'components'].includes(type) ? `DONE Load All Components: ${loadedCount}` : ''}
${['all', 'Functions'].includes(type) ? `DONE Load All Functions: ${functionsCount}` : ''}
\`\`\``;

      await message.reply({ content: msgData });
    } catch (error) {
      client.log(['errorColor', 'ERROR:'], `Error in reload command: ${error.message}`);
      await message.reply({
        content: `An error occurred while reloading: ${error.message}`,
      });
    }
  },

  async interactionExecute(client, interaction) {
    try {
      const type = interaction.options.getString('type') || 'all';
      const { slashCommandsCount, eventsCount, loadedCount, functionsCount } = await reloadAll(
        client,
        type,
      );

      const msgData = `\`\`\`
${['all', 'commands'].includes(type) ? `DONE Load All Commands: ${slashCommandsCount}` : ''}
${['all', 'events'].includes(type) ? `DONE Load All Events: ${eventsCount}` : ''}
${['all', 'components'].includes(type) ? `DONE Load All Components: ${loadedCount}` : ''}
${['all', 'functions'].includes(type) ? `DONE Load All Functions: ${functionsCount}` : ''}
\`\`\``;

      await interaction.reply({ content: msgData });
    } catch (error) {
      client.log(['errorColor', 'ERROR:'], '1', 'Error in reload command:', error.message);
      await interaction.reply({
        content: `An error occurred while reloading: ${error.message}`,
        ephemeral: true,
      });
    }
  },

  autocompleteExecute: (client, interaction) => {},
};
