import { promisify } from 'util';
import glob from 'glob';
import path from 'path';
import { parseFile } from 'music-metadata';
import uuid from 'uuid/v4';
import _ from 'lodash';
import asyncPool from 'tiny-async-pool';

import fetchAcousticId from './lib/acousticId';

const SUPPORTED_FORMATS = [
  'aac',
  'flac',
  'm4a',
  'mp3',
  'ogg',
  'wav'
];

export function formatMeta({ common, format }, path) {
  let id = uuid();

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
    ]
  };
}

export async function scanFoldersAndGetMeta(directories, cache = {}, onProgress = null) {
  const baseFiles = await Promise.all(
    _.flatMap(
      SUPPORTED_FORMATS,
      format => directories.map(
        dir => promisify(glob)(`${dir}/**/*.${format}`)
      )
    )
  ).then(result => result.flat());

  const files = baseFiles.filter(
    file =>
      !Object.values(cache)
        .map(({ path }) => path)
        .includes(file)
  );

  const metas = await Promise.all(files.map(parseFile));

  const formattedMetas = files.map((file, i) => formatMeta(metas[i], file));
  const formattedMetasWithoutName = formattedMetas.filter(meta => !meta.name);

  if (formattedMetasWithoutName.length) {
    let scanProgress = 0;
    const scanTotal = formattedMetasWithoutName.length;

    // Limit acoustic-id fetching to a max of X at a time
    await asyncPool(10, formattedMetasWithoutName, async meta => {
      let data;
      try {
        const {results, error} = await fetchAcousticId(meta.path);
        if (results) {
          data = results[0];
        } else if (error) {
          console.error(`Acoustic ID error (code ${error.code}): ${error.message}`);
        }
      } catch (ex) {
        // Log errors (from fpcalc) to console, but don't halt the entire scanning process
        console.error(ex);
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

  return Object.values(cache)
    .filter(({ path }) => baseFiles.includes(path))
    .concat(formattedMetas)
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.uuid]: item
      }),
      {}
    );
}
