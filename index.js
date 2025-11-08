#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const basePkg = require('./package.json');
const { execSync } = require('child_process');
const { outro, confirm, text, isCancel } = require('@clack/prompts');
const boxen = require('boxen').default;
const chalk = require('chalk');
const gradient = require('gradient-string').default;
const introGradient = gradient(['#4b6cb7', '#182848']);
const successGradient = gradient(['#00b09b', '#96c93d']);
const questionColor = chalk.hex('#6a8caf');

const asciiArt = `
██████╗ ██╗███████╗ ██████╗ ██████╗     ███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██╔══██╗██║██╔════╝██╔════╝██╔═══██╗    ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
██║  ██║██║███████╗██║     ██║   ██║    █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
██║  ██║██║╚════██║██║     ██║   ██║    ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
██████╔╝██║███████║╚██████╗╚██████╔╝    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
`;

(async () => {
  // console.clear();
  console.log(introGradient.multiline(asciiArt));

  const installSelf = await confirm({
    message: questionColor("Do you want to install 'discoforge' package before continuing? (y/n)"),
    initialValue: true,
  });
  if (!installSelf) {
    console.log(chalk.red("Setup cancelled. 'discoforge' is required."));
    process.exit(1);
  }

  const projectName = await text({
    message: questionColor('📦 Enter your bot name (leave blank to use current directory):'),
    placeholder: '',
    validate: val => (val.length > 100 ? 'Name too long' : undefined),
  });
  if (isCancel(projectName)) return outro(chalk.red('Setup cancelled.'));

  const installDeps = await confirm({
    message: questionColor('📌 Install required Discoforge dependencies? [Recommended]'),
    initialValue: true,
  });
  if (isCancel(installDeps)) return outro(chalk.red('Setup cancelled.'));

  const installDiscordJS = await confirm({
    message: questionColor('💬 Install discord.js? [Recommended]'),
    initialValue: true,
  });
  if (isCancel(installDiscordJS)) return outro(chalk.red('Setup cancelled.'));

  const installMongo = await confirm({
    message: questionColor('📂 Install MongoDB & Mongoose?'),
    initialValue: true,
  });
  if (isCancel(installMongo)) return outro(chalk.red('Setup cancelled.'));

  const targetDir = projectName ? path.join(process.cwd(), projectName) : process.cwd();
  if (projectName && !fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const templateDir = path.join(__dirname, 'template');

  await copyRecursiveWithProgress(templateDir, targetDir);

  createPackageJson(targetDir);
  createEnvFile(targetDir);

  if (installDeps) {
    const deps = ['discoforge', 'axios', 'chalk@4', 'moment', 'ms', 'systeminformation', 'ascii-table', 'module-alias', 'dotenv@16.3.1', 'boxen', 'gradient-string'];
    if (installDiscordJS) deps.push('discord.js');
    if (installMongo) deps.push('mongoose');

    console.log(chalk.yellow('\n📦 Installing packages...'));
    try {
      execSync(`npm install ${deps.join(' ')} --silent --no-audit --no-fund`, {
        stdio: 'inherit',
        cwd: targetDir,
      });

      console.log(chalk.green('✅ Packages installed successfully.'));
    } catch (e) {
      console.error(chalk.red('❌ Error installing packages:'), e.message);
    }
  }
  printInstructionsBox(targetDir);

  function printInstructionsBox() {
    const message = `
${successGradient('🎉 Project setup completed successfully!')}

${chalk.bold.cyan('👉 Next Steps:')}
${chalk.gray('├─')} ${projectName && projectName !== 'current directory' ? chalk.white(`cd ${projectName}`) : chalk.gray('(Already in project directory)')}
${chalk.gray('├─')} ${chalk.white('npm start')} ${chalk.gray('- Start your project')}
${chalk.gray('└─')} ${chalk.white('npm run generate')} ${chalk.gray('- Generate components')}

${chalk.bold.magenta('🏗️  Configuration:')}
${chalk.gray('│')}
${chalk.gray('├─')} Edit ${chalk.yellow('./settings/config.js')} with your settings
${chalk.gray('├─')} Setup your database connection if needed
${chalk.gray('└─')} Check the project README.md file for detailed instructions
    `;

    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
        backgroundColor: '#001122',
      })
    );
  }

  outro(chalk.green('\ndiscoforge is installed successfully! Enjoy coding.'));
})();

async function copyRecursiveWithProgress(src, dest) {
  const allFiles = [];

  function collectFiles(folder) {
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(folder, entry.name);
      if (entry.isDirectory()) {
        collectFiles(fullPath);
      } else {
        allFiles.push(fullPath);
      }
    }
  }

  collectFiles(src);

  let copied = 0;
  const startTime = Date.now();

  for (const file of allFiles) {
    const relativePath = path.relative(src, file);
    const destPath = path.join(dest, relativePath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(file, destPath);
    copied++;

    const percent = Math.round((copied / allFiles.length) * 100);
    const barLength = 30;
    const filled = Math.round((percent / 100) * barLength);
    const bar = '█'.repeat(filled) + ' '.repeat(barLength - filled);

    process.stdout.write(`\r🚀 Copying project files |${bar}| ${percent}%`);
  }

  const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
  process.stdout.write(` | ${elapsedSeconds}s\n`);

}

function createPackageJson(dir) {
  const pkg = {
    name: path.basename(dir),
    version: basePkg.version,
    description: 'A professional Discord bot with a modular command handler.',
    main: 'bot.js',
    scripts: { start: 'node bot.js' },
    keywords: ['discord', 'bot', 'discord.js', 'handler', 'command-handler', 'modular'],
    license: 'Apache-2.0 license',
    author: 'boda335',
    repository: { type: 'git', url: 'https://github.com/Boda335/DiscoForge' },
    bugs: { url: 'https://github.com/Boda335/DiscoForge/issues' },
    homepage: 'https://github.com/Boda335/DiscoForge/blob/main/README.md',
    _moduleAliases: {
      '@root': '.',
      '@src': 'src/',
      '@base': 'src/Base/',
      '@functions': 'src/functions/',
      '@events': 'src/events/',
      '@handlers': 'src/handlers/',
      '@database': 'schema/',
      '@components': 'src/ComponentsActions/',
      '@settings': 'settings/',
    },
  };
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
}

function createEnvFile(dir) {
  const envContent = `
# ====================================================================================

# ██████╗ ██╗███████╗ ██████╗ ██████╗     ███████╗ ██████╗ ██████╗  ██████╗ ███████╗
# ██╔══██╗██║██╔════╝██╔════╝██╔═══██╗    ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
# ██║  ██║██║███████╗██║     ██║   ██║    █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
# ██║  ██║██║╚════██║██║     ██║   ██║    ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
# ██████╔╝██║███████║╚██████╗╚██████╔╝    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
# ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝

#  DiscoForge Environment Configuration
# ====================================================================================

# Your Discord Bot Token
TOKEN=BOT_TOKEN

# Command prefix for your bot (e.g., !, $, ?)
PREFIX=BOT_PREFIX

# Client ID of your bot (found in Discord Developer Portal)
ID=CLIENT_ID

# MongoDB connection string (for Mongoose integration)
MONGO_URL=MONGODB_URL
`;

  fs.writeFileSync(path.join(dir, '.env'), envContent);
  console.log(chalk.green('✅ Created .env file with default values'));
}
