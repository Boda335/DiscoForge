const { ActivityType } = require("discord.js");
const registerSlashCommands = require("../../functions/registerSlashCommands");
const Database = require("../../handlers/Database.js");
const NEXUS = require("../../handlers/Nexus.js");
const discoforge = require("../../../settings/discoforge.js");
module.exports = {
  name: "clientReady",
  once: true,
  /**
   * @param {NEXUS} client
   */
  async execute(client) {
    try {
      const presenceConfig = discoforge.presence || {};

      if (presenceConfig.enabled) {
        const names = Array.isArray(presenceConfig.names)
          ? presenceConfig.names
          : [presenceConfig.names];

        let index = 0;
        setInterval(() => {
          client.user.setActivity({
            name: names[index],
            type: ActivityType[presenceConfig.type] || ActivityType.Playing,
            url:
              presenceConfig.type === "STREAMING"
                ? presenceConfig.streamingUrl
                : undefined,
          });
          index = (index + 1) % names.length;
        }, presenceConfig.interval);

        client.user.setStatus(presenceConfig.status);
      }

      await Database(client);
      await registerSlashCommands(client);

      client.log(
        ["successColor", "SUCCESS:"],
        ["1", `Bot logged in successfully!`],
        ["highlightColor", client.user.tag]
      );
    } catch (error) {
      console.error("Error in ready event:", error);
    }
  },
};
