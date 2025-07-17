#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const {
  intro,
  outro,
  confirm,
  text,
  isCancel,
  spinner,
} = require("@clack/prompts");
const chalk = require("chalk");

(async () => {
  const installSelf = await confirm({
    message: "Do you want to install 'discoforge' package before continuing? (y/n)",
    initialValue: true,
  });

  if (!installSelf) {
    console.log(chalk.red("Setup cancelled. 'discoforge' is required."));
    process.exit(1); 
  }

  try {
    console.log(chalk.yellow("Installing 'discoforge' package..."));
    execSync("npm install discoforge", {
      stdio: "inherit",
    });
  } catch (err) {
    console.error(chalk.red("Failed to install 'discoforge':"), err.message);
    process.exit(1);
  }
  intro(chalk.cyan("Welcome to DiscoForge Setup!"));

  const projectName = await text({
    message:
      "Enter your bot name (leave blank to create in the current directory):",
    placeholder: "DiscoForge",
    validate: (val) => (val.length > 100 ? "Name too long" : undefined),
  });

  if (isCancel(projectName)) return outro(chalk.red("Setup cancelled."));

  const installDeps = await confirm({
    message:
      "Do you want to install required dependencies for DiscoForge? [Recommended]",
    initialValue: true,
  });

  if (isCancel(installDeps)) return outro(chalk.red("Setup cancelled."));

  const installDiscordJS = await confirm({
    message: "Do you want to install discord.js? [Recommended]",
    initialValue: true,
  });

  if (isCancel(installDiscordJS)) return outro(chalk.red("Setup cancelled."));

  const installMongo = await confirm({
    message: "Do you want to install Mongoose?",
    initialValue: true,
  });

  if (isCancel(installMongo)) return outro(chalk.red("Setup cancelled."));

  const targetDir = projectName
    ? path.join(process.cwd(), projectName)
    : process.cwd();
  if (projectName && !fs.existsSync(targetDir))
    fs.mkdirSync(targetDir, { recursive: true });

  const templateDir = path.join(__dirname, "template");

  const s = spinner();
  s.start("Copying project structure...");
  try {
    copyRecursive(templateDir, targetDir);
    s.stop(chalk.green("Project structure copied successfully."));
  } catch (err) {
    s.stop(chalk.red("Failed to copy template files."));
    return;
  }

  createPackageJson(targetDir);

  if (installDeps) {
    const deps = ["discoforge","axios", "chalk@4", "moment", "ms", "systeminformation"];

    if (installDiscordJS) deps.push("discord.js");
    if (installMongo) deps.push("mongoose");

    console.log(chalk.yellow("\nInstalling packages..."));
    try {
      execSync(`npm install ${deps.join(" ")}`, {
        stdio: "inherit",
        cwd: targetDir,
      });
    } catch (e) {
      console.error(chalk.red("Error installing packages:"), e.message);
    }
  }

  outro(chalk.green("\ndiscoforge is installed successfully! Enjoy coding."));
})();

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createPackageJson(dir) {
  const pkg = {
    name: path.basename(dir),
    version: "1.0.0",
    description: "A professional Discord bot with a modular command handler.",
    main: "bot.js",
    scripts: {
      start: "node bot.js",
    },
    keywords: [
      "discord",
      "bot",
      "discord.js",
      "handler",
      "command-handler",
      "modular",
    ],
    license: "Apache-2.0 license",
    author: "boda335",
    repository: {
      type: "git",
      url: "https://github.com/Boda335/DiscoForge",
    },
    bugs: {
      url: "https://github.com/Boda335/DiscoForge/issues",
    },
    homepage: "https://github.com/Boda335/DiscoForge/blob/main/README.md",
  };
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify(pkg, null, 2)
  );
  console.log(chalk.green("Created package.json"));
}
