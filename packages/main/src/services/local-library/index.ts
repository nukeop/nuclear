/* eslint-disable require-atomic-updates */
import { NuclearBrutMeta } from '@nuclear/common';
import glob from 'glob';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { parseFile, IAudioMetadata } from 'music-metadata';
import path from 'path';
import asyncPool from 'tiny-async-pool';
import { promisify } from 'util';
import uuid from 'uuid/v4';

import AcousticId from '../acoustic-id';
import Config from '../config';
import Logger, { mainLogger } from '../logger';
import LocalLibraryDb from './db';

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
    @inject(mainLogger) private logger: Logger
  ) {}

  /**
   * Format metadata from files to nuclear format
   */
  private formatMeta({ common, format }: IAudioMetadata, path: string): NuclearBrutMeta {
    return {
      uuid: uuid(),
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
      ]
    };
  }

  /**
   * fetch acousticId metadata 10 by 10
   */
  fetchAcousticIdBatch(metas: NuclearBrutMeta[], onProgress: (progress: number, total: number) => void): Promise<void[]> {
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
  async scanFoldersAndGetMeta(onProgress: (progress: number, total: number) => void): Promise<Record<string, NuclearBrutMeta>> {
    const directories: string[] = this.store.get('localFolders');
    const baseFiles = await Promise.all(
      _.flatMap(
        this.config.supportedFormats,
        format => directories.map(
          dir => promisify(glob)(`${dir}/**/*.${format}`)
        )
      )
    ).then(result => result.flat());
  
    const files = baseFiles.filter(
      file =>
        !Object.values(this.store.getCache())
          .map(({ path }) => path)
          .includes(file)
    );
  
    const metas = await Promise.all(files.map(filePath => parseFile(filePath)));
  
    const formattedMetas = files.map((file, i) => this.formatMeta(metas[i], file));
    const formattedMetasWithoutName = formattedMetas.filter(meta => !meta.name);
  
    if (formattedMetasWithoutName.length) {
      await this.fetchAcousticIdBatch(formattedMetasWithoutName, onProgress);
    }
  
    return this.store.updateCache(baseFiles, formattedMetas);
  }  
}

export default LocalLibrary;
