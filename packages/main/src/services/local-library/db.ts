import ElectronStore from 'electron-store';
import { injectable, inject } from 'inversify';

import Logger, { mainLogger } from '../logger';

@injectable()
class LocalLibraryDb extends ElectronStore {
  constructor(
    @inject(mainLogger) logger: Logger
  ) {
    super({ name: 'nuclear-local-library' });

    logger.log(`Initialized library index at ${ this.path }`);
  }
}

export default LocalLibraryDb;
