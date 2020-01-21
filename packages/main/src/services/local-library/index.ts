import { NuclearBrutMeta } from '@nuclear/core';
import glob from 'glob';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { parseFile, IAudioMetadata } from 'music-metadata';
import path from 'path';
import asyncPool from 'tiny-async-pool';
import { promisify } from 'util';
import uuid from 'uuid/v4';
import url from 'url';
import fs from 'fs';

import LocalLibraryDb, { LocalMeta } from './db';
import AcousticId from '../acoustic-id';
import Config from '../config';
import Logger, { $mainLogger } from '../logger';
import Window from '../window';

export type ProgressHandler = (progress: number, total: number) => void

const THUMBNAILS_DIR = 'thumbnails';

/**
 * Manage local files, extract metadata directly from files, or get it from acousticId api
 * format all these metadata the nuclear way and store it in a db
 */
@injectable()
class LocalLibrary {
  constructor(
    @inject(Config) private config: Config,
    @inject(LocalLibraryDb) private store: LocalLibraryDb,
    @inject(AcousticId) private acousticId: AcousticId,
    @inject($mainLogger) private logger: Logger,
    @inject(Window) private window: Window
  ) {
    this.createThumbnailsDirectory();
  }

  private async createThumbnailsDirectory() {
    const coverDir = path.resolve(__dirname, THUMBNAILS_DIR);
    try {
      await promisify(fs.stat)(coverDir);
    } catch (err) {
      try {
        await promisify(fs.mkdir)(coverDir);
        this.logger.log('Thumbnails cache directory created');
      } catch (err) {
        this.logger.error('Error while creating Thumbnails cache directory');
      }
    }
  }

  /**
   * Format metadata from files to nuclear format
   */
  private async formatMeta({ common, format }: IAudioMetadata, path: string): Promise<NuclearBrutMeta> {
    const id = uuid();
  
    let imagePath: string | undefined;

    if (common.picture && common.album) {
      imagePath = await this.persistCover(common.picture[0].data, common.album, common.picture[0].format);
    }

    return {
      uuid: id,
      path,
      duration: format.duration,
      name: common.title,
      pos: common.track.no,
      album: common.album,
      artist: {
        name: common.artist || 'unknown'
      },
      genre: common.genre,
      year: common.year,
      loading: false,
      local: true,
      image: [
        imagePath
          ? {
            '#text': url.format({
              pathname: imagePath,
              protocol: 'file:',
              slashes: true
            })
          }
          : undefined
      ],
      streams: [
        {
          uuid: id,
          title: common.title,
          duration: format.duration,
          source: 'Local',
          stream: url.format({
            pathname: path,
            protocol: 'file',
            slashes: true
          })
        }
      ]
    };
  }

  private async existCover(coverPath: string): Promise<string | undefined> {
    try {
      const { isFile } = await promisify(fs.stat)(coverPath);
      return isFile && coverPath;
    } catch (err) {
      return undefined;
    }

  }

  private async persistCover(cover: Buffer, album: string, mime: string) {
    const coverPath = path.resolve(__dirname, THUMBNAILS_DIR, album + '.' + mime.split('/')[1]);
    const existingCover = await this.existCover(coverPath);

    if (existingCover) {
      return existingCover;
    }

    await promisify(fs.writeFile)(coverPath, cover);

    return coverPath;
  }

  private async parseMeta(filesPath: string[], onProgress?: ProgressHandler): Promise<NuclearBrutMeta[]> {
    const metas = await Promise.all(filesPath.map(file => parseFile(file)));

    const formattedMetas = await Promise.all(filesPath.map((file, i) => this.formatMeta(metas[i], file)));


    if (this.config.isConnected) {
      const formattedMetasWithoutName = formattedMetas.filter(meta => !meta.name);
  
      if (formattedMetasWithoutName.length) {
        await this.fetchAcousticIdBatch(formattedMetasWithoutName, onProgress);
      }
    }

    return formattedMetas;
  }

  async removeLocalFolder(folder: string): Promise<LocalMeta> {
    const oldMetas = this.store.getCache();
    const metas = this.store.removeLocalFolder(folder);
    const removedImages: string[] = [];

    for (const { path, image } of Object.values(oldMetas)) {
      if (path.includes(folder) && image[0] && !removedImages.includes((image as any)[0]['#text'])) {
        removedImages.push((image as any)[0]['#text']);
        await promisify(fs.unlink)((image as any)[0]['#text'].split('://')[1]);
      }
    }

    return metas;
  }

  async getMetas(filesPath: string[], onProgress?: ProgressHandler): Promise<{
    image: undefined;
    artist: string;
    thumbnail: string;
  }[]> {
    const formattedMetas = await this.parseMeta(filesPath, onProgress);

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
  fetchAcousticIdBatch(metas: NuclearBrutMeta[], onProgress?: ProgressHandler): Promise<void[]> {
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
        meta.artist.name = data.recordings[0].artists[0].name || 'unknown';
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
  async scanFoldersAndGetMeta(onProgress?: ProgressHandler): Promise<LocalMeta> {
    const directories = this.store.getLocalFolders();
    const baseFiles = await Promise.all(
      _.flatMap(
        this.config.supportedFormats,
        format => directories.map(
          dir => promisify(glob)(`${dir}/**/*.${format}`)
        )
      )
    ).then(result => result.flat());
  
    const cache = this.store.getCache() || {};

    const files = baseFiles.filter(
      file => !Object.values(cache)
        .map(({ path }) => path)
        .includes(file)
    );
    
    const formattedMetas = await this.parseMeta(files, onProgress);
  
    return this.store.updateCache(formattedMetas, baseFiles);
  }

  async playStartupFile(filePath: string) {
    try {
      const metas = await this.getMetas([
        path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath)
      ]);

      this.window.send('play-startup-track', metas[0]);
    } catch (err) {
      this.logger.error('Error trying to play audio file');
      this.logger.error(err);
    }
  }
}

export default LocalLibrary;
