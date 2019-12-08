import ElectronStore from 'electron-store';
import _ from 'lodash';

import options from '../../common/settings';

/**
 * Wrapper around electron-store
 * @see {@link https://github.com/sindresorhus/electron-store}
 */
class Store extends ElectronStore {
  /**
   * 
   * @param {{ logger: import('./logger').Logger }} param0 
   */
  constructor({ logger }) {
    super();
    logger && logger.log(`Initialized settings store at ${this.path}`);
  }

  /**
   * return the value of the given setting
   * @param {string} key 
   */
  getOption(key) {
    let settings = this.get('settings') || {};
    let value = settings[key];
    if (typeof value === 'undefined') {
      value = _.find(options, { name: key }).default;
    }
  
    return value;
  }

  /**
   * set a setting
   * @param {string} key 
   * @param {any} value 
   */
  setOption(key, value) {
    const settings = this.get('settings') || {};
  
    this.set('settings', Object.assign({}, settings, { [`${key}`]: value }));
  }
}

export default Store;
