const { cooldown, getPermissionName } = require("../../handlers/functions");
const { PREFIX: botPrefix } = require("../../../settings/config");
const {
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "messageCreate",
  once: false,
  /**
   * @param {import('discord.js').Message} message
   * @param {NEXUS} client
   */
  async execute(message, client) {
    if (message.author.bot || !message.guild || !message.id) return;
    const prefix = botPrefix;

    let mentionprefix = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!mentionprefix.test(message.content)) return;
    const [, nprefix] = message.content.match(mentionprefix);
    const args = message.content.slice(nprefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
      if (nprefix.includes(client.user.id)) {
        let embed = new EmbedBuilder()
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setColor(client.config.embed.color)
          .setDescription(
            `**My prefix for \`${message.guild.name}\` is \`${prefix}\`**\n**You can join our [Support Server](${client.config.links.DiscordServer}) for more help!**\n**This Bot is made by [\`Boda3350\`](${client.config.links.Devloper}) [\`neXus-Team\`](${client.config.links.DiscordServer})**`
          );
        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(client.config.links.DiscordServer)
            .setLabel("Support Server")
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL(client.config.links.Devloper)
            .setLabel("Developer")
            .setStyle(ButtonStyle.Link)
        );
        return message.reply({ embeds: [embed], components: [row] });
      }
    }
    const command =
      client.commands.get(cmd) ||
      client.commands.find(
        (cmds) => cmds.command.aliases && cmds.command.aliases.includes(cmd)
      );
    if (!command) return;

    if (!command.command?.enabled) return;
    if (
      command.userPermissions &&
      !message.member.permissions.has(
        PermissionsBitField.resolve(command.userPermissions)
      )
    ) {
      const needPerms = getPermissionName(
        new PermissionsBitField(command.userPermissions).bitfield
      );

      return client.embed(
        message,
        `**🙄 You need ${needPerms
          .map((perm) => `\`${perm}\``)
          .join(", ")} permission(s) to use this command.**`
      );
    } else if (
      command.botPermissions &&
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPermissions)
      )
    ) {
      const needPerms = getPermissionName(
        new PermissionsBitField(command.botPermissions).bitfield
      );

      return client.embed(
        message,
        `**🙄 I need ${needPerms
          .map((perm) => `\`${perm}\``)
          .join(", ")} permission(s) to run \`${command.name}\`.**`
      );
    } else if (cooldown(message, command)) {
      return client.embed(
        message,
        `**⏰ Please wait \`${cooldown(
          message,
          command
        ).toFixed()}\` seconds before using this command again.**`
      );
    }
    if (
      command.category === "owner" &&
      !client.config.Owners.includes(message.author.id)
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.wrongcolor)
            .setDescription(
              ":rolling_eyes: **This command is for the bot owner only**"
            ),
        ],
      });
    } 
    
    else {
      command.msgExecute(client, message, args, nprefix);
    }
  },
};

function escapeRegex(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
