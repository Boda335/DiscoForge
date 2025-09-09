const fs = require("fs");
const path = require("path");
const AsciiTable = require("ascii-table");
const chalk = require("chalk");
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
  const commandsTable = new AsciiTable("Commands");
  commandsTable.setHeading("Command File", "Category", "isPrefix", "isSlash", "Load Status");
  commandsTable.setBorder("║", "═", "✨", "✨");

  fs.readdirSync("src/Commands").forEach((dir) => {
    const commands = fs
      .readdirSync(`src/Commands/${dir}`)
      .filter(f => f.endsWith(".js"));

    for (const cmd of commands) {
      const commandPath = path.join(__dirname, "..", "Commands", dir, cmd);
      try {
        clearRequireCache(commandPath);
        const command = require(commandPath);

        if (!command.name) {
          commandsTable.addRow(cmd, dir, "❌", "❌", chalk.red("❌"));
          continue;
        }

        client.commands.set(command.name, command);
        if (Array.isArray(command.aliases)) {
          command.aliases.forEach(alias => client.aliases.set(alias, command.name));
        }

        const isPrefix = command.command?.enabled ? "✅" : "❌";
        const isSlash = command.slashCommand?.enabled ? "✅" : "❌";

        commandsTable.addRow(cmd, dir, isPrefix, isSlash, "✅");
      } catch (error) {
        commandsTable.addRow(cmd, dir, "❌", "❌", chalk.red("❌"));
        client.log(["errorColor", "ERROR:"], ["1", `Failed to load ${cmd}: ${error.message}`]);
      }
    }
  });

  // console.log(commandsTable.toString());
  client.log(["successColor", "SUCCESS:"], ["1", `${client.commands.size} Commands Reloaded`]);
  return { slashCommandsCount: client.commands.size, messageCommandsCount: 0 };
}

module.exports = reloadCommands;
