const NEXUS = require('../handlers/Nexus.js');

/**
 * @param {NEXUS} client
 */
async function registerSlashCommands(client) {
  const { slash } = client.config;
  const allCommands = [];
  client.commands.forEach((cmd) => {
    if (!cmd.slashCommand || !cmd.slashCommand.enabled) return;
    const commandData = {
      name: cmd.name,
      description: cmd.description,
      options: cmd.options || [],
      type: cmd.type || 1,
    };

    allCommands.push(commandData);
  });

  try {
    if (slash.global) {
      await client.application.commands.set(allCommands);
      client.log(['successColor', 'SUCCESS:'], ['1', 'Global slash commands registered.']);
    } else {
      for (const guildID of slash.guildIDS) {
        const guild = await client.guilds.fetch(guildID).catch(() => null);
        if (!guild) {
          client.log(['warningColor', 'WARNING:'], ['1', `Guild with ID ${guildID} not found.`]);
          continue;
        }

        await guild.commands.set(allCommands);
        client.log(
          ['successColor', 'SUCCESS:'],
          ['1', `Slash commands registered for guild: ${guild.name} (${guildID})`],
        );
      }
    }
  } catch (error) {}
}

module.exports = registerSlashCommands;