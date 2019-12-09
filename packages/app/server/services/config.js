const MANDATORY_ENV = ['ACOUSTIC_ID_KEY'];

class Config {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      MANDATORY_ENV.push('SENTRY_DSN');
    }

    this._validateEnv();

    /** @type {string} */
    this.sentryDsn = process.env.SENTRY_DSN;
    /** @type {{ key: string, url: string }} */
    this.acousticId = {
      key: process.env.ACOUSTIC_ID_KEY,
      url: 'https://api.acoustid.org/v2/lookup'
    };
    /** @type {string} */
    this.youtubeUrl = 'https://www.youtube.com/watch';
    /** @type {string} */
    this.title = 'Nuclear Music Player';
    /** @type {string[]} */
    this.supportedFormats = [
      'aac',
      'flac',
      'm4a',
      'mp3',
      'ogg',
      'wav'
    ];
  }

  _validateEnv() {
    MANDATORY_ENV.forEach(ENV => {
      if (!process.env[ENV]) {
        throw new Error(`missing mandatory env variable ${ENV}`);
      }
    });
  }
}

export default Config;
