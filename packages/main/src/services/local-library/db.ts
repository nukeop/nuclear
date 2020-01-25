import { NuclearBrutMeta } from '@nuclear/core';
import ElectronStore from 'electron-store';
import { injectable, inject } from 'inversify';

import Logger, { $mainLogger } from '../logger';

export type LocalMeta = Record<string, NuclearBrutMeta>;

@injectable()
class LocalLibraryDb extends ElectronStore {
  constructor(
    @inject($mainLogger) logger: Logger
  ) {
    super({ name: 'nuclear-local-library' });
  
    logger.log(`Initialized library index at ${ this.path }`);
  }

  getLocalFolders(): string[] {
    return this.get('localFolders') || [];
  }

  removeLocalFolder(folder: string): LocalMeta {
    const folders = this.getLocalFolders();
    this.set('localFolders', folders.filter(path => path !== folder));

    const cache = Object
      .values(this.getCache())
      .filter(({ path }) => !path.includes(folder))
      .reduce(
        (acc, item) => ({ ...acc, [item.uuid]: item }),
        {}
      );
    this.set('localMeta', cache);

    return cache;
  }

  getCache(): LocalMeta {
    return this.get('localMeta') || {};
  }

  addLocalFolder(folder: string) {
    const localFolders = this.getLocalFolders();
    if (localFolders.includes(folder)) {
      return;
    }
  
    if (this.isParentOfFolder(folder)) {
      localFolders.filter(file => !file.startsWith(folder));
    }

    localFolders.push(folder);
    this.set('localFolders', localFolders);
  }

  updateCache(formattedMetas: NuclearBrutMeta[], baseFiles?: string[]): LocalMeta {
    const oldCache = this.getCache();

    const cache = Object.values(oldCache)
      .filter(({ path }) => baseFiles ? baseFiles.includes(path as string) : true)
      .concat(formattedMetas)
      .reduce(
        (acc, item) => ({
          ...acc,
          [item.uuid]: item
        }),
        {}
      );

    this.set('localMeta', cache);

    return cache;
  }

  private isParentOfFolder(filePath: string): boolean {
    const localFolders = this.getLocalFolders();

    return !localFolders.reduce<boolean>((acc, folder) => {
      return acc && !filePath.includes(folder);
    }, true);
  }

  filterParentFolder(folders: string[]): string[] {
    return folders.filter((folder) => !this.isParentOfFolder(folder));
  }

  filterNotStored(filesPath: string[]): string[] {
    const cache = this.getCache();
    const storedPath = Object.values(cache).map(({ path }) => path);

    return filesPath.filter(file => !storedPath.includes(file));
  }

  getFromPath(filePaths: string[]): NuclearBrutMeta[] {
    const cache = this.getCache();

    return Object.values(cache).filter(({ path }) => filePaths.includes(path));
  }
}

export default LocalLibraryDb;
