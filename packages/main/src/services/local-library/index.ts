import { IpcEvents } from '@nuclear/core';
import glob from 'glob';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { parseFile, IAudioMetadata } from 'music-metadata';
import path from 'path';
import asyncPool from 'tiny-async-pool';
import { promisify } from 'util';
import uuid from 'uuid/v4';
import fs from 'fs';
import { app } from 'electron';

import LocalLibraryDb from './db';
import AcousticId from '../acoustic-id';
import Config from '../config';
import Logger, { $mainLogger } from '../logger';
import Window from '../window';
import LocalTrack from './model/LocalTrack';
import { NuclearLocalMeta } from './interfaces';
import LocalFolder from './model/LocalFolder';

export type ProgressHandler = (progress: number, total: number) => void

/**
 * Manage local files, extract metadata directly from files, or get it from acousticId api
 * format all these metadata the nuclear way and store it in a db
 */
@injectable()
class LocalLibrary {
  private mediaDir: string;

  constructor(
    @inject(Config) private config: Config,
    @inject(LocalLibraryDb) private store: LocalLibraryDb,
    @inject(AcousticId) private acousticId: AcousticId,
    @inject($mainLogger) private logger: Logger,
    @inject(Window) private window: Window
  ) {
    this.mediaDir = path.join(app.getPath('userData'), 'thumbnails');
    this.createThumbnailsDirectory();
  }

  private async createThumbnailsDirectory() {
    try {
      await promisify(fs.stat)(this.mediaDir);
    } catch (err) {
      try {
        await promisify(fs.mkdir)(this.mediaDir);
        this.logger.log('Thumbnails cache directory created');
      } catch (err) {
        this.logger.error('Error while creating Thumbnails cache directory');
        this.logger.error(err);
      }
    }
  }

  /**
   * Format metadata from files to nuclear format
   */
  private async formatMeta({ common, format }: IAudioMetadata, { file, folder }: { file: string; folder?: LocalFolder }): Promise<NuclearLocalMeta> {    
    return {
      uuid: uuid(),
      path: file,
      folder,
      duration: format.duration,
      name: common.title,
      position: common.track.no,
      album: common.album,
      artist: common.artist || 'unknown',
      genre: common.genre,
      year: common.year ? common.year.toString() : undefined,
      imageData: common.picture && common.picture[0]
    };
  }

  private async parseMeta(filesPath: Array<{ file: string; folder?: LocalFolder }>, onProgress?: ProgressHandler): Promise<NuclearLocalMeta[]> {
    const metas = await Promise.all(filesPath.map(({ file }) => parseFile(file)));

    const formattedMetas = await Promise.all(filesPath.map((file, i) => this.formatMeta(metas[i], file)));

    if (this.config.isConnected) {
      const formattedMetasWithoutName = formattedMetas.filter(meta => !meta.name);
  
      if (formattedMetasWithoutName.length) {
        await this.fetchAcousticIdBatch(formattedMetasWithoutName, onProgress);
      }
    }

    return formattedMetas;
  }

  async getMetas(filesPath: string[], onProgress?: ProgressHandler): Promise<{
    image: undefined;
    artist: string;
    thumbnail: string;
  }[]> {
    const formattedMetas = await this.parseMeta(filesPath.map((file) => ({ file })), onProgress);

    return formattedMetas
      .map(meta => ({
        ...meta,
        image: undefined,
        artist: _.get(meta, ['artist', 'name']),
        thumbnail: _.get(meta, ['image', 0, '#text'])
      }));
  }

  /**
   * fetch acousticId metadata 10 by 10
   */
  fetchAcousticIdBatch(metas: NuclearLocalMeta[], onProgress?: ProgressHandler): Promise<void[]> {
    let scanProgress = 0;
    const scanTotal = metas.length;

    this.logger.log('start fetching metadata from acoustic-id api');
    // Limit acoustic-id fetching to a max of X at a time
    return asyncPool(10, metas, async meta => {
      let data;
      try {
        const {results, error} = await this.acousticId.getMetadata(meta.path);
        if (results) {
          data = results[0];
        } else if (error) {
          this.logger.error(`Acoustic ID error (code ${error.code}): ${error.message}`);
        }
      } catch (ex) {
        // Log errors (from fpcalc) to console, but don't halt the entire scanning process
        this.logger.error(ex);
      }

      if (data && data.recordings && data.recordings.length) {
        meta.name = data.recordings[0].title;
        meta.artist = data.recordings[0].artists[0].name || 'unknown';
      } else {
        meta.name = path.basename(meta.path.split('.').shift() as string);
      }
      
      scanProgress++;
      if (onProgress) {
        onProgress(scanProgress, scanTotal);
      }
    });
  }

  /**
   * scan folders on local machine, extract metadata and store it to a memory cache
   */
  async scanFoldersAndGetMeta(directories: LocalFolder[], onProgress?: ProgressHandler): Promise<Partial<LocalTrack>[]> {
    const filesData = await Promise.all(
      _.flatMap(
        this.config.supportedFormats,
        format => Promise.all(directories.map(
          async (folder) => ({
            files: await promisify(glob)(`${folder.path}/**/*.${format}`),
            folder
          })
        ))
      )
    );
    const files = filesData
      .flat()
      .reduce<Array<{ file: string; folder: LocalFolder }>>((acc, item) => {
        return item.files.map((filePath) => ({
          file: filePath,
          folder: item.folder
        })).concat(acc);
      }, []);
    const formattedMetas = await this.parseMeta(files, onProgress);
  
    return this.store.updateTracks(formattedMetas);
  }

  async playStartupFile(filePath: string) {
    try {
      const metas = await this.getMetas([
        path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath)
      ]);

      this.window.send(IpcEvents.PLAY_STARTUP_TRACK, metas[0]);
    } catch (err) {
      this.logger.error('Error trying to play audio file');
      this.logger.error(err);
    }
  }
}

export default LocalLibrary;
