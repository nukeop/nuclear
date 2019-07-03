import { promisify } from 'util';
import glob from 'glob';
import path from 'path';
import { parseFile } from 'music-metadata';
import uuid from 'uuid/v4';

import { store, getOption } from './store';
import fetchAcousticId from './lib/acousticId';

export function formatMeta({ common, format }, path) {
  const cachedMetas = store.get('localMeta');
  let id;

  for (let i of Object.values(cachedMetas)) {
    if (i.name === common.title && (i.artist.name === common.artist || i.artist.name === 'unknown')) {
      id = i.uuid;
      break;
    }
  }
  const port = getOption('api.port');

  return {
    uuid: id || uuid(),
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
    cover: common.picture,
    loading: false,
    local: true,
    image: [
      common.picture ? {
        '#text': `http://127.0.0.1:${port}/nuclear/file/${id}/thumb`
      } : undefined
    ]
  };
}

export async function scanFoldersAndGetMeta(directories) {
  const files = await Promise.all([
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.mp3`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.ogg`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.wav`))
  ]).then(result => result.flat());
    
  const metas = await Promise.all(files.map(parseFile));

  const formattedMetas = files.map((file, i) => formatMeta(metas[i], file));

  for (let i in formattedMetas) {
    if (!formattedMetas[i].name) {
      const [data] = await fetchAcousticId(formattedMetas[i].path);

      if (data && data.recording && data.recording.length) {
        formattedMetas[i].name = data.recordings[0].title;
        formattedMetas[i].artist.name = data.recordings[0].artists[0].name || 'unknown';
      } else {
        formattedMetas[i].name = path.basename(formattedMetas[i].path.split('.').shift());
      }
    }
  }

  return formattedMetas.reduce((acc, item) => ({
    ...acc,
    [item.uuid]: item
  }), {});

}
