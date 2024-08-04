import sax from 'sax';
import {applyDefaultAgent, applyDefaultHeaders, applyIPv6Rotations, applyOldLocalAddress, playError, requestUtil, between, cutAfterJS, tryParseBetween, saveDebugFile, setPropInsensitive, generateClientPlaybackNonce} from './utils';
import {addFormatMeta, sortFormats} from './format-utils';
// Forces Node JS version of setTimeout for Electron based applications
import { setTimeout } from 'timers';
import {getVideoID}  from './url-utils';
import * as extras from './info-extras';
import Cache from './cache';
import { URL } from 'url';


const BASE_URL = 'https://www.youtube.com/watch?v=';


// Cached for storing basic/full info.
export const cache = new Cache();
export const watchPageCache = new Cache();


// Special error class used to determine if an error is unrecoverable,
// as in, ytdl-core should not try again to fetch the video metadata.
// In this case, the video is usually unavailable in some way.
class UnrecoverableError extends Error {}


// List of URLs that show up in `notice_url` for age restricted videos.
const AGE_RESTRICTED_URLS = [
  'support.google.com/youtube/?p=age_restrictions',
  'youtube.com/t/community_guidelines'
];

/**
 * Gets info from a video without getting additional formats.
 *
 * @param {string} id
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getBasicInfo = async(id, options) => {
  applyIPv6Rotations(options);
  const retryOptions = Object.assign({}, options.requestOptions);
  applyDefaultHeaders(options);
  applyDefaultAgent(options);
  applyOldLocalAddress(options);
  const { jar, dispatcher } = options.agent;
  setPropInsensitive(
    options.requestOptions.headers, 'cookie', jar.getCookieStringSync('https://www.youtube.com')
  );
  options.requestOptions.dispatcher = dispatcher;
  const info = await retryFunc(getWatchHTMLPage, [id, options], retryOptions);

  const playErr = playError(info.player_response, ['ERROR'], UnrecoverableError);
  if (playErr) {
    throw playErr;
  }
  const privateErr = privateVideoError(info.player_response);
  if (privateErr) {
    throw privateErr;
  }


  Object.assign(info, {
    // formats: parseFormats(info.player_response),
    related_videos: extras.getRelatedVideos(info)
  });

  // Add additional properties to info.
  const media = extras.getMedia(info);
  const additional = {
    author: extras.getAuthor(info),
    media,
    likes: extras.getLikes(info),
    age_restricted: !!(media && AGE_RESTRICTED_URLS.some(url =>
      Object.values(media).some(v => typeof v === 'string' && v.includes(url)))
    ),

    // Give the standard link to the video.
    video_url: BASE_URL + id,
    storyboards: extras.getStoryboards(info),
    chapters: extras.getChapters(info)
  };

  info.videoDetails = extras.cleanVideoDetails(Object.assign({},
    info.player_response && info.player_response.microformat &&
    info.player_response.microformat.playerMicroformatRenderer,
    info.player_response && info.player_response.videoDetails, additional), info);

  return info;
};

const privateVideoError = player_response => {
  const playability = player_response && player_response.playabilityStatus;
  if (!playability) {
    return null;
  }
  if (playability.status === 'LOGIN_REQUIRED') {
    return new UnrecoverableError(playability.reason || (playability.messages && playability.messages[0]));
  }
  if (playability.status === 'LIVE_STREAM_OFFLINE') {
    return new UnrecoverableError(playability.reason || 'The live stream is offline.');
  }
  if (playability.status === 'UNPLAYABLE') {
    return new UnrecoverableError(playability.reason || 'This video is unavailable.');
  }
  return null;
};

const getWatchHTMLURL = (id, options) =>
  `${BASE_URL + id}&hl=${options.lang || 'en'}&bpctr=${Math.ceil(Date.now() / 1000)}&has_verified=1`;
const getWatchHTMLPageBody = (id, options) => {
  const url = getWatchHTMLURL(id, options);
  return watchPageCache.getOrSet(url, () => requestUtil(url, options));
};


const EMBED_URL = 'https://www.youtube.com/embed/';
const getEmbedPageBody = (id, options) => {
  const embedUrl = `${EMBED_URL + id}?hl=${options.lang || 'en'}`;
  return requestUtil(embedUrl, options);
};


const getHTML5player = body => {
  let html5playerRes =
    /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/
      .exec(body);
  return html5playerRes ? html5playerRes[1] || html5playerRes[2] : null;
};

/**
 * Given a function, calls it with `args` until it's successful,
 * or until it encounters an unrecoverable error.
 * Currently, any error from miniget is considered unrecoverable. Errors such as
 * too many redirects, invalid URL, status code 404, status code 502.
 *
 * @param {Function} func
 * @param {Array.<Object>} args
 * @param {Object} options
 * @param {number} options.maxRetries
 * @param {Object} options.backoff
 * @param {number} options.backoff.inc
 */
const retryFunc = async(func, args, options) => {
  let currentTry = 0, result;
  if (!options.maxRetries) {
    options.maxRetries = 3;
  }
  if (!options.backoff) {
    options.backoff = { inc: 500, max: 5000 };
  }
  while (currentTry <= options.maxRetries) {
    try {
      result = await func(...args);
      break;
    } catch (err) {
      if ((err && err.statusCode < 500) || currentTry >= options.maxRetries) {
        throw err;
      }
      let wait = Math.min(++currentTry * options.backoff.inc, options.backoff.max);
      await new Promise(resolve => setTimeout(resolve, wait));
    }
  }
  return result;
};


const jsonClosingChars = /^[)\]}'\s]+/;
const parseJSON = (source, varName, json) => {
  if (!json || typeof json === 'object') {
    return json;
  } else {
    try {
      json = json.replace(jsonClosingChars, '');
      return JSON.parse(json);
    } catch (err) {
      throw Error(`Error parsing ${varName} in ${source}: ${err.message}`);
    }
  }
};


const findJSON = (source, varName, body, left, right, prependJSON) => {
  let jsonStr = between(body, left, right);
  if (!jsonStr) {
    throw Error(`Could not find ${varName} in ${source}`);
  }
  return parseJSON(source, varName, cutAfterJS(`${prependJSON}${jsonStr}`));
};


const findPlayerResponse = (source, info) => {
  const player_response = info && (
    (info.args && info.args.player_response) ||
    info.player_response || info.playerResponse || info.embedded_player_response);
  return parseJSON(source, 'player_response', player_response);
};

const getWatchHTMLPage = async(id, options) => {
  let body = await getWatchHTMLPageBody(id, options);
  let info = { page: 'watch' };
  try {
    try {
      info.player_response =
        tryParseBetween(body, 'var ytInitialPlayerResponse = ', '}};', '', '}}') ||
        tryParseBetween(body, 'var ytInitialPlayerResponse = ', ';var') ||
        tryParseBetween(body, 'var ytInitialPlayerResponse = ', ';</script>') ||
        findJSON('watch.html', 'player_response', body, /\bytInitialPlayerResponse\s*=\s*\{/i, '</script>', '{');
    } catch (_e) {
      let args = findJSON('watch.html', 'player_response', body, /\bytplayer\.config\s*=\s*{/, '</script>', '{');
      info.player_response = findPlayerResponse('watch.html', args);
    }

    info.response =
      tryParseBetween(body, 'var ytInitialData = ', '}};', '', '}}') ||
      tryParseBetween(body, 'var ytInitialData = ', ';</script>') ||
      tryParseBetween(body, 'window["ytInitialData"] = ', '}};', '', '}}') ||
      tryParseBetween(body, 'window["ytInitialData"] = ', ';</script>') ||
      findJSON('watch.html', 'response', body, /\bytInitialData("\])?\s*=\s*\{/i, '</script>', '{');
    info.html5player = getHTML5player(body);
  } catch (_) {
    throw Error(
      'Error when parsing watch.html, maybe YouTube made a change.\n' +
      `Please report this issue with the "${
        saveDebugFile('watch.html', body)
      }" file on https://github.com/distubejs/ytdl-core/issues.`
    );
  }
  return info;
};

/**
 * @param {Object} player_response
 * @returns {Array.<Object>}
 */
const parseFormats = player_response => {
  let formats = [];
  if (player_response && player_response.streamingData) {
    formats = formats
      .concat(player_response.streamingData.formats || [])
      .concat(player_response.streamingData.adaptiveFormats || []);
  }
  return formats;
};


/**
 * Gets info from a video additional formats and deciphered URLs.
 *
 * @param {string} id
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getInfo = async(id, options) => {
  const info = await getBasicInfo(id, options);
  const iosPlayerResponse = await fetchIosJsonPlayer(id, options);
  info.formats = parseFormats(iosPlayerResponse);
  const hasManifest =
    iosPlayerResponse && iosPlayerResponse.streamingData && (
      iosPlayerResponse.streamingData.dashManifestUrl ||
      iosPlayerResponse.streamingData.hlsManifestUrl
    );
  let funcs = [];
  if (info.formats.length) {
    // Stream from ios player doesn't need to be deciphered.
    // info.html5player = info.html5player ||
    //   getHTML5player(await getWatchHTMLPageBody(id, options)) || getHTML5player(await getEmbedPageBody(id, options));
    // if (!info.html5player) {
    //   throw Error('Unable to find html5player file');
    // }
    // const html5player = new URL(info.html5player, BASE_URL).toString();
    // funcs.push(sig.decipherFormats(info.formats, html5player, options));
    funcs.push(info.formats);
  }
  if (hasManifest && iosPlayerResponse.streamingData.dashManifestUrl) {
    let url = iosPlayerResponse.streamingData.dashManifestUrl;
    funcs.push(getDashManifest(url, options));
  }
  if (hasManifest && iosPlayerResponse.streamingData.hlsManifestUrl) {
    let url = iosPlayerResponse.streamingData.hlsManifestUrl;
    funcs.push(getM3U8(url, options));
  }

  let results = await Promise.all(funcs);
  info.formats = Object.values(Object.assign({}, ...results));
  info.formats = info.formats.map(addFormatMeta);
  info.formats.sort(sortFormats);


  info.full = true;
  return info;
};

// TODO: Clean up this code to impliment Android player.
const IOS_CLIENT_VERSION = '19.28.1',
  IOS_DEVICE_MODEL = 'iPhone16,2',
  IOS_USER_AGENT_VERSION = '17_5_1',
  IOS_OS_VERSION = '17.5.1.21F90';

const fetchIosJsonPlayer = async(videoId, options) => {
  const cpn = generateClientPlaybackNonce(16);
  const payload = {
    videoId,
    cpn,
    contentCheckOk: true,
    racyCheckOk: true,
    context: {
      client: {
        clientName: 'IOS',
        clientVersion: IOS_CLIENT_VERSION,
        deviceMake: 'Apple',
        deviceModel: IOS_DEVICE_MODEL,
        platform: 'MOBILE',
        osName: 'iOS',
        osVersion: IOS_OS_VERSION,
        hl: 'en',
        gl: 'US',
        utcOffsetMinutes: -240
      },
      request: {
        internalExperimentFlags: [],
        useSsl: true
      },
      user: {
        lockedSafetyMode: false
      }
    }
  };

  const { jar, dispatcher } = options.agent;
  const opts = {
    requestOptions: {
      method: 'POST',
      dispatcher,
      query: {
        prettyPrint: false,
        t: generateClientPlaybackNonce(12),
        id: videoId
      },
      headers: {
        'Content-Type': 'application/json',
        cookie: jar.getCookieStringSync('https://www.youtube.com'),
        'User-Agent': `com.google.ios.youtube/${IOS_CLIENT_VERSION}(${
          IOS_DEVICE_MODEL
        }; U; CPU iOS ${IOS_USER_AGENT_VERSION} like Mac OS X; en_US)`,
        'X-Goog-Api-Format-Version': '2'
      },
      body: JSON.stringify(payload)
    }
  };
  const response = await requestUtil('https://youtubei.googleapis.com/youtubei/v1/player', opts);
  if (videoId !== response.videoDetails.videoId) {
    throw Error('Video ID mismatch');
  }
  return response;
};


/**
 * Gets additional DASH formats.
 *
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<Array.<Object>>}
 */
const getDashManifest = (url, options) => new Promise((resolve, reject) => {
  let formats = {};
  const parser = sax.parser(false);
  parser.onerror = reject;
  let adaptationSet;
  parser.onopentag = node => {
    if (node.name === 'ADAPTATIONSET') {
      adaptationSet = node.attributes;
    } else if (node.name === 'REPRESENTATION') {
      const itag = parseInt(node.attributes.ID);
      if (!isNaN(itag)) {
        formats[url] = Object.assign({
          itag,
          url,
          bitrate: parseInt(node.attributes.BANDWIDTH),
          mimeType: `${adaptationSet.MIMETYPE}; codecs="${node.attributes.CODECS}"`
        }, node.attributes.HEIGHT ? {
          width: parseInt(node.attributes.WIDTH),
          height: parseInt(node.attributes.HEIGHT),
          fps: parseInt(node.attributes.FRAMERATE)
        } : {
          audioSampleRate: node.attributes.AUDIOSAMPLINGRATE
        });
      }
    }
  };
  parser.onend = () => {
    resolve(formats);
  };
  requestUtil(new URL(url, BASE_URL).toString(), options).then(res => {
    parser.write(res);
    parser.close();
  }).catch(reject);
});


/**
 * Gets additional formats.
 *
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<Array.<Object>>}
 */
const getM3U8 = async(url, options) => {
  url = new URL(url, BASE_URL);
  const body = await requestUtil(url.toString(), options);
  let formats = {};
  body
    .split('\n')
    .filter(line => /^https?:\/\//.test(line))
    .forEach(line => {
      const itag = parseInt(line.match(/\/itag\/(\d+)\//)[1]);
      formats[line] = { itag, url: line };
    });
  return formats;
};


// // Cache get info functions.
// // In case a user wants to get a video's info before downloading.
const cachedGetBasicInfo = async (link, options = {}) => {
  let id = await getVideoID(link);
  const key = ['getBasicInfo', id, options.lang].join('-');
  return cache.getOrSet(key, () => getBasicInfo(id, options));
};

const cachedGetInfo = async (link, options = {}) => {
  let id = await getVideoID(link);
  const key = ['getInfo', id, options.lang].join('-');
  return cache.getOrSet(key, () => getInfo(id, options));
};

// Export the functions
export { cachedGetBasicInfo as getBasicInfo,  cachedGetInfo as getInfo };


// Export a few helpers.
export {validateID, validateURL, getURLVideoID, getVideoID} from './url-utils';
