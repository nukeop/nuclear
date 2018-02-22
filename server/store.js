const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const _ = require('lodash');
const options = require('../app/constants/settings');

const store = low(new FileSync('nuclear.json'));

function getOption(key) {
  var value = store.get(key).value();
  if (!value || Object.keys(value).length < 1) {
    value = _.find(options, option => option.name === key);
  }

  return value;
};

module.exports = {
  getOption
};
