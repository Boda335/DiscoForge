const reloadCommands = require("./CommandLoader");
const reloadEvents = require("./EventsLoader");
const reloadFunctions = require("./FunctionsLoader");
const reloadInteractions = require("./ComponentsLoader");

async function reloadAll(client) {
  try {
    const commandsInfo = reloadCommands(client);
    const eventsCount = reloadEvents(client);
    const functionsCount = reloadFunctions(client);
    const  loadedCount  = await reloadInteractions(client);

    return {
      slashCommandsCount: commandsInfo.slashCommandsCount,
      messageCommandsCount: 0,
      eventsCount,
      functionsCount,
      loadedCount,
    };
  } catch (error) {
    console.log("Error reloading all handlers:", error);
    throw error;
  }
}

module.exports = reloadAll;
