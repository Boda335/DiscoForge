require('module-alias/register');
const NEXUS = require('./src/handlers/Nexus.js');
const { TOKEN } = require('./settings/config');
const discoforge = require('./settings/discoforge');
const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const process = require('node:process');
const client = new NEXUS();
require('events').EventEmitter.setMaxListeners(999999999);
const errorLoggingEnabled = discoforge.errorLogging.enabled;
const webhookURL = discoforge.errorLogging.errorLogs || null;
const errorsDir = path.join(__dirname, './errors');

function ensureErrorDirectoryExists() {
  if (!fs.existsSync(errorsDir)) {
    fs.mkdirSync(errorsDir);
  }
}

function logErrorToFile(errorContent) {
  if (!errorLoggingEnabled) return;
  ensureErrorDirectoryExists();
  const fileName = `${new Date().toISOString().replace(/:/g, '-')}.txt`;
  const filePath = path.join(errorsDir, fileName);
  fs.writeFileSync(filePath, errorContent, 'utf8');
}

async function sendErrorNotification(message) {
  if (!errorLoggingEnabled) return;
  if (!webhookURL || webhookURL === 'WEBHOOK_URL') {
    client.log(['warningColor', 'WARNING:'], ['1', 'No valid webhook URL provided.']);
    return;
  }

  const embed = {
    title: 'Error Notification',
    description: '```' + message.slice(0, 4000) + '```',
    color: 0xff0000,
    timestamp: new Date(),
    footer: {
      text: 'Bot Error Logger',
    },
  };

  await axios.post(webhookURL, { embeds: [embed] }).catch(err => {
    client.log(['warningColor', 'WARNING:'], ['1', 'Failed to send error to Discord:', err.message]);
  });
}

process.on('unhandledRejection', async (reason, p) => {
  const msg = reason?.message?.includes('Used disallowed intents') ? 'Used disallowed intents. Please check your bot settings on the Discord developer portal.' : `Unhandled Rejection at: ${p}\nReason: ${reason}\nStack: ${reason?.stack || 'No stack trace.'}`;

  console.error(chalk.red.bold('UNHANDLED REJECTION:\n') + msg);
  logErrorToFile(msg);
  await sendErrorNotification(msg);
});

process.on('uncaughtException', async (err, origin) => {
  const msg = err.message.includes('Used disallowed intents') ? 'Used disallowed intents. Please check your bot settings on the Discord developer portal.' : `Uncaught Exception:\n${err.message}\nStack: ${err.stack || 'No stack trace.'}`;

  console.error(chalk.red.bold('UNCAUGHT EXCEPTION:\n') + msg);
  logErrorToFile(msg);
  await sendErrorNotification(msg);
});

process.on('uncaughtExceptionMonitor', async (err, origin) => {
  const msg = `Uncaught Exception (Monitor):\n${err.message}\nStack: ${err.stack || 'No stack trace.'}`;
  console.error(chalk.red.bold('UNCAUGHT EXCEPTION (MONITOR):\n') + msg);
  logErrorToFile(msg);
  await sendErrorNotification(msg);
});

client.start(TOKEN);
