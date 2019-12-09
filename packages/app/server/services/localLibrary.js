/* eslint-disable require-atomic-updates */
import asyncPool from 'tiny-async-pool';
import glob from 'glob';
import _ from 'lodash';
import { parseFile } from 'music-metadata';
import path from 'path';
import { promisify } from 'util';
import uuid from 'uuid/v4';

/**
 * @typedef {Object} Image
 * @property {string} #text
 * 
 * @typedef {Object} NuclearBrutMeta
 * @property {string} uuid
 * @property {number} duration
 * @property {string} [path]
 * @property {string} name
 * @property {number} pos
 * @property {string} album
 * @property {{ name: string }} artist
 * @property {string} genre
 * @property {string} year
 * @property {boolean} loading
 * @property {boolean} local
 * @property {Image[]} image
 */

/**
 * Manage local files, extract metadata directly from files, or get it from acousticId api
 * format all these metadata the nuclear way and store it in a memory cache
 */
class LocalLibrary {
  constructor({ config, store, acousticId, logger }) {
    /** @type {import('./config').default} */
    this.config = config;
    /** @type {import('./store').default} */
    this.store = store;
    /** @type {import('./acousticId').default} */
    this.acousticId = acousticId;
    /** @type {import('./logger').Logger} */
    this.logger = logger;
    /** @type {Record<string, NuclearBrutMeta>} */
    this.cache = this.store.get('localMeta') || {};
    /** @type {Record<string, NuclearBrutMeta[]>} */
    this.byArtist = _.groupBy(Object.values(this.cache), track => track.artist.name);
  }

  /**
   * Format metadata from files to nuclear format
   * @private
   * @param {{ common: any, format: { duration: number }}} param0 
   * @param {string} path 
   * @returns {NuclearBrutMeta}
   */
  _formatMeta({ common, format }, path) {
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
   * update metadata memory cache and index
   * @private
   * @param {string[]} baseFiles 
   * @param {NuclearBrutMeta[]} formattedMetas
   */
  _updateCache(baseFiles, formattedMetas) {
    this.cache = Object.values(this.cache)
      .filter(({ path }) => baseFiles.includes(path))
      .concat(formattedMetas)
      .reduce(
        (acc, item) => ({
          ...acc,
          [item.uuid]: item
        }),
        {}
      );

    this.store.set('localMeta', this.cache);
    this.byArtist = _.groupBy(Object.values(this.cache), track => track.artist.name);
  }

  /**
   * fetch acousticId metadata 10 by 10
   * @private
   * @param {NuclearBrutMeta[]} metas 
   * @param {(progress: number) => void} onProgress
   * @returns {Promise}
   */
  _fetchAcousticIdBatch(metas, onProgress) {
    let scanProgress = 0;
    const scanTotal = metas.length;

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
        meta.name = path.basename(meta.path.split('.').shift());
      }
      
      scanProgress++;
      if (onProgress) {
        onProgress(scanProgress, scanTotal);
      }
    });
  }

  /**
   * scan folders on local machine, extract metadata and store it to a memory cache
   * @param {(progress: number) => void} onProgress
   * @returns {Promise}
   */
  async scanFoldersAndGetMeta(onProgress = null) {
    const directories = this.store.get('localFolders');
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
        !Object.values(this.cache)
          .map(({ path }) => path)
          .includes(file)
    );
  
    const metas = await Promise.all(files.map(parseFile));
  
    const formattedMetas = files.map((file, i) => this._formatMeta(metas[i], file));
    const formattedMetasWithoutName = formattedMetas.filter(meta => !meta.name);
  
    if (formattedMetasWithoutName.length) {
      await this._fetchAcousticIdBatch(formattedMetasWithoutName, onProgress);
    }
  
    this._updateCache(baseFiles, formattedMetas);

    return this.cache;
  }  
}

export default LocalLibrary;
