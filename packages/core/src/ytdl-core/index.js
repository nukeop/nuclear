import { PassThrough } from 'stream';
import {getBasicInfo, getInfo, cache as getInfoCache, watchPageCache} from './info';
import {playError, applyDefaultHeaders, getRandomIPv6, setPropInsensitive} from './utils';
import {chooseFormat, filterFormats} from './format-utils';
import {getURLVideoID, getVideoID, validateID, validateURL} from './url-utils';
import {cache as sigCache} from './sig';
import miniget from 'miniget';
import m3u8stream, { parseTimestamp } from 'm3u8stream';
import {createAgent, createProxyAgent} from './agent';


/**
 * @param {string} link
 * @param {!Object} options
 * @returns {ReadableStream}
 */
const ytdl = (link, options) => {
  const stream = createStream(options);
  ytdl.getInfo(link, options).then(info => {
    downloadFromInfoCallback(stream, info, options);
  }, stream.emit.bind(stream, 'error'));
  return stream;
};
export default ytdl;

ytdl.getBasicInfo = getBasicInfo;
ytdl.getInfo = getInfo;
ytdl.chooseFormat = chooseFormat;
ytdl.filterFormats = filterFormats;
ytdl.validateID = validateID;
ytdl.validateURL = validateURL;
ytdl.getURLVideoID = getURLVideoID;
ytdl.getVideoID = getVideoID;
ytdl.createAgent = createAgent;
ytdl.createProxyAgent = createProxyAgent;
ytdl.cache = {
  sig: sigCache,
  info: getInfoCache,
  watch: watchPageCache
};


const createStream = options => {
  const stream = new PassThrough({
    highWaterMark: (options && options.highWaterMark) || 1024 * 512
  });
  stream._destroy = () => {
    stream.destroyed = true; 
  };
  return stream;
};


const pipeAndSetEvents = (req, stream, end) => {
  // Forward events from the request to the stream.
  [
    'abort', 'request', 'response', 'error', 'redirect', 'retry', 'reconnect'
  ].forEach(event => {
    req.prependListener(event, stream.emit.bind(stream, event));
  });
  req.pipe(stream, { end });
};


/**
 * Chooses a format to download.
 *
 * @param {stream.Readable} stream
 * @param {Object} info
 * @param {Object} options
 */
const downloadFromInfoCallback = (stream, info, options) => {
  options = options || {};

  let err = playError(info.player_response, ['UNPLAYABLE', 'LIVE_STREAM_OFFLINE', 'LOGIN_REQUIRED']);
  if (err) {
    stream.emit('error', err);
    return;
  }

  if (!info.formats.length) {
    stream.emit('error', Error('This video is unavailable'));
    return;
  }

  let format;
  try {
    format = chooseFormat(info.formats, options);
  } catch (e) {
    stream.emit('error', e);
    return;
  }
  stream.emit('info', info, format);
  if (stream.destroyed) {
    return; 
  }

  let contentLength, downloaded = 0;
  const ondata = chunk => {
    downloaded += chunk.length;
    stream.emit('progress', chunk.length, downloaded, contentLength);
  };

  applyDefaultHeaders(options);
  if (options.IPv6Block) {
    options.requestOptions = Object.assign({}, options.requestOptions, {
      localAddress: getRandomIPv6(options.IPv6Block)
    });
  }
  if (options.agent) {
    if (options.agent.jar) {
      setPropInsensitive(
        options.requestOptions.headers, 'cookie', options.agent.jar.getCookieStringSync('https://www.youtube.com')
      );
    }
    if (options.agent.localAddress) {
      options.requestOptions.localAddress = options.agent.localAddress;
    }
  }

  // Download the file in chunks, in this case the default is 10MB,
  // anything over this will cause youtube to throttle the download
  const dlChunkSize = typeof options.dlChunkSize === 'number' ? options.dlChunkSize : 1024 * 1024 * 10;
  let req;
  let shouldEnd = true;

  if (format.isHLS || format.isDashMPD) {
    req = m3u8stream(format.url, {
      chunkReadahead: +info.live_chunk_readahead,
      begin: options.begin || (format.isLive && Date.now()),
      liveBuffer: options.liveBuffer,
      requestOptions: options.requestOptions,
      parser: format.isDashMPD ? 'dash-mpd' : 'm3u8',
      id: format.itag
    });

    req.on('progress', (segment, totalSegments) => {
      stream.emit('progress', segment.size, segment.num, totalSegments);
    });
    pipeAndSetEvents(req, stream, shouldEnd);
  } else {
    const requestOptions = Object.assign({}, options.requestOptions, {
      maxReconnects: 6,
      maxRetries: 3,
      backoff: { inc: 500, max: 10000 }
    });

    let shouldBeChunked = dlChunkSize !== 0 && (!format.hasAudio || !format.hasVideo);

    if (shouldBeChunked) {
      let start = (options.range && options.range.start) || 0;
      let end = start + dlChunkSize;
      const rangeEnd = options.range && options.range.end;

      contentLength = options.range ?
        (rangeEnd ? rangeEnd + 1 : parseInt(format.contentLength)) - start :
        parseInt(format.contentLength);

      const getNextChunk = () => {
        if (stream.destroyed) {
          return;
        }
        if (!rangeEnd && end >= contentLength) {
          end = 0;
        }
        if (rangeEnd && end > rangeEnd) {
          end = rangeEnd;
        }
        shouldEnd = !end || end === rangeEnd;

        requestOptions.headers = Object.assign({}, requestOptions.headers, {
          Range: `bytes=${start}-${end || ''}`
        });
        req = miniget(format.url, requestOptions);
        req.on('data', ondata);
        req.on('end', () => {
          if (stream.destroyed) {
            return;
          }
          if (end && end !== rangeEnd) {
            start = end + 1;
            end += dlChunkSize;
            getNextChunk();
          }
        });
        pipeAndSetEvents(req, stream, shouldEnd);
      };
      getNextChunk();
    } else {
      // Audio only and video only formats don't support begin
      if (options.begin) {
        format.url += `&begin=${parseTimestamp(options.begin)}`;
      }
      if (options.range && (options.range.start || options.range.end)) {
        requestOptions.headers = Object.assign({}, requestOptions.headers, {
          Range: `bytes=${options.range.start || '0'}-${options.range.end || ''}`
        });
      }
      req = miniget(format.url, requestOptions);
      req.on('response', res => {
        if (stream.destroyed) {
          return;
        }
        contentLength = contentLength || parseInt(res.headers['content-length']);
      });
      req.on('data', ondata);
      pipeAndSetEvents(req, stream, shouldEnd);
    }
  }

  stream._destroy = () => {
    stream.destroyed = true;
    if (req) {
      req.destroy();
      req.end();
    }
  };
};


/**
 * Can be used to download video after its `info` is gotten through
 * `ytdl.getInfo()`. In case the user might want to look at the
 * `info` object before deciding to download.
 *
 * @param {Object} info
 * @param {!Object} options
 * @returns {ReadableStream}
 */
ytdl.downloadFromInfo = (info, options) => {
  const stream = createStream(options);
  if (!info.full) {
    throw Error('Cannot use `ytdl.downloadFromInfo()` when called with info from `ytdl.getBasicInfo()`');
  }
  setImmediate(() => {
    downloadFromInfoCallback(stream, info, options);
  });
  return stream;
};
