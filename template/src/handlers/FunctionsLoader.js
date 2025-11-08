const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');
const chalk = require('chalk');

function clearRequireCache(modulePath) {
  delete require.cache[require.resolve(modulePath)];
}

function reloadFunctions(client) {
  const functionsDir = path.join(__dirname, '..', 'functions');
  const loadedFiles = client.statuses;
  const functionsTable = new AsciiTable('Functions');
  functionsTable.setHeading('Function File', 'Status');
  functionsTable.setBorder('║', '═', '✥', '🌟');

  let loadedFunctions = 0;
  const statuses = [];

  function getAllFunctionFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        results = results.concat(getAllFunctionFiles(filePath));
      } else if (file.endsWith('.js')) {
        results.push(filePath);
      }
    });
    return results;
  }

  const functionFiles = getAllFunctionFiles(functionsDir);

  for (const file of functionFiles) {
    try {
      clearRequireCache(file);
      const func = require(file);
      if (typeof func === 'function') {
        loadedFunctions++;
        // تحديد حالة التحميل لكل ملف
        const status = loadedFiles.has(file) ? 'Reloaded' : 'Loaded';
        loadedFiles.set(file, true);
        statuses.push(status);

        functionsTable.addRow(path.basename(file), status);
      } else {
        functionsTable.addRow(path.basename(file), chalk.red('❌'));
      }
    } catch (error) {
      functionsTable.addRow(path.basename(file), chalk.red('❌'));
      client.log(['errorColor', 'ERROR:'], ['1', `Failed to load ${file}: ${error.message}`]);
    }
  }
  let overallStatus;
  if (statuses.every(s => s === 'Loaded')) overallStatus = 'Loaded';
  else if (statuses.every(s => s === 'Reloaded')) overallStatus = 'Reloaded';
  else overallStatus = 'Mixed';

  // console.log(functionsTable.toString());

  client.log(['successColor', 'SUCCESS:'], ['1', `${loadedFunctions} Functions ${overallStatus}`]);

  return loadedFunctions;
}

module.exports = reloadFunctions;
