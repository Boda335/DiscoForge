const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');
const chalk = require('chalk');

/**
 * @param {string} modulePath
 */
function clearRequireCache(modulePath) {
  delete require.cache[require.resolve(modulePath)];
}

/**
 * @param {string} dirPath
 * @param {string[]} arrayOfFiles
 * @returns {string[]}
 */
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

/**
 * @param {import('../handlers/Client')} client
 * @returns {number}
 */
function reloadInteractions(client) {
  const loadedFiles = client.statuses;
  const interactionsPath = path.join(__dirname, '../ComponentsAction');
  const interactionFiles = getAllFiles(interactionsPath);
  const table = new AsciiTable('Interactions');
  table.setHeading('File', 'Status');
  table.setBorder('║', '═', '✥', '🌟');

  let loadedCount = 0;
  const statuses = [];

  for (const file of interactionFiles) {
    try {
      clearRequireCache(path.resolve(file));
      const handler = require(path.resolve(file));

      if (!handler || typeof handler.action !== 'function') {
        table.addRow(path.basename(file), chalk.red('❌'));
        client.log(['warningColor', 'WARNING:'], ['1', `Skipping ${file} (missing action function)`]);
        continue;
      }

      const status = loadedFiles.has(file) ? 'Reloaded' : 'Loaded';
      loadedFiles.set(file, true);
      statuses.push(status);

      table.addRow(path.basename(file), status);
      loadedCount++;
    } catch (error) {
      table.addRow(path.basename(file), chalk.red('❌'));
      client.log(['errorColor', 'ERROR:'], ['1', `Failed to load ${file}: ${error.message}`]);
    }
  }

  let overallStatus;
  if (statuses.every(s => s === 'Loaded')) overallStatus = 'Loaded';
  else if (statuses.every(s => s === 'Reloaded')) overallStatus = 'Reloaded';
  else overallStatus = 'Mixed';

  // console.log(table.toString());

  client.log(['successColor', 'SUCCESS:'], ['1', `${loadedCount} Interaction Handlers ${overallStatus}`]);

  return loadedCount;
}

module.exports = reloadInteractions;
