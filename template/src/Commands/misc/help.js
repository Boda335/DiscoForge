const { ApplicationCommandType } = require('discord.js');

/**
 * @type {import("../../Base/baseCommand")}
 */
module.exports = {
  name: 'help',
  description: 'Get help with the bot commands',
  cooldown: 10,
  category: 'misc',
  botPermissions: ['SendMessages'],
  userPermissions: ['SendMessages'],
  options: [],
  type: ApplicationCommandType.ChatInput,
  command: {
    enabled: true,
    aliases: ["helpme", "commands", "cmd"],
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
  },

  async msgExecute(client, message, args) {
    try {
      client.handleHelpSystem(message);
    } catch (error) {
      client.log(
        ['errorColor', 'ERROR:'],
        ['1', `An error occurred while executing the help command: ${error.message}`],
      );
      message.reply({
        content: `An error occurred while executing the help command: ${error.message}`,
      });
    }
  },

  async interactionExecute(client, interaction) {
    try {
      client.handleHelpSystem(interaction);
    } catch (error) {
      client.log(
        ['errorColor', 'ERROR:'],
        ['1', `An error occurred while executing the help command: ${error.message}`],
      );
      interaction.reply({
        content: `An error occurred while executing the help command: ${error.message}`,
        ephemeral: true,
      });
    }
  },

  async autocompleteExecute(client, interaction) {},
};
