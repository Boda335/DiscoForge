const {
  Interaction,
  Collection,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const client = require("../../bot.js");
const NEXUS = require("./Client");
const fs = require("fs");
const path = require("path");
/**
 *
 * @param {Interaction} interaction
 * @param {String} cmd
 */
function cooldown(interaction, cmd) {
  if (!interaction || !cmd) return;
  let { client, member } = interaction;
  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(cmd.name);
  const cooldownAmount = cmd.cooldown * 1000;
  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return timeLeft;
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false;
    }
  } else {
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    return false;
  }
}

function msToDuration(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let years = Math.floor(days / 365);
  let months = Math.floor((days % 365) / 30);
  days = (days % 365) % 30;

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  let parts = [];

  if (years) parts.push(`${years} Years`);
  if (months) parts.push(`${months} Months`);
  if (days) parts.push(`${days} Days`);
  if (hours) parts.push(`${hours} Hours`);
  if (minutes) parts.push(`${minutes} Minutes`);
  if (seconds) parts.push(`${seconds} Seconds`);

  if (parts.length === 0) return "0 Seconds";

  if (parts.length === 1) return parts[0];

  return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
}

function formatBytes(x) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

function getPermissionName(permissionValue) {
  const matchedPermissions = [];
  const bigIntPermissionValue = BigInt(permissionValue);

  for (const [permissionName, permissionBit] of Object.entries(
    PermissionFlagsBits
  )) {
    const bit = BigInt(permissionBit);
    if ((bigIntPermissionValue & bit) === bit) {
      matchedPermissions.push(permissionName);
    }
  }

  return matchedPermissions.length > 0 ? matchedPermissions : null;
}

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
      client.log;
      client.log(["successColor", "SUCCESS:"], ["1", "Global slash commands registered."]);
    } else {
      for (const guildID of slash.guildIDS) {
        const guild = await client.guilds.fetch(guildID).catch(() => null);
        if (!guild) {
          client.log(["warningColor", "WARNING:"], ["1", `Guild with ID ${guildID} not found.`]);
          continue;
        }

        await guild.commands.set(allCommands);
        client.log(["successColor", "SUCCESS:"], ["1", `Slash commands registered for guild: ${guild.name} (${guildID})`]);
      }
    }
  } catch (error) {
  }
}

async function reloadAllHandlers(client) {
  const interactionsPath = path.join(__dirname, "../ComponentsAction/");

  const getAllFiles = (dirPath) => {
    let results = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(filePath));
      } else if (filePath.endsWith(".js")) {
        results.push(filePath);
      }
    }

    return results;
  };

  const interactionFiles = getAllFiles(interactionsPath);
  let loadedCount = 0;

  for (const file of interactionFiles) {
    delete require.cache[require.resolve(file)];
    require(file);
    loadedCount++;
  }

  client.log(
    ["successColor", "SUCCESS:"],
    ["1", `${interactionFiles.length} Interaction Handlers Reloaded`]
  );
  return {
    interactionHandlersCount: loadedCount,
  };
}

/**
 * @param {NEXUS} client
 * @param {import('discord.js').Interaction} interaction
 */
async function handleInteraction(client, interaction) {
  if (!interaction.customId) {
    console.error("The interaction does not have a customId.");
    return;
  }

  const interactionsPath = path.join(__dirname, "../ComponentsAction/");
  const parts = interaction.customId?.split("_");

  const getAllFiles = (dirPath) => {
    let results = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(filePath));
      } else if (filePath.endsWith(".js")) {
        results.push(filePath);
      }
    }

    return results;
  };

  const interactionFiles = getAllFiles(interactionsPath);

  for (const file of interactionFiles) {
    try {
      const handler = require(file);
      if (typeof handler !== "object" || !handler.action) continue;
      if (handler.enabled === false) continue;

      const matchByName = interaction.customId === handler.name;
      const matchByCustom =
        handler.customId && interaction.customId === handler.customId;
      const matchByPrefix = handler.name && handler.name.startsWith(parts[0]);

      if (matchByName || matchByCustom || matchByPrefix) {
        // --- تنفيذ التفاعل مباشرة ---
        await handler.action(client, interaction, parts) ;
        return;
      }
    } catch (error) {
      console.error(`✖ Failed to handle interaction from file ${file}:`, error);
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing the interaction.",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing the interaction.",
            ephemeral: true,
          });
        }
      } catch (e) {
        console.error("❗ Failed to send error reply:", e);
      }
    }
  }
}
/**
 * @param {NEXUS} client
 * @param {import('discord.js').Interaction} interaction
 */
async function swap_pages(interaction, embeds) {
  let currentPage = 0;
  let allbuttons = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("0")
      .setEmoji("⏮"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("1")
      .setEmoji("◀"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId("2")
      .setLabel("⛔️"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("3")
      .setEmoji("▶"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("4")
      .setEmoji("⏭"),
  ]);
  if (embeds.length === 1) {
    if (interaction.deferred) {
      return interaction.followUp({
        embeds: [embeds[0]],
        fetchReply: true,
      });
    } else {
      return interaction.reply({
        embeds: [embeds[0]],
        fetchReply: true,
      });
    }
  }
  embeds = embeds.map((embed, index) => {
    return embed.setColor(client.client.config.embed.color).setFooter({
      text: `Page ${index + 1} / ${embeds.length}`,
      iconURL: interaction.guild.iconURL({ dynamic: true }),
    });
  });
  let swapmsg;
  if (interaction.deferred) {
    swapmsg = await interaction.followUp({
      embeds: [embeds[0]],
      components: [allbuttons],
    });
  } else {
    swapmsg = await interaction.reply({
      embeds: [embeds[0]],
      components: [allbuttons],
    });
  }
  const collector = swapmsg.createMessageComponentCollector({
    time: 2000 * 60,
  });
  collector.on("collect", async (b) => {
    if (b.isButton()) {
      await b.deferUpdate().catch((e) => {});
      // page first
      if (b.customId == "0") {
        if (currentPage !== 0) {
          currentPage = 0;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      //page forward
      if (b.customId == "1") {
        if (currentPage !== 0) {
          currentPage -= 1;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } else {
          currentPage = embeds.length - 1;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      //go home
      else if (b.customId == "2") {
        try {
          allbuttons.components.forEach((btn) => btn.setDisabled(true));
          swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } catch (e) {}
      }
      //go forward
      else if (b.customId == "3") {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } else {
          currentPage = 0;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      // page last
      if (b.customId == "4") {
        currentPage = embeds.length - 1;
        await swapmsg
          .edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          })
          .catch((e) => null);
      }
    }
  });

  collector.on("end", () => {
    allbuttons.components.forEach((btn) => btn.setDisabled(true));
    swapmsg.edit({ components: [allbuttons] }).catch((e) => null);
  });
}

function getRandomString(length) {
  const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

module.exports = {
  swap_pages,
  cooldown,
  msToDuration,
  formatBytes,
  getPermissionName,
  registerSlashCommands,
  handleInteraction,
  reloadAllHandlers,
  getRandomString,
};
