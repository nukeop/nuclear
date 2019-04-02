import { promisify } from 'util';
import glob from 'glob';
import { parseFile } from 'music-metadata';

export function formatMeta({ common }) {
  return {
    name: common.title,
    pos: common.track.no,
    album: common.album,
    genre: common.genre,
    year: common.year,
    composer: common.composer,
    cover: common.picture
  };
}

export function scanDirectories(directories) {
  return Promise.all([
    // todo simplify this .(mp3|ogg|wav)
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.mp3`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.ogg`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.wav`))
  ])
    .then(files => Promise.all(
      files.flat().map(parseFile))
    )
    .then(files => files.map(formatMeta));
}
