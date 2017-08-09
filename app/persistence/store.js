import low from 'lowdb';

const store = low('nuclear.json', { storage: require('lowdb/lib/storages/file-async') });
store.defaults({lastFm: {}, settings: {}}).write();
store.write();

module.exports = {
  store
}
