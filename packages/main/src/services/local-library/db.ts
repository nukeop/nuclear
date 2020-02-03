import { app } from 'electron';
import { injectable, inject } from 'inversify';
import { createConnection, Connection, Repository } from 'typeorm';
import path from 'path';

import Logger, { $mainLogger } from '../logger';
import { NuclearLocalMeta } from './interfaces';
import LocalFolder from './model/LocalFolder';
import LocalTrack from './model/LocalTrack';

const DB_NAME = 'nuclear-local-db.sqlite';

@injectable()
class LocalLibraryDb {
  private connection: Connection;
  private trackRepository: Repository<LocalTrack>;
  private folderRepository: Repository<LocalFolder>;

  constructor(
    @inject($mainLogger) private logger: Logger
  ) {}

  async connect() {
    try {
      const database = path.join(app.getPath('userData'), DB_NAME);
      this.connection = await createConnection({
        type: 'sqlite',
        database,
        entities: [
          LocalFolder,
          LocalTrack
        ],
        synchronize: true,
        logging: false
      });

      this.folderRepository = this.connection.getRepository<LocalFolder>(LocalFolder);
      this.trackRepository = this.connection.getRepository<LocalTrack>(LocalTrack);

      this.logger.log(`Sqlite database created at ${database}`);
    } catch (err) {
      this.logger.error('Sqlite database creation failed');
      this.logger.error(err.stack);
    }
  }

  async getLocalFolders(): Promise<LocalFolder[]> {
    return this.folderRepository.find();
  }

  async getOneFolder(path: string): Promise<LocalFolder | undefined> {
    return this.folderRepository.findOne({ where: { path } });
  }

  async removeLocalFolder(folder: string): Promise<LocalTrack[]> {
    const localFolder = await this.folderRepository.findOne({ where: { path: folder }, relations: ['tracks'] });

    if (localFolder) {

      await this.connection.transaction(async manager => {
        await Promise.all(localFolder.tracks.map(track => manager.remove(track)));
        await manager.remove(localFolder);
      });

    }

    return this.getTracks();
  }

  async getTracks(): Promise<LocalTrack[]> {
    return this.trackRepository.find();
  }

  async addFolder(folder: string) {
    const localFolders = await this.getLocalFolders();
    const folderPaths = localFolders.map(({ path }) => path);

    if (folderPaths.includes(folder)) {
      return localFolders.find(({ path }) => folder === path) as LocalFolder;
    }
  
    if (this.isParentOfFolder(folder, folderPaths)) {
      await Promise.all(
        folderPaths
          .filter(file => file.startsWith(folder))
          .map((path) => this.folderRepository.delete({ path }))
      );
    }

    const newFolder = new LocalFolder();
    newFolder.path = folder;

    return this.folderRepository.save(newFolder);
  }

  async updateTracks(formattedMetas: NuclearLocalMeta[]): Promise<Partial<LocalTrack>[]> {
    try {
      try {
        const metas = await Promise.all(
          formattedMetas.map(track => {
            const newTrack = this.trackRepository.create(track);
            newTrack.imageData = track.imageData;
            newTrack.genre = track.genre;
            return this.trackRepository.save(newTrack);
          })
        );
  
        return metas;
      } catch (err) {
        this.logger.error(err.stack);
        return this.trackRepository.find();
      }
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }

  private isParentOfFolder(filePath: string, foldersPath: string[]): boolean {
    return !foldersPath.reduce<boolean>((acc, folder) => {
      return acc && !filePath.includes(folder);
    }, true);
  }

  async getTracksFromPath(filePaths: string[]): Promise<LocalTrack[]> {
    const tracks = await Promise.all(
      filePaths.map((filePath) => this.trackRepository.find({ where: { folder: filePath } }))
    );

    return tracks.flat();
  }

  async close(): Promise<void> {
    return this.connection.close();
  }
}

export default LocalLibraryDb;
