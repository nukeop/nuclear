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
    
    // Create the schemas initially
    const schema1 = yup.object().shape({
      // The commented out stuff are elements we used to have in the schema.
      // We removed it because we thought it would be redundant to check these properties
      // again when they are already typechecked in the constructor of the Config class.

  
      // acousticId: yup.object().shape({
      //   key: yup.string().required(),
      //   url: yup.string().required(),
      // }).default({key: '', url: ''}),
      // isConnected: yup.boolean().required().default(false),
      // youtubeUrl: yup.string().required().default(''),
      // youtubeSearch: yup.string().required().default(''),
      // title: yup.string().required().default(''),
      // appid: yup.string().required().default(''),
      // supportedFormats: yup.array().of(yup.string()).required().default([]),
      // env: yup.string().required().default('DEV'),
      // icon: yup.string().required().default(''),
      // macIcon: yup.string().required().default(''),
      // discordClientId: yup.string().required().default(''),
      // defaultInvidiousUrl: yup.string().required().default(''),
      // thumbCleanInterval: yup.number().required().positive().integer().default(0),
      // localLibraryDbName: yup.string().required().default(''),
      // listeningHistoryDbName: yup.string().required().default(''),

      //Nukeop said to include the settings, playlists, and favorites in the schema so these get typechecked in this
      // file. We got the types of these files from the store.js file that is also linked in the discord.
      settings: yup.object().shape({}).required().default({}),
      playlists: yup.array().required().default([]),
      favorites: yup.array().of(
        yup.object().shape({
          tracks: yup.array().of(yup.string()).required().default([]),
          artists: yup.array().of(yup.string()).required().default([]),
          albums: yup.array().of(yup.string()).required().default([]),
        })
      ).default([]),
      version: yup.number().required().positive().integer().default(1),
    });

    // This is a second schema for if schema1 doesn't work
    const schema2 = yup.object().shape({

    });


    // Add settings member to the config
    this.config['settings'] = schema1.fields.settings;


    // First thing we do is check if config is broken
    // ===============================================

    // Turn Config Java Object into JSON string
    let jsonString = JSON.stringify(this.config);

    // Makes config json string invalid by replacing all ':' with 'LOL' which would trigger the catch clause below
    // "{'title':'Nuclear Music Player'}" ---> "{'title'LOL'Nuclear Music Player}"
    jsonString = jsonString.replaceAll(':', 'LOL');

    // Try parsing jsonString into jsonObject
    let jsonObject;
    try {
      jsonObject = JSON.parse(jsonString);
      //console.log(jsonObject);
    }

    // If error, reset config java object to default values
    catch(error) {
      console.log("BROKEN CONFIG ERROR: RESETTING CONFIG TO DEFAULT VALUES");

      // Our new method to reset to default values
      this.set("config", JSON.stringify(schema1));

      // The old method we were using to reset to default values
      // this.config.resetDefaultValues();
    }


    // Next we do versioning with defined schemas
    // ================================================

    // Check if the config has a version key
    if (this.config.version) {
      // If there is a version key, validate the config using the appropriate schema
      switch (this.config.version) {
        case 1:
          schema1.validateSync(jsonObject);
          break;
        case 2:
          schema2.validateSync(jsonObject);
          break;
        // Add more cases here for future versions
      }
    } else {
      // If there is no version key, assume it is version 1 and validate using the schema1
      schema1.validateSync(jsonObject);
    }  


    // Just some old stuff we were testing with to check validity of schema
    //=======================================================================
    
    // schema.validate(config)
    // .then(validConfig => { schema
    // })
    // .catch(error => {
    // // handle errors in config here
    // // you could migrate or reset the invalid part of the config
    // });

    // schema.validate(jsonObject).then(function (valid) {
    //   console.log("VALID");
    // })
    // .catch((error) => {
    //   console.log("ERROR: " + error);
    // });

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
