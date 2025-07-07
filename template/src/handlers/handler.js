const path = require("path");
const fs = require("fs");
const nexus = require("./Client");
const { reloadAllHandlers } = require("../handlers/functions");

function clearRequireCache(modulePath) {
  delete require.cache[require.resolve(modulePath)];
}

/**
 *
 * @param {nexus} client
 * @returns
 */
function reloadCommands(client) {
  client.commands.clear();
  let allCommands = [];

  fs.readdirSync("src/Commands").forEach((dir) => {
    const commands = fs
      .readdirSync(`src/Commands/${dir}`)
      .filter((f) => f.endsWith(".js"));

    for (const cmd of commands) {
      const commandPath = path.join(__dirname, "..", "Commands", dir, cmd);
      clearRequireCache(commandPath);

      const command = require(commandPath);
      if (command.name) {
        client.commands.set(command.name, command);
        if (Array.isArray(command.aliases)) {
          command.aliases.forEach((alias) => {
            client.aliases.set(alias, command.name);
          });
        }

        allCommands.push(command);
      } else {
        console.log(`${cmd} is not ready`);
      }
    }
  });

  client.log(["successColor", "SUCCESS:"], ["1", `${client.commands.size} Commands Reloaded`]);
  return {
    slashCommandsCount: client.commands.size,
    messageCommandsCount: 0,
  };
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".js")) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

/**
 *
 * @param {nexus} client
 * @returns
 */
function reloadEvents(client) {
  client.removeAllListeners();
  const eventFiles = getAllFiles("src/events");
  let eventCount = 0;

  for (const file of eventFiles) {
    clearRequireCache(path.resolve(file));
    const event = require(path.resolve(file));

    if (!event.name || typeof event.execute !== "function") {
      client.log(["warningColor", "WARNING:"], ["1", `Skipping ${file} (missing name or execute function)`]);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    eventCount++;
  }

  client.log(["successColor", "SUCCESS:"], ["1", `${eventCount} Events Reloaded`]);
  return eventCount;
}
async function reloadCommandsAndEvents(client) {
  try {
    const commandsInfo = reloadCommands(client);
    const eventsCount = reloadEvents(client);
    const { interactionHandlersCount } = await reloadAllHandlers(client);

    return {
      slashCommandsCount: commandsInfo.slashCommandsCount,
      messageCommandsCount: 0,
      eventsCount: eventsCount,
      interactionHandlersCount: interactionHandlersCount,
    };
  } catch (error) {
    console.log("Error reloading commands and events:", error);
    throw error;
  }
}

module.exports = reloadCommandsAndEvents;
