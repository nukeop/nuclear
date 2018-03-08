let { app } = require('electron').remote;
import path from 'path';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const store = low(new FileSync(path.join(app.getPath('userData'), 'nuclear.json')));
initStore();

function initStore() {
  store.defaults({lastFm: {}, settings: {}}).write();
  store.write();
}

module.exports = {
  store
}
