import { promisify } from 'util';
import glob from 'glob';
import { parseFile } from 'music-metadata';
import slug from 'slug';
import { getOption } from '../store';

export function formatMeta({ common, format }, path) {
  const id = slug(`${common.artist} ${common.title}`);
  const port = getOption('api.port');

  return {
    id,
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

export function scanDirectories(directories) {
  return Promise.all([
    // todo simplify this .(mp3|ogg|wav)
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.mp3`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.ogg`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.wav`))
  ])
    .then(files => files.flat())
    .then(files => Promise.all([
      ...files.map(parseFile),
      Promise.resolve(files)
    ]))
    .then(meta => {
      const files = meta.pop();

      return files.map((file, i) => formatMeta(meta[i], file));
    });
}
