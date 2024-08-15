import dotenv from 'dotenv';
import { injectable, inject } from 'inversify';
import path from 'path';
import _ from 'lodash';

import pkg from '../../../../../package.json';
import { Env } from '../../utils/env';
import Logger, { $mainLogger } from '../logger';

const MANDATORY_ENV = ['ACOUSTIC_ID_KEY', 'DISCORD_CLIENT_ID'];

@injectable()
class Config {
  acousticId: {
    key: string;
    url: string;
  };
  isConnected: boolean;
  youtubeUrl: string;
  youtubeSearch: string;
  title: string;
  appid: string;
  supportedFormats: string[];
  env: Env;
  icon: string;
  macIcon: string;
  discordClientId: string;
  defaultInvidiousUrl: string;
  thumbCleanInterval: number;
  localLibraryDbName: string;
  listeningHistoryDbName: string;
  defaultWidth: number;
  defaultHeight: number;

  constructor(
    @inject($mainLogger) logger: Logger
  ) {
    this.env = process.env.NODE_ENV as Env || Env.DEV;
    this.title = 'Nuclear Music Player';
    this.appid = 'nuclear';
    this.youtubeUrl = 'https://www.youtube.com/watch';
    this.youtubeSearch = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&q=';
    this.supportedFormats = _.uniq(pkg.build.fileAssociations.map(({ ext }) => ext));

    const iconPath = path.resolve(__dirname, this.isProd() ? '../../../resources/media' : '../resources/media');

    this.icon = path.resolve(iconPath, 'icon.png');
    this.macIcon = path.resolve(iconPath, 'icon_apple.png');

    this.thumbCleanInterval = 30;
    this.localLibraryDbName = 'nuclear-local-db.sqlite';
    this.listeningHistoryDbName = 'nuclear-listening-history.sqlite';

    this.defaultWidth = 1366;
    this.defaultHeight = 768;

    dotenv.config({
      path: path.resolve(__dirname, '.env')
    });

    logger.log(this.env, 'Env variables loaded');

    this.validateEnv();

    this.acousticId = {
      key: process.env.ACOUSTIC_ID_KEY,
      url: 'https://api.acoustid.org/v2/lookup'
    };

    this.discordClientId = process.env.DISCORD_CLIENT_ID;
    this.defaultInvidiousUrl = process.env.INVIDIOUS_URL;
  }

  private validateEnv(): void {
    MANDATORY_ENV.forEach(ENV => {
      if (!process.env[ENV]) {
        throw new Error(`missing mandatory env variable ${ENV}`);
      }
    });
  }

  isDev(): boolean {
    return this.env === Env.DEV;
  }

  isProd(): boolean {
    return this.env === Env.PROD;
  }

  isFileSupported(filePath: string): boolean {
    return this.supportedFormats.includes(path.extname(filePath).split('.')[1]);
  }

  setConnectivity(isConnected: boolean) {
    this.isConnected = isConnected;
  }
}

export default Config;
