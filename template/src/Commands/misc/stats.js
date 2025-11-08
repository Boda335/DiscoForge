const { EmbedBuilder, version, ApplicationCommandType } = require('discord.js');
const formatBytes = require('../../functions/formatBytes');
const os = require('systeminformation');
const pkg = require('../../../package.json');
const NEXUS = require('../../handlers/Nexus.js');

/**
 * @type {import("../../Base/baseCommand")}
 */
module.exports = {
  name: 'botinfo',
  description: 'Shows bot statistics',
  cooldown: 10,
  category: 'misc',
  botPermissions: ['SendMessages'],
  userPermissions: ['SendMessages'],
  type: ApplicationCommandType.ChatInput,
  options: [],
  command: {
    enabled: true,
    aliases: ['stats', 'statistics', 'info'],
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
  },

  async msgExecute(client, message, args) {
    await getBotStats(client, message.guild, message.author, async embed => {
      await message.reply({ embeds: [embed] });
    });
  },

  async interactionExecute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });
    await getBotStats(client, interaction.guild, interaction.user, async embed => {
      await interaction.editReply({ embeds: [embed] });
    });
  },

  //   async autocompleteExecute(client, interaction) {},
};
/**
 *
 * @param {NEXUS} client
 * @param {import("discord.js").Guild} guild
 * @param {import("discord.js").User} user
 * @param {Function} sendEmbed
 * @returns
 */

async function getBotStats(client, guild, user, sendEmbed) {
  try {
    let memory = await os.mem();
    let cpu = await os.cpu();
    let cpuUsage = await (await os.currentLoad()).currentLoad;
    let osInfo = await os.osInfo();

    let TotalRam = formatBytes(memory.total);
    let UsageRam = formatBytes(memory.used);

    const embed = new EmbedBuilder()
      .setColor(client.config.embed?.color || '#00FF99')
      .setTitle('🚀 Bot Live Statistics')
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .addFields(
        {
          name: '⏳ Memory Usage',
          value: `\`${UsageRam}\` / \`${TotalRam}\``,
          inline: true,
        },
        {
          name: '⌚ Uptime',
          value: `<t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>`,
          inline: true,
        },
        { name: '📌 Bot Version', value: `\`${pkg.version}\``, inline: true },
        {
          name: '🌍 Servers',
          value: `\`${client.guilds.cache.size}\``,
          inline: true,
        },
        {
          name: '👥 Total Users',
          value: `\`${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0).toLocaleString()}\``,
          inline: true,
        },
        {
          name: '📁 Channels',
          value: `\`${client.channels.cache.size}\``,
          inline: true,
        },
        { name: '👾 Discord.JS', value: `v${version}`, inline: true },
        { name: '🤖 Node', value: process.version, inline: true },
        { name: '🏓 Ping', value: `${client.ws.ping}ms`, inline: true },
        {
          name: '🖥 CPU Usage',
          value: `${Math.floor(cpuUsage)}%`,
          inline: true,
        },
        { name: '🛠 Arch', value: osInfo.arch, inline: true },
        { name: '💻 Platform', value: osInfo.platform, inline: true },
        {
          name: '⚙ CPU',
          value: `\`\`\`ansi
[2;33m${cpu.brand}[0m
\`\`\``,
        },

        {
          name: '🙋 Requested By',
          value: `**${user.displayName}**`,
          inline: false,
        }
      )
      .setFooter({
        text: `Powered by ${client.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    return sendEmbed(embed);
  } catch (err) {
    client.log(['errorColor', 'ERROR:'], ['1', `An error occurred: ${err}`]);
    const errorEmbed = new EmbedBuilder().setColor('Red').setDescription(`🙄 Unable to fetch bot statistics at the moment.`);
    return sendEmbed(errorEmbed);
  }
}
