const { ActivityType } = require("discord.js");
const { registerSlashCommands } = require("../../handlers/functions.js");
const Database = require("../../handlers/Database.js");
const chalk = require("chalk");
const NEXUS = require("../../handlers/Client");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {NEXUS} client
   */
  async execute(client) {
    try {
      
      const gr = chalk.hex("#00D100");
      const un = chalk.underline;
      const statuses = [
        () => `${client.guilds.cache.size} Server`,
        () =>
          `${client.guilds.cache
            .reduce((a, b) => a + b.memberCount, 0)
            .toLocaleString()} Users`,
        () => `${client.config.PREFIX}help|/help`,
        () => `https://discord.gg/Wn6z6yD7n3`,
      ];

      let index = 0;
      setInterval(() => {
        client.user.setActivity({
          name: statuses[index](),
          type: ActivityType.Listening,
        });
        index = (index + 1) % statuses.length;
      }, 10000);
      client.user.setStatus("idle");
      await Database(client);

      await registerSlashCommands(client);
      client.log(["successColor", "SUCCESS:"], ["1", `Bot logged in successfully! ${client.user.tag}`]);

      console.log(
        chalk.cyan(`Servers:` + un(`${client.guilds.cache.size}`)),
        chalk.red(
          `Users:` +
            un(
              `${client.guilds.cache
                .reduce((a, b) => a + b.memberCount, 0)
                .toLocaleString()}`
            )
        ),
        chalk.blue(
          `Commands:` +
            un(
              ` ${client.commands.size}` +
                ` TOTAL Commands ${client.commands.size}`
            )
        )
      );
    } catch (error) {
      console.error("Error in ready event:", error);
    }
  },
};
