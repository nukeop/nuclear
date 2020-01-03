import { NuclearBrutMeta } from '@nuclear/common';
import glob from 'glob';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { parseFile, IAudioMetadata } from 'music-metadata';
import path from 'path';
import asyncPool from 'tiny-async-pool';
import { promisify } from 'util';
import uuid from 'uuid/v4';
import fs from 'fs';
import url from 'url';

import AcousticId from '../acoustic-id';
import Config from '../config';
import Logger, { $mainLogger } from '../logger';
import LocalLibraryDb, { LocalMeta } from './db';
import Window from '../window';

export type ProgressHandler = (progress: number, total: number) => void

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
  ) {}

  /**
   * Format metadata from files to nuclear format
   */
  private formatMeta({ common, format }: IAudioMetadata, path: string): NuclearBrutMeta {
    const id = uuid();
  
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
        common.picture
          ? {
            '#text': `data:${
              common.picture[0].format
            };base64,${common.picture[0].data.toString('base64')}`
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

  async getMetas(filesPath: string[], onProgress?: ProgressHandler): Promise<{
    metas: Array<{
      image: undefined;
      artist: string;
      thumbnail: string;
    }>;
    folders: string[];
  }> {
    const folders: string[] = [];
    const files = filesPath
      .map((filePath) => {
        const stats = fs.lstatSync(filePath);

        if (stats.isDirectory()) {
          folders.push(filePath);

          return _.flatMap(
            this.config.supportedFormats,
            format => glob.sync(`${filePath}/**/*.${format}`)
          );
        } else if (stats.isFile()) {
          folders.push(path.dirname(filePath));
          return filePath;
        }
      })
      .flat();

    const notStoredPath = this.store.filterNotStored(files);
    const storedMetas = this.store.getFromPath(files); 

    const metas = await Promise.all(notStoredPath.map(file => parseFile(file)));
    const formattedMetas = notStoredPath.map((file, i) => this.formatMeta(metas[i], file));
    const formattedMetasWithoutName = formattedMetas.filter(meta => !meta.name);

    if (formattedMetasWithoutName.length) {
      await this.fetchAcousticIdBatch(formattedMetasWithoutName, onProgress);
    }

    this.store.updateCache(formattedMetas);
    const filteredFolders = _.uniq(this.store.filterParentFolder(folders));
    filteredFolders.forEach(folder => this.store.addLocalFolder(folder));

    return {
      metas: formattedMetas
        .concat(storedMetas)
        .map(meta => ({
          ...meta,
          image: undefined,
          artist: _.get(meta, ['artist', 'name']),
          thumbnail: _.get(meta, ['image', 0, '#text'])
        })),
      folders: filteredFolders
    };
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
  
    const metas = await Promise.all(files.map(filePath => parseFile(filePath)));
  
    const formattedMetas = files.map((file, i) => this.formatMeta(metas[i], file));
    const formattedMetasWithoutName = formattedMetas.filter(meta => !meta.name);
  
    if (formattedMetasWithoutName.length) {
      await this.fetchAcousticIdBatch(formattedMetasWithoutName, onProgress);
    }
  
    return this.store.updateCache(formattedMetas, baseFiles);
  }

  async playStartupFile(filePath: string) {
    try {
      const { metas, folders } = await this.getMetas([
        path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath)
      ]);

      this.window.send('play-startup-track', {
        meta: metas[0],
        folders
      });
    } catch (err) {
      this.logger.error('Error trying to play audio file');
      this.logger.error(err);
    }
  }
}

export default LocalLibrary;
