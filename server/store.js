const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const store = low(new FileSync('nuclear.json'));

module.exports = {
  store
};
