const initialize = () => Promise.resolve();
const logError = err => console.error(`Error: ${err}`)
const { checkForDBUpdates, downloadDB } = require('./db');

initialize()
  .then(checkForDBUpdates)
  .then(downloadDB)
  .then(runParser)
  .catch(logError)
