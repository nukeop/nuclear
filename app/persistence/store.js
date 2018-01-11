import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const store = low(new FileSync('nuclear.json'));
initStore();

function initStore() {
  store.defaults({lastFm: {}, settings: {}}).write();
  store.write();
}


module.exports = {
  store
}
