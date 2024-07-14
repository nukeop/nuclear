import {between} from './utils';
import FORMATS from './formats';


// Use these to help sort formats, higher index is better.
const audioEncodingRanks = [
  'mp4a',
  'mp3',
  'vorbis',
  'aac',
  'opus',
  'flac'
];
const videoEncodingRanks = [
  'mp4v',
  'avc1',
  'Sorenson H.283',
  'MPEG-4 Visual',
  'VP8',
  'VP9',
  'H.264'
];

const getVideoBitrate = format => format.bitrate || 0;
const getVideoEncodingRank = format =>
  videoEncodingRanks.findIndex(enc => format.codecs && format.codecs.includes(enc));
const getAudioBitrate = format => format.audioBitrate || 0;
const getAudioEncodingRank = format =>
  audioEncodingRanks.findIndex(enc => format.codecs && format.codecs.includes(enc));


/**
 * Sort formats by a list of functions.
 *
 * @param {Object} a
 * @param {Object} b
 * @param {Array.<Function>} sortBy
 * @returns {number}
 */
const sortFormatsBy = (a, b, sortBy) => {
  let res = 0;
  for (let fn of sortBy) {
    res = fn(b) - fn(a);
    if (res !== 0) {
      break;
    }
  }
  return res;
};


const sortFormatsByVideo = (a, b) => sortFormatsBy(a, b, [
  format => parseInt(format.qualityLabel),
  getVideoBitrate,
  getVideoEncodingRank
]);


const sortFormatsByAudio = (a, b) => sortFormatsBy(a, b, [
  getAudioBitrate,
  getAudioEncodingRank
]);


/**
 * Sort formats from highest quality to lowest.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
export const sortFormats = (a, b) => sortFormatsBy(a, b, [
  // Formats with both video and audio are ranked highest.
  format => +!!format.isHLS,
  format => +!!format.isDashMPD,
  format => +(format.contentLength > 0),
  format => +(format.hasVideo && format.hasAudio),
  format => +format.hasVideo,
  format => parseInt(format.qualityLabel) || 0,
  getVideoBitrate,
  getAudioBitrate,
  getVideoEncodingRank,
  getAudioEncodingRank
]);


/**
 * Choose a format depending on the given options.
 *
 * @param {Array.<Object>} formats
 * @param {Object} options
 * @returns {Object}
 * @throws {Error} when no format matches the filter/format rules
 */
export const chooseFormat = (formats, options) => {
  if (typeof options.format === 'object') {
    if (!options.format.url) {
      throw Error('Invalid format given, did you use `ytdl.getInfo()`?');
    }
    return options.format;
  }

  if (options.filter) {
    formats = filterFormats(formats, options.filter);
  }

  // We currently only support HLS-Formats for livestreams
  // So we (now) remove all non-HLS streams
  if (formats.some(fmt => fmt.isHLS)) {
    formats = formats.filter(fmt => fmt.isHLS || !fmt.isLive);
  }

  let format;
  const quality = options.quality || 'highest';
  switch (quality) {
  case 'highest':
    format = formats[0];
    break;

  case 'lowest':
    format = formats[formats.length - 1];
    break;

  case 'highestaudio': {
    formats = filterFormats(formats, 'audio');
    formats.sort(sortFormatsByAudio);
    // Filter for only the best audio format
    const bestAudioFormat = formats[0];
    formats = formats.filter(f => sortFormatsByAudio(bestAudioFormat, f) === 0);
    // Check for the worst video quality for the best audio quality and pick according
    // This does not loose default sorting of video encoding and bitrate
    const worstVideoQuality = formats.map(f => parseInt(f.qualityLabel) || 0).sort((a, b) => a - b)[0];
    format = formats.find(f => (parseInt(f.qualityLabel) || 0) === worstVideoQuality);
    break;
  }

  case 'lowestaudio':
    formats = filterFormats(formats, 'audio');
    formats.sort(sortFormatsByAudio);
    format = formats[formats.length - 1];
    break;

  case 'highestvideo': {
    formats = filterFormats(formats, 'video');
    formats.sort(sortFormatsByVideo);
    // Filter for only the best video format
    const bestVideoFormat = formats[0];
    formats = formats.filter(f => sortFormatsByVideo(bestVideoFormat, f) === 0);
    // Check for the worst audio quality for the best video quality and pick according
    // This does not loose default sorting of audio encoding and bitrate
    const worstAudioQuality = formats.map(f => f.audioBitrate || 0).sort((a, b) => a - b)[0];
    format = formats.find(f => (f.audioBitrate || 0) === worstAudioQuality);
    break;
  }

  case 'lowestvideo':
    formats = filterFormats(formats, 'video');
    formats.sort(sortFormatsByVideo);
    format = formats[formats.length - 1];
    break;

  default:
    format = getFormatByQuality(quality, formats);
    break;
  }

  if (!format) {
    throw Error(`No such format found: ${quality}`);
  }
  return format;
};

/**
 * Gets a format based on quality or array of quality's
 *
 * @param {string|[string]} quality
 * @param {[Object]} formats
 * @returns {Object}
 */
const getFormatByQuality = (quality, formats) => {
  let getFormat = itag => formats.find(format => `${format.itag}` === `${itag}`);
  if (Array.isArray(quality)) {
    return getFormat(quality.find(q => getFormat(q)));
  } else {
    return getFormat(quality);
  }
};


/**
 * @param {Array.<Object>} formats
 * @param {Function} filter
 * @returns {Array.<Object>}
 */
export const filterFormats = (formats, filter) => {
  let fn;
  switch (filter) {
  case 'videoandaudio':
  case 'audioandvideo':
    fn = format => format.hasVideo && format.hasAudio;
    break;

  case 'video':
    fn = format => format.hasVideo;
    break;

  case 'videoonly':
    fn = format => format.hasVideo && !format.hasAudio;
    break;

  case 'audio':
    fn = format => format.hasAudio;
    break;

  case 'audioonly':
    fn = format => !format.hasVideo && format.hasAudio;
    break;

  default:
    if (typeof filter === 'function') {
      fn = filter;
    } else {
      throw TypeError(`Given filter (${filter}) is not supported`);
    }
  }
  return formats.filter(format => !!format.url && fn(format));
};


/**
 * @param {Object} format
 * @returns {Object}
 */
export const addFormatMeta = format => {
  format = Object.assign({}, FORMATS[format.itag], format);
  format.hasVideo = !!format.qualityLabel;
  format.hasAudio = !!format.audioBitrate;
  format.container = format.mimeType ?
    format.mimeType.split(';')[0].split('/')[1] : null;
  format.codecs = format.mimeType ?
    between(format.mimeType, 'codecs="', '"') : null;
  format.videoCodec = format.hasVideo && format.codecs ?
    format.codecs.split(', ')[0] : null;
  format.audioCodec = format.hasAudio && format.codecs ?
    format.codecs.split(', ').slice(-1)[0] : null;
  format.isLive = /\bsource[/=]yt_live_broadcast\b/.test(format.url);
  format.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
  format.isDashMPD = /\/manifest\/dash\//.test(format.url);
  return format;
};
