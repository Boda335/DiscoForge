// src/structures/Nexus.js
const { EmbedBuilder, ActionRowBuilder, User } = require('discord.js');
const { options } = require('../../settings/config');
const BaseNexus = require('../Base/baseClient');

class NEXUS extends BaseNexus {
  constructor() {
    super();
    this.Checker();
  }

  start(token) {
    ['intro','CommandLoader', 'EventsLoader', 'FunctionsLoader', 'ComponentsLoader'].forEach(handler => {
      require(`./${handler}`)(this);
    });
    this.login(token);
  }

  /**
   * @param {User} user
   * @returns
   */
  getFooter(user) {
    const obj = {
      text: `Requested By ${user.username || user.tag}`,
      iconURL: user.displayAvatarURL(),
    };

    return options.embedFooter ? obj : null;
  }

  embed(interaction, data) {
    let user = interaction.user ? interaction.user : interaction.author;
    const embed = new EmbedBuilder()
      .setColor(this.config.embed.color)
      .setDescription(`${data.substring(0, 3000)}`)
      .setFooter(this.getFooter(user));

    if (interaction.deferred) {
      interaction.followUp({ embeds: [embed] }).catch(() => {});
    } else {
      interaction.reply({ embeds: [embed] }).catch(() => {});
    }
  }

  async handleHelpSystem(interaction, message) {
    const send = interaction?.deferred ? interaction.followUp.bind(interaction) : interaction.reply.bind(interaction);

    const user = interaction?.user || interaction?.member?.user || message?.author;
    const commands = this.commands;
    const categories = this.mcategories;

    const emoji = {
      premium: '👑',
      admin: '🛠️',
      misc: '🔰',
      Settings: '⚙️',
    };
    const defaultEmoji = '';

    const allcommands = this.commands.size;
    const allguilds = this.guilds.cache.size;
    const botuptime = `<t:${Math.floor(Date.now() / 1000 - this.uptime / 1000)}:R>`;

    const selectMenu = new (require('discord.js').StringSelectMenuBuilder)()
      .setCustomId('category_select')
      .setPlaceholder('Select a category')
      .addOptions(
        categories
          .filter(cat => cat !== 'dev')
          .map(cat => ({
            label: `${emoji[cat] || defaultEmoji} ${cat}`,
            value: cat,
            description: `View commands in the ${cat} category`,
          })),
        {
          label: 'Home',
          emoji: '🏠',
          value: 'home',
          description: 'Return to the main help menu',
        }
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const help_embed = new EmbedBuilder()
      .setColor(this.config.embed.color)
      .setAuthor({
        name: this.user.tag,
        iconURL: this.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription('**An advanced Music System with Audio Filtering, a unique Music Request System, and much more!**')
      .addFields([
        {
          name: `Stats`,
          value: `>>> **:gear: \`${allcommands}\` Commands\n:file_folder: \`${allguilds}\` Guilds\n⌚️ ${botuptime} Uptime\n🏓 \`${this.ws.ping}\` Ping\nMade by [\`Nexus Studio\`](https://discord.gg/rMr5YdvYvP)**`,
        },
      ])
      .setFooter(this.getFooter(user));

    const main_msg = await send({
      embeds: [help_embed],
      components: [row],
      ephemeral: true,
    });

    const filter = async i => {
      if (i.user.id === user.id) return true;
      await i.deferReply().catch(() => {});
      i.followUp({
        content: `Not Your Interaction !!`,
        ephemeral: true,
      }).catch(() => {});
      return false;
    };

    const collector = main_msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on('collect', async i => {
      if (i.isStringSelectMenu()) {
        await i.deferUpdate().catch(() => {});
        const directory = i.values[0];

        if (directory === 'home') {
          main_msg.edit({ embeds: [help_embed] }).catch(() => {});
        } else {
          const categoryEmbed = new EmbedBuilder()
            .setColor(this.config.embed.color)
            .setTitle(`${emoji[directory] || defaultEmoji} ${directory} Commands ${emoji[directory] || defaultEmoji}`)
            .setThumbnail(this.user.displayAvatarURL())
            .setFooter(this.getFooter(user));

          let categoryCommands = commands
            .filter(cmd => cmd.category === directory)
            .map(cmd => {
              const cmdEmoji = cmd.emoji || ':pushpin:';
              let lines = [`> ${cmdEmoji} \`${cmd.name}\` - ${cmd.description}`];

              if (cmd.command?.aliases?.length > 0) {
                lines.push(`> 🔁 Aliases: \`${cmd.command.aliases.join('`, `')}\``);
              }

              if (cmd.options?.length > 0) {
                const opts = cmd.options.map(opt => `\`${opt.name}\``).join(', ');
                lines.push(`> ⚙️ Options: ${opts}`);
              }

              return lines.join('\n');
            })
            .join('\n\n');

          if (!categoryCommands) {
            categoryCommands = 'No commands available for this category.';
          }

          categoryEmbed.setDescription(categoryCommands);

          main_msg.edit({ embeds: [categoryEmbed] }).catch(() => {});
        }
      }
    });

    collector.on('end', async () => {
      await main_msg.edit({ components: [] }).catch(() => {});
    });
  }
}

module.exports = NEXUS;
