# Changelog

All notable changes to this project will be documented in this file.

---

## [2.5.0] - 2025-11-08
### Updated
- Rebranded references from Foxy Code Team to Nexus Studio Team
- Updated Discord invite links throughout README, CHANGELOG, and config files
- Enhanced CLI setup experience with gradient ASCII art, improved prompts, progress bars, and a summary box using `boxen` and `gradient-string`
- Added `dotenv` support for environment variables and created a default `.env` file
- Updated dependencies in `package.json` and `package-lock.json`
- Cleaned up Prettier config and removed unused template files

---

## [2.0.0] - 2025-09-09
### Added
- Modular command handler ([template/src/handlers/CommandLoader.js](template/src/handlers/CommandLoader.js))
- Modular event handler ([template/src/handlers/EventsLoader.js](template/src/handlers/EventsLoader.js))
- Modular function loader ([template/src/handlers/FunctionsLoader.js](template/src/handlers/FunctionsLoader.js))
- Modular component/action loader ([template/src/handlers/ComponentsLoader.js](template/src/handlers/ComponentsLoader.js))
- Dynamic reload command ([template/src/Commands/dev/re.js](template/src/Commands/dev/re.js))
- Advanced help system with category selection ([template/src/handlers/utils.js](template/src/handlers/utils.js))
- Bot statistics command ([template/src/Commands/misc/stats.js](template/src/Commands/misc/stats.js))
- Ping command ([template/src/Commands/misc/Ping.js](template/src/Commands/misc/Ping.js))
- Utility functions: cooldown, formatBytes, msToDuration, getRandomString, getPermissionName, swap_pages ([template/src/functions/](template/src/functions/))
- MongoDB integration ([template/src/handlers/Database.js](template/src/handlers/Database.js))
- Customizable bot presence/status ([template/settings/discoforge.js](template/settings/discoforge.js))
- Error logging to `errors` folder and Discord webhook ([template/bot.js](template/bot.js))
- Update checker for new releases ([template/src/handlers/UpdateChecker.js](template/src/handlers/UpdateChecker.js))
- Built-in code snippets for VSCode ([template/.vscode/DiscoForge.code-snippets](template/.vscode/DiscoForge.code-snippets))
- Project scaffolding CLI ([index.js](index.js))

### Improved
- Enhanced visual feedback during bot login
- Improved appearance and feedback of command cooldown messages
- Better error handling and logging throughout the codebase
- More robust command and event loader with validation and logging
- Improved modularity and scalability of the framework

### Fixed
- Resolved connection issues with MongoDB integration
- Fixed bug in reload command for commands, events, and components
- Minor typo and formatting issues in prompts and console messages

---

## [1.0.0] - 2025-05-01
### Added
- Initial release of DiscoForge setup script ([index.js](index.js))
- Interactive CLI using `@clack/prompts`
- Automated project template generation ([template/](template/))
- Optional dependency installation: `discord.js`, `mongoose`, and others
- Modular command and event handler framework ([template/src/handlers/CommandLoader.js](template/src/handlers/CommandLoader.js), [template/src/handlers/EventsLoader.js](template/src/handlers/EventsLoader.js))
- Dynamic reloading for commands, events, functions, and components
- Error logging to `errors` folder
- Built-in generator for commands and events
- Support for both prefix and slash commands
- Advanced help system with category selection
- Customizable bot presence and status
- Full configuration via [template/settings/config.js](template/settings/config.js)
- Example commands, events, and components
- VSCode code snippets for rapid development
- Apache-2.0 license ([LICENSE](LICENSE))
- Comprehensive documentation ([README.md](README.md))

---

## Credits

Made by [Boda3350](https://discord.com/users/1139143053387509840) and Nexus Studio Team.  
Powered by DiscoForge.  
Join our [Discord Community](https://discord.gg/9cfgTktxHm) for support and feedback.
