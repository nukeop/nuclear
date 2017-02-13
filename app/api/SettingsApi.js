const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

const globals = require('./Globals');

function settingsName() {
  return path.join(
    globals.directories.userdata,
    globals.directories.settings,
    globals.files.settings
  );
}

function loadSettings() {
  if (fs.existsSync(settingsName())) {
    return jsonfile.readFileSync(settingsName());
  } else {
    return {};
  }
}

function saveSettings(settings) {
  jsonfile.writeFile(settingsName, settings, (err) => {
    console.error(err);
  });
}

function loadFromSettings(property) {
  return loadSettings()[property];
}

function saveInSettings(property, value){
  var settings = loadSettings();
  settings[property] = value;
  saveSettings(settings);
}

module.exports = {
  settingsName: settingsName,
  loadSettings: loadSettings,
  saveSettings: saveSettings,
  loadFromSettings: loadFromSettings,
  saveInSettings: saveInSettings
}
