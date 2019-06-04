import { promisify } from 'util';
import glob from 'glob';
import { parseFile } from 'music-metadata';
import slug from 'slug';
import { getOption } from './store';
import fpcalc from './lib/fpcalc';
import fetchAcousticId from './lib/acousticId';

export function formatMeta({ common, format }, path) {
  const id = slug(`${common.artist} ${common.title}`);
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

export async function scanDirectories(directories) {
  const files = await Promise.all([
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.mp3`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.ogg`)),
    ...directories.map(dir => promisify(glob)(`${dir}/**/*.wav`))
  ]).then(files => files.flat());
    
  const metas = await Promise.all(files.map(parseFile));

  const formattedMetas = files.map((file, i) => formatMeta(metas[i], file));

  try {
    for (let i in formattedMetas) {
      if (!formattedMetas[i].name) {
        const [{ recordings }] = await fetchAcousticId(await promisify(fpcalc)(formattedMetas[i].path));

        formattedMetas[i].name = recordings[0].title;
        formattedMetas[i].artist.name = recordings[0].artists[0].name;
      }
    }
  } catch (err) {
    console.error(err);
  }

  return formattedMetas;

}
