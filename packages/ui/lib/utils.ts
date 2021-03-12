import _ from 'lodash';

export function formatDuration(duration) {
  if (!_.isFinite(parseInt(duration)) || duration <= 0) {
    return '00:00';
  }

  const secNum = parseInt(duration, 10);
  let hours: number | string = Math.floor(secNum / 3600);
  let minutes: number | string = Math.floor((secNum - (hours * 3600)) / 60);
  let seconds: number | string = secNum - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  if (hours === '00') {
    return minutes + ':' + seconds;
  } else {
    return hours + ':' + minutes + ':' + seconds;
  }
}

export const getThumbnail = album => {
  return _.get(album, 'coverImage',
    _.get(album, 'thumb'));
};

type Track = {
  name?: string;
  artist: string | { name: string };
  local?: boolean;
  streams: any[];
  album?: string;
}

export const getTrackTitle = (track: Track) => track?.name;

export const getTrackArtist = (track: Track) => _.isString(track?.artist)
  ? track?.artist
  : track?.artist?.name;

export const getTrackItem = track => ({
  artist: getTrackArtist(track),
  name: getTrackTitle(track),
  thumbnail: getThumbnail(track),
  local: track.local,
  streams: track.streams, 
  album: track.album
});
