import _ from 'lodash';

export function formatDuration (duration) {
  let sec_num = parseInt(duration, 10);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

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

export function stringDurationToSeconds (duration) {
  if (Number.isInteger(duration)) {
    return duration;
  }
  const parts = duration.split(':');
  let minutes = 0;
  let seconds = 0;
  if (parts.length === 2) {
    minutes = parseInt(parts[0]);
    seconds = parseInt(parts[1]);
  }
  return minutes * 60 + seconds;
}

export function getSelectedStream (streams, defaultMusicSource) {
  let selectedStream = _.find(streams, { source: defaultMusicSource });

  return selectedStream === undefined
    ? streams ? streams[0] : null
    : selectedStream;
}
