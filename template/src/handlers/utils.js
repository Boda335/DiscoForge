const JUGNU = require("./Client");
const { Message } = require("discord.js");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  CommandInteraction,
  ChannelType,
  Guild,
  StringSelectMenuBuilder,
} = require("discord.js");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Message} message
   */
  client.handleHelpSystem = async (interaction, message) => {
    const send = interaction?.deferred
      ? interaction.followUp.bind(interaction)
      : interaction.reply.bind(interaction);

    const user = interaction.member.user || message.author;
    const commands = interaction?.user ? client.commands : client.commands;
    const categories = interaction?.user
      ? client.scategories
      : client.mcategories;

    const emoji = {
      premium: "👑",
      playlist: "🎶",
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };
    const defaultEmoji = "❓";

    const allcommands = client.commands.size;
    const allguilds = client.guilds.cache.size;
    const botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;

    // بناء قائمة اختيار (select menu)
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("category_select")
      .setPlaceholder("Select a category")
      .addOptions(
        categories
          .filter((cat) => cat !== "dev")
          .map((cat) => ({
            label: `${emoji[cat] || defaultEmoji} ${cat}`,
            value: cat,
          }))
      );
    const row = new ActionRowBuilder().addComponents(selectMenu);

    const help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(
        "**An advanced Music System with Audio Filtering A unique Music Request System and much more!**"
      )
      .addFields([
        {
          name: `Stats`,
          value: `>>> **:gear: \`${allcommands}\` Commands\n:file_folder: \`${allguilds}\` Guilds\n⌚️ ${botuptime} Uptime\n🏓 \`${client.ws.ping}\` Ping\nMade by [\`Nexus Studio\`](https://discord.gg/rMr5YdvYvP)**`,
        },
      ])
      .setFooter(client.getFooter(user));

    const main_msg = await send({
      embeds: [help_embed],
      components: [row],
      ephemeral: true,
    });

    const filter = async (i) => {
      if (i.user.id === user.id) return true;
      else {
        await i.deferReply().catch(() => {});
        i.followUp({
          content: `Not Your Interaction !!`,
          ephemeral: true,
        }).catch(() => {});
        return false;
      }
    };

    const collector = main_msg.createMessageComponentCollector({
      filter,
      time: 60000,
    }); // 60 ثانية للـ Collector

    collector.on("collect", async (i) => {
      if (i.isStringSelectMenu()) {
        await i.deferUpdate().catch(() => {});
        const directory = i.values[0];

        if (directory === "home") {
          main_msg.edit({ embeds: [help_embed] }).catch(() => {});
        } else {
          // بناء الـ Embed للأوامر داخل الفئة المحددة
          const categoryEmbed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle(
              `${emoji[directory] || defaultEmoji} ${directory} Commands ${
                emoji[directory] || defaultEmoji
              }`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(client.getFooter(user));

          // إضافة الأوامر الخاصة بالفئة مع الوصف والإيموجي
          let categoryCommands = commands
            .filter((cmd) => cmd.category === directory)
            .map((cmd) => {
              const cmdEmoji = cmd.emoji || ":pushpin:";
              return `> ${cmdEmoji}\`${cmd.name}\` - ${cmd.description} `;
            })
            .join("\n");

          // التأكد من أن categoryCommands ليست فارغة
          if (!categoryCommands) {
            categoryCommands = "No commands available for this category."; // وضع وصف افتراضي في حال عدم وجود أوامر
          }

          categoryEmbed.setDescription(categoryCommands);

          main_msg
            .edit({
              embeds: [categoryEmbed],
            })
            .catch(() => {});
        }
      }
    });

    collector.on("end", async () => {
      await main_msg
        .edit({
          components: [],
        })
        .catch(() => {});
    });
  };
};
