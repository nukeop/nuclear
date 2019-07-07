import { promisify } from 'util';
import glob from 'glob';
import path from 'path';
import { parseFile } from 'music-metadata';
import uuid from 'uuid/v4';

import fetchAcousticId from './lib/acousticId';

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

export async function scanFoldersAndGetMeta(directories, cache = {}) {
  const baseFiles = await Promise.all([
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.mp3`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.ogg`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.wav`))
  ]).then(result => result.flat());

  const files = baseFiles.filter(
    file =>
      !Object.values(cache)
        .map(({ path }) => path)
        .includes(file)
  );

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
