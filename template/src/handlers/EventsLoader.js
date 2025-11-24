const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');
const chalk = require('chalk');

function clearRequireCache(modulePath) {
  delete require.cache[require.resolve(modulePath)];
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.js')) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

function reloadEvents(client) {
  for (const key of Object.keys(client)) {
    if (client[key] && typeof client[key].removeAllListeners === 'function') {
      client[key].removeAllListeners();
    }
  }

  const eventFiles = getAllFiles('src/events');
  const eventsTable = new AsciiTable('Events');
  eventsTable.setHeading('File', 'Target', 'Status');
  eventsTable.setBorder('║', '═', '✥', '🌟');

  let count = 0;

  for (const file of eventFiles) {
    try {
      clearRequireCache(path.resolve(file));
      const event = require(path.resolve(file));

      if (!event.name || typeof event.execute !== 'function' || !event.target) {
        eventsTable.addRow(path.basename(file), event.target || '-', chalk.red('❌'));
        client.log(['warningColor', 'WARNING:'], ['1', `Skipping ${file} (missing name/execute/target)`]);
        continue;
      }

      const target = event.target === 'client' ? client : client[event.target];
      if (!target) {
        eventsTable.addRow(path.basename(file), event.target, chalk.red('❌ Unknown target'));
        client.log(['warningColor', 'WARNING:'], ['1', `Target ${event.target} not found in client for ${file}`]);
        continue;
      }

      if (event.once && typeof target.once === 'function') {
        target.once(event.name, (...args) => event.execute(client, ...args));
      } else if (typeof target.on === 'function') {
        target.on(event.name, (...args) => event.execute(client, ...args));
      } else {
        eventsTable.addRow(path.basename(file), event.target, chalk.red('❌ No on/once'));
        continue;
      }

      eventsTable.addRow(path.basename(file), event.target, '✅');
      count++;
    } catch (error) {
      eventsTable.addRow(path.basename(file), '-', chalk.red('❌'));
      client.log(['errorColor', 'ERROR:'], ['1', `Failed to load ${file}: ${error.message}`]);
    }
  }

  client.log(['successColor', 'SUCCESS:'], ['1', `${count} Events Reloaded`]);
  // console.log(eventsTable.toString());
  return count;
}

module.exports = reloadEvents;
