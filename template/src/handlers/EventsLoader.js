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
  client.removeAllListeners();
  if (client.distube) client.distube.removeAllListeners();

  const loadedFiles = client.statuses;
  const eventFiles = getAllFiles('src/events');
  const eventsTable = new AsciiTable('Events');
  eventsTable.setHeading('Event File', 'Status');
  eventsTable.setBorder('║', '═', '✥', '🌟');

  const statuses = [];
  let eventCount = 0;

  for (const file of eventFiles) {
    try {
      clearRequireCache(path.resolve(file));
      const event = require(path.resolve(file));

      if (!event.name || typeof event.execute !== 'function') {
        eventsTable.addRow(path.basename(file), chalk.red('❌'));
        client.log(['warningColor', 'WARNING:'], ['1', `Skipping ${file} (missing name or execute function)`]);
        continue;
      }

      const isDistubeEvent = ['playSong', 'addSong', 'playList', 'addList', 'searchResult', 'searchCancel', 'error', 'finish', 'finishSong', 'disconnect', 'empty', 'initQueue'].includes(event.name);

      if (isDistubeEvent && client.distube) {
        if (event.once) client.distube.once(event.name, (...args) => event.execute(...args, client));
        else client.distube.on(event.name, (...args) => event.execute(...args, client));
      } else {
        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
        else client.on(event.name, (...args) => event.execute(...args, client));
      }

      const status = loadedFiles.has(file) ? 'Reloaded' : 'Loaded';
      loadedFiles.set(file, true);
      statuses.push(status);

      eventsTable.addRow(path.basename(file), status);
      eventCount++;
    } catch (error) {
      eventsTable.addRow(path.basename(file), chalk.red('❌'));
      client.log(['errorColor', 'ERROR:'], ['1', `Failed to load ${file}: ${error.message}`]);
    }
  }

  let overallStatus;
  if (statuses.every(s => s === 'Loaded')) overallStatus = 'Loaded';
  else if (statuses.every(s => s === 'Reloaded')) overallStatus = 'Reloaded';
  else overallStatus = 'Mixed';

  // console.log(eventsTable.toString());

  client.log(['successColor', 'SUCCESS:'], ['1', `${eventCount} Events ${overallStatus}`]);

  return eventCount;
}

module.exports = reloadEvents;
