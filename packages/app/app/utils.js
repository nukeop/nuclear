import _ from 'lodash';

export function formatDuration(duration) {
  let secNum = parseInt(duration, 10);
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - (hours * 3600)) / 60);
  let seconds = secNum - (hours * 3600) - (minutes * 60);

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

export function stringDurationToSeconds(duration) {
  if (duration.length > 0) {
    const parts = duration.split(':');
    if (parts.length === 2) {
      parts.unshift(0);
    }
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

export function getSelectedStream(streams, defaultMusicSource) {
  let selectedStream = _.find(streams, { source: defaultMusicSource });

  return typeof selectedStream === 'undefined'
    ? streams ? streams[0] : null
    : selectedStream;
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
