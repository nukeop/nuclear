import * as Sentry from '@sentry/electron';

const logger = {
  log() {},
  warn() {},
  error(err) {
    Sentry.captureException(err);
  }
};

export default logger;
