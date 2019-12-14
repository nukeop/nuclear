import dotenv from 'dotenv';
import { injectable, inject } from 'inversify';
import path from 'path';

import { Env } from '../../utils/env';
import Logger, { mainLogger } from '../logger';

const MANDATORY_ENV = ['ACOUSTIC_ID_KEY'];

@injectable()
class Config {
  sentryDsn: string;
  acousticId: {
    key: string;
    url: string;
  };
  youtubeUrl: string;
  youtubeSearch: string;
  title: string;
  supportedFormats: string[];
  env: Env;

  constructor(@inject(mainLogger) logger: Logger) {
    this.env = process.env.NODE_ENV as Env || Env.DEV;
    this.title = 'Nuclear Music Player';
    this.youtubeUrl = 'https://www.youtube.com/watch';
    this.youtubeSearch = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&q=';
    this.supportedFormats = [
      'aac',
      'flac',
      'm4a',
      'mp3',
      'ogg',
      'wav'
    ];

    logger.log('Environement', this.env);

    const envFilePath = this.isDev() ? '../../../.env' : '.env';

    dotenv.config({
      path: path.resolve(__dirname, envFilePath)
    });

    logger.log('Env variables loaded');
  
    if (process.env.NODE_ENV === 'production') {
      MANDATORY_ENV.push('SENTRY_DSN');
    }

    this.validateEnv();

    this.sentryDsn = process.env.SENTRY_DSN;

    this.acousticId = {
      key: process.env.ACOUSTIC_ID_KEY,
      url: 'https://api.acoustid.org/v2/lookup'
    };
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
}

export default Config;
