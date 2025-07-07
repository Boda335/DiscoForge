
  

  

![Logo](https://i.postimg.cc/TYcK9twz/Add-a-heading-1.png)

  

  

<div  align="center">

  

  

![Discord](https://img.shields.io/discord/1006273962986188881?logo=discord&logoColor=%23fff&logoSize=auto&label=Discord&labelColor=%23505050&color=%235E6AE9&link=https%3A%2F%2Fdiscord.gg%2Fethical-programmer-s-1188398653530984539) ![NPM License](https://img.shields.io/npm/l/create-discoforge)

  

</div>

  

  

# DiscoForge

  

  

**DiscoForge** is a lightweight command and event handler package for Discord bots, enabling easy management of commands and events with a structured file organization and dynamic loading system. It allows you to build almost any advanced Discord bot effortlessly.

  

  

```

  

✨ Supports Latest Discord.js v14.

  

```

  

  

## Features

  

  

- 🎉 Command Handler

  

- 📅 Event Handler

  

- ⚙️ Advanced Customization

  

- 🚀 Asynchronous Support

  

- 🔄 Dynamic Reloading

  

- 🛠️ Modular Structure

  

- 🛡 Never Crash

  

- 🌐 Compatibility with Advanced Discord Bots

  

- 🔤 Prefix Commands Support

  

- ➗ Slash Commands Support

  

- 🔔 Automatic Detection of Missing Intents

  

- ⚙️ **Configurable Function Execution:** Allows for setting properties such as `once`, `interval`, `retryAttempts`, `maxExecution`, and `initializer` in your functions to control execution patterns. Ideal for scheduling tasks or retrying operations with ease.

  

- 🗂️ **Error Logging:** Automatic logging of runtime errors into an `errors` folder.

  
  

- 🔧 **discoforge Generate Command:** Generate new commands and events with ease. For example:

  

run this in your terminal after setuping DiscoForge!

  

```bash

  

npm  run  generate

  

```

  

  

## Installation

  

  

To create a new **DiscoForge** project, run the following commands:

  

  

```bash

  

npx  discoforge@latest  my-project

  

```

  

  

You can also create a new project in the current directory without specifying a project name:

  

  

```bash

  

npx  discoforge@latest

  

```

  

This will generate a new **discoforge** project in the current directory.

  

  

## Useful Addon

  

- [discoforge](https://www.npmjs.com/package/discoforge)

  

  

## Configuration

  

  

To run this project, you will need to provide the necessary values in the config.js file located in the `settings\config.js` directory. The structure of the file is as follows:

  

  

| Parameter | Type | Description |

  

| :------------------------------| :------- | :----------------------------------------------------------- |

  

| `bot.TOKEN` | `string` | **Required**. Your Discord bot token |

  

| `bot.id` | `string` | **Required**. The ID of your Discord bot |

  

| `bot.ownerId` | `array` | **Optional**. The owner's user ID |

  

| `bot.MONGO_URL` | `string` | **Optional**. MongoDB connection URL |

  

| `bot.errorLogs` | `string` | **Optional**. Webhook URL for error logging |

  

| `bot.PREFIX` | `string` | **Required**. Command prefix for non-slash commands |

  

  
  

## Command Options

  

| Option | Type | Description |

| :------------------| :---------| :----------------------------------------------------------------------------------------------------------|

| `name` | `string` | **Required**. The name of the command. |

| `description` | `string` | **Required**. A brief explanation of what the command does. |

| `category` | `string` | **Optional**. The category the command belongs to (e.g., `OWNER`, `MODERATION`, etc.). |

| `cooldown` | `number` | **Optional**. The cooldown time in seconds before the command can be reused (e.g., `10`). |

| `botPermissions` | `array` | **Optional**. List of permissions the bot needs to execute the command (e.g., `'SendMessages'`). |

| `userPermissions` | `array` | **Optional**. List of permissions the user needs to execute the command (e.g., `'Administrator'`). |

| `options` | `array` | **Optional**. Options used for the slash command (if any). |

| `command` | `object` | **Required**. Configuration for the prefix (message-based) command. |

| └─ `enabled` | `boolean` | **Required**. Indicates whether the prefix command is enabled. |

| └─ `aliases` | `array` | **Optional**. Alternative names for the command. |

| └─ `minArgsCount` | `number` | **Optional**. Minimum number of arguments required to run the command. |

| `slashCommand` | `object` | **Required**. Configuration for the slash command. |

| └─ `enabled` | `boolean` | **Required**. Indicates whether the slash command is enabled. |

  
  
  

## Contributing

  

  

Contributions are always welcome!

  

  

See `contributing.md` for ways to get started.

  

  

Please adhere to this project's `code of conduct`.

  
  

## Feedback & Suggestion

  

  

If you have any feedback or suggestion, please reach out to us at [Discord Community](https://discord.gg/https://dsc.gg/enexus)

  

  

## Support

  

  

For support & questions, join our Discord server: [Discord Community](https://discord.gg/https://dsc.gg/enexus).