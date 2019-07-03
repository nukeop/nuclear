import { promisify } from 'util';
import glob from 'glob';
import path from 'path';
import { parseFile } from 'music-metadata';
import uuid from 'uuid/v4';

import { getOption } from './store';
import fetchAcousticId from './lib/acousticId';

export function formatMeta({ common, format }, path) {
  let id = uuid();

  const port = getOption('api.port');

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
    cover: common.picture ? common.picture[0].data : undefined,
    loading: false,
    local: true,
    image: [
      common.picture
        ? {
          '#text': `http://127.0.0.1:${port}/nuclear/file/${id}/thumb`
        }
        : undefined
    ]
  };
}

export async function scanFoldersAndGetMeta(directories, cache = {}) {
  const cachedFiles = Object.values(cache).map(({ path }) => path);

  const files = await Promise.all([
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.mp3`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.ogg`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.wav`))
  ]).then(result => result.flat().filter(file => !cachedFiles.includes(file)));

  const metas = await Promise.all(files.map(parseFile));

  const formattedMetas = files.map((file, i) => formatMeta(metas[i], file));

  for (let i in formattedMetas) {
    if (!formattedMetas[i].name) {
      const [data] = await fetchAcousticId(formattedMetas[i].path);

      if (data && data.recording && data.recording.length) {
        formattedMetas[i].name = data.recordings[0].title;
        formattedMetas[i].artist.name =
          data.recordings[0].artists[0].name || 'unknown';
      } else {
        formattedMetas[i].name = path.basename(
          formattedMetas[i].path.split('.').shift()
        );
      }
    }
  }

  const formattedFiles = formattedMetas.map(({ path }) => path);
  const filteredCache = Object.values(cache)
    .filter(({ path }) => !formattedFiles.includes(path))
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.uuid]: item
      }),
      {}
    );

  return formattedMetas.reduce(
    (acc, item) => ({
      ...acc,
      [item.uuid]: item
    }),
    filteredCache
  );
}
