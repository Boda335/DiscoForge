![Logo](https://i.postimg.cc/TYcK9twz/Add-a-heading-1.png)

<div align="center">

![Discord](https://img.shields.io/discord/1006273962986188881?logo=discord&logoColor=%23fff&label=Discord&labelColor=%23505050&color=%235E6AE9&link=https%3A%2F%2Fdiscord.gg%2Fethical-programmer-s-1188398653530984539)
![NPM License](https://img.shields.io/npm/l/discoforge)

</div>

# DiscoForge

**DiscoForge** is a lightweight command and event handler framework for building modular and scalable Discord bots with ease.  
It supports structured file organization, dynamic loading, and smooth integration with Discord.js v14.

---

## ✨ Features

- ⚙️ Command Handler  
- 📅 Event Handler  
- 🎛️ Modular File Structure  
- ♻️ Dynamic Reloading  
- 🔧 Customizable Settings  
- 🔐 Stability (Never crashes on missing events)  
- 🌐 Full Compatibility with Advanced Discord Bots  
- 🔤 Prefix & Slash Commands Support  
- 🧠 Automatic Detection of Missing Intents  
- 🗂️ Error Logging into `errors` folder  
- 🛠️ Built-in Generator for Commands & Events  

Generate new commands or events easily using:

```bash
npm run generate
```

---

## 📦 Installation

To create a new **DiscoForge** project, run:

```bash
npx discoforge@latest my-project
```

Or to use the current directory:

```bash
npx discoforge@latest
```

This will scaffold a fully functional Discord bot setup.

---

## 🧩 Configuration

Set your bot configuration inside the `settings/config.js` file:

| Parameter         | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| `bot.TOKEN`       | `string` | **Required**. Your Discord bot token         |
| `bot.id`          | `string` | **Required**. Your bot's client ID           |
| `bot.ownerId`     | `array`  | **Optional**. Bot owner's user IDs           |
| `bot.MONGO_URL`   | `string` | **Optional**. MongoDB connection string      |
| `bot.errorLogs`   | `string` | **Optional**. Webhook URL for error logging  |
| `bot.PREFIX`      | `string` | **Required**. Prefix for message commands    |

---

## ⚙️ Command Options

| Option             | Type       | Description                                                       |
|--------------------|------------|-------------------------------------------------------------------|
| `name`             | `string`   | **Required**. Command name                                        |
| `description`      | `string`   | **Required**. Short description of what the command does          |
| `category`         | `string`   | **Optional**. Logical group (e.g., `MODERATION`, `OWNER`)         |
| `cooldown`         | `number`   | **Optional**. Cooldown in seconds before reuse                    |
| `botPermissions`   | `array`    | **Optional**. Bot permissions required                            |
| `userPermissions`  | `array`    | **Optional**. User permissions required                           |
| `options`          | `array`    | **Optional**. Slash command options                               |

### Prefix Command

| Property           | Type       | Description                          |
|--------------------|------------|--------------------------------------|
| `enabled`          | `boolean`  | Enable/disable prefix version        |
| `aliases`          | `array`    | Alternative command names            |
| `minArgsCount`     | `number`   | Minimum required arguments           |

### Slash Command

| Property           | Type       | Description                          |
|--------------------|------------|--------------------------------------|
| `enabled`          | `boolean`  | Enable/disable slash version         |

---

## 🧪 Examples

### 🧾 Command Example

```js
const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

/**
 * @type {import("../../Base/baseCommand")}
 */
module.exports = {
  name: "ping",
  description: "Check bot latency",
  cooldown: 10,
  category: "info",
  botPermissions: [],
  userPermissions: [],
  options: [],
  command: {
    enabled: true,
    aliases: ["p"],
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
  },

  async msgExecute(client, message, args) {
    message.reply("🏓 Pong!");
  },

  async interactionExecute(client, interaction) {
    interaction.reply({ content: "🏓 Pong!", ephemeral: true });
  },

  async autocompleteExecute(client, interaction) {
    // optional
  },
};
```

---

### ⚡ Event Example

```js
const NEXUS = require("../../handlers/Client");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {NEXUS} client
   */
  async execute(client) {
    try {
      console.log(`🤖 Bot is online as ${client.user.tag}`);
    } catch (error) {
      console.error(error);
    }
  },
};
```

---

### 🔘 Component (Action) Example

```js
/**
 * @type {import("../../Base/baseComponent")}
 */
module.exports = {
  name: "verify_button",
  enabled: true,
  botPermissions: [],
  userPermissions: [],

  action: async (client, interaction, parts) => {
    await interaction.deferUpdate();
    let member = interaction.member;

    try {
      await interaction.followUp({
        content: `✅ Verified as ${member.user.username}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error in verify_button:`, error);
      await interaction.followUp({
        content: "😓 Sorry, something went wrong. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
```

---

## 🤝 Contributing

Contributions are welcome!  
See the `contributing.md` file to get started, and please follow the project's code of conduct.

---

## 💬 Feedback & Suggestions

Have feedback or suggestions?  
Join our [Discord Community](https://discord.gg/https://dsc.gg/enexus) and share your thoughts.

---

## 🛠 Support

Need help or have questions?  
Join our support server: [Discord Community](https://discord.gg/https://dsc.gg/enexus)

---

## 📦 NPM Package

Check out the published package on NPM:  
👉 [discoforge](https://www.npmjs.com/package/discoforge)
