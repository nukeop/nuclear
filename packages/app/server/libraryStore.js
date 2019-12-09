import logger from 'electron-timber';
import electronStore from 'electron-store';

const name = 'nuclear-local-library';
const store = new electronStore({ name });
logger.log(`Initialized library index at ${ store.path }`);

export default store;