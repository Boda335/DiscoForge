# DiscoForge

<div align="center">
  <img src="https://k.top4top.io/p_3539v2l4x1.png" alt="DiscoForge Logo" width="500"/>
  
  ### 🚀 Modern Discord Bot Framework
  
  *Build scalable, maintainable Discord bots with ease*
  
  [![Discord](https://img.shields.io/discord/1006273962986188881?logo=discord&logoColor=%23fff&label=Discord&labelColor=%23505050&color=%235E6AE9)](https://discord.gg/AT6W2nHEVz)
  [![NPM License](https://img.shields.io/npm/l/discoforge)](LICENSE)
  [![NPM Version](https://img.shields.io/npm/v/discoforge)](https://www.npmjs.com/package/discoforge)
  [![Downloads](https://img.shields.io/npm/dm/discoforge)](https://www.npmjs.com/package/discoforge)
  
</div>

---

## 📋 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Command System](#command-system)
- [Event Handling](#event-handling)
- [Component System](#component-system)
- [Database Integration](#database-integration)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Contributing](#contributing)
- [Support](#support)
- [License](./LICENSE)

---

## 🎯 About

**DiscoForge** is a cutting-edge Discord bot framework built on top of [discord.js](https://discord.js.org/) that empowers developers to create professional-grade Discord bots with minimal setup and maximum flexibility. Whether you're building your first bot or scaling an enterprise solution, DiscoForge provides the tools and structure you need.

### Why Choose DiscoForge?

- **🔧 Zero Configuration**: Get started in seconds with intelligent defaults
- **📦 Modular Architecture**: Clean, maintainable code structure
- **⚡ High Performance**: Optimized for speed and reliability
- **🛡️ Production Ready**: Built-in error handling and logging
- **🔄 Hot Reload**: Dynamic command reloading during development
- **📱 Modern Features**: Full support for slash commands and components

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🏗️ **Core Framework**
- Dynamic command & event loading
- Hot reload for rapid development
- Advanced error handling & logging
- Built-in permission system
- Comprehensive cooldown management
- Auto-update notifications

</td>
<td width="50%">

### 🎛️ **Developer Tools**
- VSCode code snippets
- CLI project scaffolding
- MongoDB integration
- Webhook error reporting
- Bot statistics dashboard <span style="color:red;">SOON</span>
- Customizable presence system

</td>
</tr>
</table>

### 📁 **Handler System**

| Handler | Purpose | File |
|---------|---------|------|
| **Commands** | Slash & prefix command loading | `CommandLoader.js` |
| **Events** | Discord event management | `EventsLoader.js` |
| **Functions** | Utility function loading | `FunctionsLoader.js` |
| **Components** | Button & interaction handling | `ComponentsLoader.js` |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16.9.0 or higher
- A Discord application with bot token
- Basic JavaScript knowledge

### Create Your First Bot

```bash
# Create a new DiscoForge project
npx discoforge@latest my-awesome-bot

# Navigate to your project
cd my-awesome-bot

# Install dependencies
npm install

# Start your bot
npm start
```

### Or scaffold in current directory

```bash
npx discoforge@latest
```

---

## 📥 Installation

### Global Installation (Recommended)

```bash
npm install -g discoforge
discoforge create my-bot
```

### Local Usage

```bash
npx discoforge@latest my-bot
```

### Manual Setup

```bash
git clone https://github.com/your-username/discoforge.git
cd discoforge
npm install
```

---

## ⚙️ Configuration

### Basic Configuration

Edit your bot settings in `settings/config.js`:

```javascript
module.exports = {
  // Required Settings
  TOKEN: "YOUR_BOT_TOKEN",
  ID: "YOUR_BOT_CLIENT_ID",
  PREFIX: "!",
  
  // Optional Settings
  Owners: ["YOUR_USER_ID"],
  MONGO_URL: "mongodb://localhost:27017/mybot",
  errorLogs: "YOUR_WEBHOOK_URL",
};
```

### Advanced Configuration

Configure presence and advanced features in `settings/discoforge.js`:

```javascript
module.exports = {
  errorLogging: {
    enabled: false,
    errorLogs: 'WEBHOOK_URL',
  },
  presence: {
    enabled: true, // If you want to enable or disable the bot's presence
    status: 'idle', // You can choose between: online, idle, dnd and invisible
    interval: 10000, // The interval time in milliseconds for changing the activity
    type: 'Custom', // You can choose between: Playing, Watching, Listening, Competing, Custom and Streaming
    names: [
      'https://discord.gg/Wn6z6yD7n3',
      `Made by Foxy Code Team`,
      `Made by Boda3350`,
      `Powered by DiscoForge`,
      'discord.gg/AT6W2nHEVz',
    ], // The activities the bot will change between (You can put multiple activities in an array)
    // This is only for the STREAMING activity type
    streamingUrl: 'https://www.twitch.tv/example',
  },
};

```
---

## 🏗️ Project Structure

```

├── 📁 .vscode/
├── 📁 errors/
├── 📁 settings/
│   ├── 📄 config.js
│   └── 📄 discoforge.js
├── 📁 src/
│   ├── 📁 Base/
│   │   ├── 📄 BaseFunction.js
│   │   ├── 📄 baseClient.js
│   │   ├── 📄 baseCommand.js
│   │   └── 📄 baseComponent.js
│   ├── 📁 Commands/
│   │   ├── 📁 dev/
│   │   │   └── 📄 re.js
│   │   └── 📁 misc/
│   │       ├── 📄 Ping.js
│   │       ├── 📄 help.js
│   │       └── 📄 stats.js
│   ├── 📁 ComponentsAction/
│   │   └── 📁 public/
│   │       └── 📄 btn_info.js
│   ├── 📁 events/
│   │   ├── 📁 Client/
│   │   │   └── 📄 ready.js
│   │   ├── 📁 interactionCreate/
│   │   │   └── 📄 interactionCreate.js
│   │   └── 📁 messageCreate/
│   │       └── 📄 messageCreate.js
│   ├── 📁 functions/
│   │   ├── 📄 cooldown.js
│   │   ├── 📄 formatBytes.js
│   │   ├── 📄 getPermissionName.js
│   │   ├── 📄 getRandomString.js
│   │   ├── 📄 handleInteraction.js
│   │   ├── 📄 msToDuration.js
│   │   ├── 📄 registerSlashCommands.js
│   │   └── 📄 swap_pages.js
│   └── 📁 handlers/
│       ├── 📄 CommandLoader.js
│       ├── 📄 ComponentsLoader.js
│       ├── 📄 Database.js
│       ├── 📄 EventsLoader.js
│       ├── 📄 FunctionsLoader.js
│       ├── 📄 Nexus.js
│       ├── 📄 UpdateChecker.js
│       ├── 📄 reloadAll.js
│       └── 📄 utils.js
├── 📄 .prettierrc
├── 📝 CHANGELOG.md
├── 📖 README.md
└── 📄 bot.js
```

---

## 🎮 Command System

### Command Structure

DiscoForge commands support both slash commands and traditional prefix commands:

```javascript
const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("../../Base/baseCommand")}
 */
module.exports = {
  // Basic Information
  name: "userinfo",
  description: "Get information about a user",
  category: "utility",
  
  // Permissions & Cooldowns
  cooldown: 5,
  botPermissions: ["SendMessages", "EmbedLinks"],
  userPermissions: ["SendMessages"],
  
  // Command Options
  options: [
    {
      name: "user",
      description: "The user to get info about",
      type: ApplicationCommandOptionType.User,
      required: false
    }
  ],
  
  // Command Types
  type: ApplicationCommandType.ChatInput,
  
  // Configuration
  command: {
    enabled: true,
    aliases: ["ui", "user"],
    minArgsCount: 0,
    usage: "[user]"
  },
  
  slashCommand: {
    enabled: true,
    global: true
  },
  
  // Execution Functions
  async msgExecute(client, message, args) {
    // Handle prefix command
    const user = message.mentions.users.first() || message.author;
    const embed = createUserEmbed(user);
    await message.reply({ embeds: [embed] });
  },
  
  async interactionExecute(client, interaction) {
    // Handle slash command
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = createUserEmbed(user);
    await interaction.reply({ embeds: [embed] });
  },
  
  async autocompleteExecute(client, interaction) {
    // Handle autocomplete if needed
  }
};
```
---

## 📡 Event Handling

### Event Structure

```javascript
const NEXUS = require("../../handlers/Client");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  
  async execute(client, member) {
    console.log(`👋 ${member.user.tag} joined ${member.guild.name}`);
    
    // Welcome message logic
    const welcomeChannel = member.guild.channels.cache
      .find(ch => ch.name === 'welcome');
    
    if (welcomeChannel) {
      const welcomeEmbed = new EmbedBuilder()
        .setTitle('Welcome!')
        .setDescription(`Welcome to the server, ${member}!`)
        .setColor('#00ff00')
        .setThumbnail(member.user.displayAvatarURL());
      
      await welcomeChannel.send({ embeds: [welcomeEmbed] });
    }
  }
};
```

### Available Events

- `ready` - Bot initialization
- `messageCreate` - New messages
- `interactionCreate` - Slash commands & components
- And many more Discord.js events!

---

## 🧩 Component System

### Button Components

```javascript
/**
 * @type {import("../../Base/baseComponent")}
 */
module.exports = {
  name: "role_button",
  enabled: true,
  botPermissions: ["ManageRoles"],
  userPermissions: [],
  
  async action(client, interaction, parts) {
    await interaction.deferUpdate();
    
    const roleId = parts[1]; // Get role ID from button customId
    const role = interaction.guild.roles.cache.get(roleId);
    
    if (!role) {
      return interaction.followUp({
        content: "❌ Role not found!",
        ephemeral: true
      });
    }
    
    const hasRole = interaction.member.roles.cache.has(roleId);
    
    if (hasRole) {
      await interaction.member.roles.remove(role);
      await interaction.followUp({
        content: `✅ Removed ${role.name} role!`,
        ephemeral: true
      });
    } else {
      await interaction.member.roles.add(role);
      await interaction.followUp({
        content: `✅ Added ${role.name} role!`,
        ephemeral: true
      });
    }
  }
};
```

### Select Menu Components

```javascript
module.exports = {
  name: "color_select",
  enabled: true,
  
  async action(client, interaction, parts) {
    const selectedColor = interaction.values[0];
    const colorRole = interaction.guild.roles.cache
      .find(role => role.name.toLowerCase() === selectedColor);
    
    if (colorRole) {
      await interaction.member.roles.add(colorRole);
      await interaction.reply({
        content: `🎨 Applied ${selectedColor} color!`,
        ephemeral: true
      });
    }
  }
};
```

---

## 🗄️ Database Integration

### MongoDB Setup

```javascript
// handlers/Database.js
const NEXUS = require('./Nexus');
const mongoose = require('mongoose');

/**
 * @param {NEXUS} client
 */
module.exports = async (client) => {
  const mongoURL = client.config.MONGO_URL;

  if (!mongoURL || mongoURL.trim() === '' || mongoURL.includes('MONGODB_URL')) {
    client.log(
      ['warningColor', 'WARNING:'],
      [
        '1',
        'MongoDB URL is not provided or is set to the default placeholder. Skipping MongoDB connection.',
      ],
    );
    return;
  }

  try {
    await mongoose.connect(mongoURL);
    client.log(['successColor', 'SUCCESS:'], ['1', 'Connected to MongoDB.']);
  } catch (error) {
    client.log('errorColor', '✖ Failed to connect to MongoDB:');
    console.error(error);
  }
};

module.exports = Database;
```

### Example Schema

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  guildId: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  lastMessage: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

---

## 🛡️ Error Handling

### Comprehensive Error Logging

```javascript
// Automatic error logging to files
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log to file and webhook
});

// Discord webhook notifications
async function logError(error, context) {
  const errorEmbed = new EmbedBuilder()
    .setTitle('🚨 Bot Error')
    .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
    .setColor('#ff0000')
    .addFields(
      { name: 'Context', value: context || 'Unknown' },
      { name: 'Timestamp', value: new Date().toISOString() }
    );
  
  // Send to webhook
  await webhook.send({ embeds: [errorEmbed] });
}
```

### Error Recovery

- Automatic restart on critical errors
- Graceful command failure handling
- User-friendly error messages
- Detailed logging for debugging

---

## 💡 Examples

### Custom Function Example

```javascript
// functions/experienceSystem.js
module.exports = {
  name: "addExperience",
  
  async execute(userId, guildId, amount) {
    const User = require('../models/User');
    
    let user = await User.findOne({ userId, guildId });
    if (!user) {
      user = new User({ userId, guildId });
    }
    
    user.experience += amount;
    user.level = Math.floor(user.experience / 100) + 1;
    
    await user.save();
    return user;
  }
};
```
---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper documentation
4. **Add tests** for new functionality
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear, concise commit messages
- Add documentation for new features
- Ensure all tests pass
- Update the README if needed

### Development Setup

```bash
git clone https://github.com/your-username/discoforge.git
cd discoforge
npm install
npm run dev
```

---

## 💬 Support & Community

<table>
<tr>
<td align="center">
  
  ### 💬 Discord Server
  
  Join our community for support, discussion, and updates
  
  [![Discord](https://img.shields.io/discord/1006273962986188881?logo=discord&logoColor=%23fff&label=Join%20Discord&labelColor=%23505050&color=%235E6AE9&style=for-the-badge)](https://discord.gg/AT6W2nHEVz)
  
</td>
<td align="center">
  
  ### 📚 Documentation
  
  Comprehensive guides and tutorials
  
  [![Docs](https://img.shields.io/badge/Read%20Docs-blue?style=for-the-badge&logo=gitbook&logoColor=white)](https://docs.discoforge.dev)
  
</td>
</tr>
<tr>
<td align="center">
  
  ### 🐛 Bug Reports
  
  Found a bug? Let us know!
  
  [![Issues](https://img.shields.io/badge/Report%20Bug-red?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Boda335/DiscoForge/issues)
  
</td>
<td align="center">
  
  ### 💡 Feature Requests
  
  Suggest new features and improvements
  
  [![Features](https://img.shields.io/badge/Request%20Feature-green?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Boda335/DiscoForge/discussions)
  
</td>
</tr>
</table>

### Getting Help

- **Discord Support**: Real-time help from community and maintainers
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and examples
- **Stack Overflow**: Tag your questions with `discoforge`

---

## 🏆 Acknowledgments

DiscoForge wouldn't be possible without these amazing technologies and contributors:

- **[Discord.js](https://discord.js.org/)** - The powerful Discord API library
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[MongoDB](https://www.mongodb.com/)** - Database integration
- **Community Contributors** - Thank you for your support!

### Special Thanks

- [Boda3350](https://discord.com/users/1139143053387509840) - Project Creator
- Foxy Code Team - Development Team
- Our amazing community of bot developers

---


<div align="center">
  
  ### 🌟 Star us on GitHub!
  
  If DiscoForge helped you build amazing Discord bots, please consider giving us a star ⭐
  
  **Made with ❤️ by the DiscoForge Team**
  
  [![GitHub](https://img.shields.io/badge/GitHub-DiscoForge-blue?style=for-the-badge&logo=github)](https://github.com/your-username/discoforge)
  [![NPM](https://img.shields.io/badge/NPM-DiscoForge-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/discoforge)
  
</div>