import { logger } from '@nuclear/core';

export function handleCertificateError(event, webContents, url, error, certificate, callback) {
  logger.log('Certificate error', error, certificate);
  event.preventDefault();
  callback(true);
}
