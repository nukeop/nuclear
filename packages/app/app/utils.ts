import _ from 'lodash';

export function formatDuration(duration) {
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

  if (String(hours) === '00') {
    return minutes + ':' + seconds;
  } else {
    return hours + ':' + minutes + ':' + seconds;
  }
}

export function stringDurationToSeconds(duration) {
  if (duration.length > 0) {
    const parts = duration.split(':');
    if (parts.length === 2) {
      parts.unshift(0);
    }
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  return 0;
}

export function getTrackDuration(track, selectedStreamProvider) {
  const trackStreams = _.get(track, 'streams');
  const selectedStream = _.find(trackStreams, { source: selectedStreamProvider });
  const localStream = _.find(trackStreams, { source: 'Local' });

  return _.isNil(localStream)
    ? _.get(selectedStream, 'duration')
    : _.get(localStream, 'duration');
}

export function removeQuotes(text) {
  return String(text).replace(/[“”]/g, '');
}

export function createLastFMLink(artist, track) {
  if (!artist) {
    throw Error('"createLastFMLink" function requires at least "artist" argument');
  }

  const encodedArtist = artist.split(' ').map(encodeURIComponent).join('+');
  const encodedTrack = track ? track.split(' ').map(encodeURIComponent).join('+') : null;
  const linkSuffix = encodedTrack ? `${encodedArtist}/_/${encodedTrack}` : encodedArtist;

  return `https://www.last.fm/music/${linkSuffix}`;
}

export function normalizeTrack(track){
  return {
    artist: {
      name: track.artist
    },
    name: track.name,
    image: [
      {
        '#text': track.thumbnail
      }
    ]
  };
}
