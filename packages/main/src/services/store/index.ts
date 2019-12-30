/* eslint-disable @typescript-eslint/no-explicit-any */
import { settingsConfig } from '@nuclear/common';
import ElectronStore from 'electron-store';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import Logger, { mainLogger } from '../logger';
import Config from '../config';

/**
 * Wrapper around electron-store
 * @see {@link https://github.com/sindresorhus/electron-store}
 */
@injectable()
class Store extends ElectronStore {
  constructor(
    @inject(mainLogger) private logger: Logger,
    @inject(Config) private config: Config
  ) {
    super();

    if (!this.getOption('yt.apiKey')) {
      this.setOption('yt.apiKey', this.config.defaultYoutubeApiKey);
    }

    this.logger.log(`Initialized settings store at ${this.path}`);
  }

  getOption(key: string): any {
    const settings = this.get('settings') || {};
    let value = settings[key];

    if (typeof value === 'undefined') {
      value = (_.find(settingsConfig, { name: key }) as any).default;
    }
  
    return value;
  }

  setOption(key: string, value: any): void {
    const settings = this.get('settings') || {};
  
    this.set('settings', Object.assign({}, settings, { [`${key}`]: value }));
  }

  async setAvailableHttpPort(startPort: number, endPort: number) {
    const { default: getPort } = await import('get-port');
    const availablePort = await getPort({ port: getPort.makeRange(startPort, endPort) });
  
    this.setOption('api.port', availablePort);
  }
}

export default Store;
