const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');
const chalk = require('chalk');
const NEXUS = require('../handlers/Nexus.js');
function clearRequireCache(modulePath) {
  delete require.cache[require.resolve(modulePath)];
}
/**
 *
 * @param {NEXUS} client
 * @returns
 */

function reloadCommands(client) {
  client.commands.clear();
  const loadedFiles = client.statuses; 
  const commandsTable = new AsciiTable('Commands');
  commandsTable.setHeading('Command File', 'Category', 'isPrefix', 'isSlash', 'Status');
  commandsTable.setBorder('║', '═', '✨', '✨');

  const commandDirs = fs.readdirSync('src/Commands');
  const statuses = [];

  for (const dir of commandDirs) {
    const commandFiles = fs.readdirSync(`src/Commands/${dir}`).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
      const commandPath = path.join(__dirname, '..', 'Commands', dir, file);
      try {
        clearRequireCache(commandPath);
        const command = require(commandPath);

        if (!command.name) {
          commandsTable.addRow(file, dir, '❌', '❌', chalk.red('❌'));
          continue;
        }

        client.commands.set(command.name, command);
        if (Array.isArray(command.aliases)) {
          command.aliases.forEach(alias => client.aliases.set(alias, command.name));
        }

        const isPrefix = command.command?.enabled ? '✅' : '❌';
        const isSlash = command.slashCommand?.enabled ? '✅' : '❌';

        // تحديد حالة التحميل لكل ملف
        const status = loadedFiles.has(commandPath) ? 'Reloaded' : 'Loaded';
        loadedFiles.set(commandPath, true); // بعد أول load نعلم أنه تم تحميله
        statuses.push(status);

        commandsTable.addRow(file, dir, isPrefix, isSlash, status);
      } catch (err) {
        commandsTable.addRow(file, dir, '❌', '❌', chalk.red('❌'));
        client.log(['errorColor', 'ERROR:'], ['1', `Failed to load ${file}: ${err.message}`]);
      }
    }
  }

  let overallStatus;
  if (statuses.every(s => s === 'Loaded')) overallStatus = 'Loaded';
  else if (statuses.every(s => s === 'Reloaded')) overallStatus = 'Reloaded';
  else overallStatus = 'Mixed';

  // console.log(commandsTable.toString());
  client.log(['successColor', 'SUCCESS:'], ['1', `${client.commands.size} Commands ${overallStatus}`]);

  return { slashCommandsCount: client.commands.size, messageCommandsCount: 0 };
}

module.exports = reloadCommands;
