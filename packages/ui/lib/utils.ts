import _ from 'lodash';
import { Track } from './types';

export function formatDuration(duration, livestream?) {
  if (livestream) {
    // TODO: possibly return nothing and let the placeholder remain
    return 'LIVE';
  } else if (!_.isFinite(parseInt(duration)) || duration <= 0) {
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

export const getTrackTitle = (track: Track) => track?.name || track?.title;

export const getTrackArtist = (track: Track) => _.isString(track?.artist)
  ? track?.artist
  : track?.artist?.name;

export const getThumbnail = albumOrTrack => _.get(albumOrTrack, 'coverImage')
  || _.get(albumOrTrack, 'thumb')
  || _.get(albumOrTrack, 'thumbnail');

export const getTrackItem = (track: Track) => ({
  artist: getTrackArtist(track),
  name: getTrackTitle(track),
  thumbnail: getThumbnail(track),
  local: track.local,
  streams: track.streams,
  uuid: track.uuid
});

export const areTracksEqualByName = (trackA: Track, trackB: Track) => getTrackArtist(trackA) === getTrackArtist(trackB) && getTrackTitle(trackA) === getTrackTitle(trackB);

export const removeTrackStreamUrl = (track: Track) => {
  if (track.streams) {
    track.streams = track.streams.map(s => {
      delete s.stream;
      return s;
    });
  } else {
    track.streams = [];
  }

  return track;
};
