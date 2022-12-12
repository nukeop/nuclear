/* eslint-disable @typescript-eslint/no-explicit-any */

import { settingsConfig } from '@nuclear/core';
import ElectronStore from 'electron-store';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import Logger, { $mainLogger } from '../logger';
import Config from '../config';

import * as yup from 'yup';


/**
 * Wrapper around electron-store
 * @see {@link https://github.com/sindresorhus/electron-store}
 */
@injectable()
class Store extends ElectronStore {
  constructor(
    @inject($mainLogger) private logger: Logger,
    @inject(Config) private config: Config
  ) {
    super();

    // First thing we do is check if config is broken
    // ===============================================

    // Turn Config java object into JSON string (DONE?)
    let jsonString = JSON.stringify(this.config);
    jsonString = jsonString.replaceAll(':', 'LOL'); // Making our config json string invalid for testing purposes
    console.log(jsonString);

    // Try JSON.parse(json string) (DONE?)
    try {
      let jsonObject = JSON.parse(jsonString);
      console.log(jsonObject);
    }

    // Catch error and reset config java object to default values (DONE?)
    catch(error) {
      console.log("BROKEN CONFIG");
      // Reset config java object to default values (DONE?)
      this.config.resetDefaultValues();
    }

    // Next we do versioning with defined schemas (Need yup module installed) 
    // ================================================

    // Create the schema for the Config (TODO)
    // let schema = yup.object().shape({
      // name: yup.string().required(),
      // age: yup.number().required().positive().integer(),
      // email: yup.string().email(),
      // website: yup.string().url(),
      // createdOn: yup.date().default(function () {
      //   return new Date();
      // }),

      // acousticId: {
      //   key: string;
      //   url: string;
      // };
      // isConnected: boolean;
      // youtubeUrl: yup.string().required(),
      // youtubeSearch: string,
      // title: string,
      // appid: string,
      // supportedFormats: string[],
      // env: Env,
      // icon: string,
      // macIcon: string,
      // discordClientId: string,
      // defaultInvidiousUrl: string,
      // thumbCleanInterval: number,
      // localLibraryDbName: string,
      // listeningHistoryDbName: string,
    // });

    // Validate our Config with the schema (TODO)

    // check validity
    // schema
    // .isValid({
    //   // name: 'jimmy',
    //   // age: 24,
    // })
    // .then(function (valid) {
    //   valid; // => true
    // });


    // If there are errors, we fix the parts of the config that don't comply with schema (TODO)
    


    if (!this.getOption('invidious.url')) {
      this.setOption('invidious.url', this.config.defaultInvidiousUrl);
    }

    if (!this.getLastThumbCleanDate()) {
      this.setLastThumbCleanDate(new Date());
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

  getLastThumbCleanDate(): Date | undefined {
    const time = this.get('last-thumb-clean-date');

    if (time) {
      return new Date(time);
    }
  }

  setLastThumbCleanDate(date: Date): void {
    this.set('last-thumb-clean-date', date.getTime());
  }


}

export default Store;
