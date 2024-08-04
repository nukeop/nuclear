import {request} from 'undici';
import { writeFileSync } from 'fs';
import {defaultAgent, createAgent, addCookiesFromString} from './agent';


/**
 * Extract string inbetween another.
 *
 * @param {string} haystack
 * @param {string} left
 * @param {string} right
 * @returns {string}
 */
export const between = (haystack, left, right) => {
  let pos;
  if (left instanceof RegExp) {
    const match = haystack.match(left);
    if (!match) {
      return ''; 
    }
    pos = match.index + match[0].length;
  } else {
    pos = haystack.indexOf(left);
    if (pos === -1) {
      return ''; 
    }
    pos += left.length;
  }
  haystack = haystack.slice(pos);
  pos = haystack.indexOf(right);
  if (pos === -1) {
    return ''; 
  }
  haystack = haystack.slice(0, pos);
  return haystack;
};

export const tryParseBetween = (body, left, right, prepend = '', append = '') => {
  try {
    let data = between(body, left, right);
    if (!data) {
      return null;
    }
    return JSON.parse(`${prepend}${data}${append}`);
  } catch (e) {
    return null;
  }
};

/**
 * Get a number from an abbreviated number string.
 *
 * @param {string} string
 * @returns {number}
 */
export const parseAbbreviatedNumber = string => {
  const match = string
    .replace(',', '.')
    .replace(' ', '')
    .match(/([\d,.]+)([MK]?)/);
  if (match) {
    let [, num, multi] = match;
    num = parseFloat(num);
    return Math.round(multi === 'M' ? num * 1000000 :
      multi === 'K' ? num * 1000 : num);
  }
  return null;
};

/**
 * Escape sequences for cutAfterJS
 * @param {string} start the character string the escape sequence
 * @param {string} end the character string to stop the escape seequence
 * @param {undefined|Regex} startPrefix a regex to check against the preceding 10 characters
 */
const ESCAPING_SEQUENZES = [
  // Strings
  { start: '"', end: '"' },
  { start: '\'', end: '\'' },
  { start: '`', end: '`' },
  // RegeEx
  { start: '/', end: '/', startPrefix: /(^|[[{:;,/])\s?$/ }
];

/**
 * Match begin and end braces of input JS, return only JS
 *
 * @param {string} mixedJson
 * @returns {string}
*/
export const cutAfterJS = mixedJson => {
  // Define the general open and closing tag
  let open, close;
  if (mixedJson[0] === '[') {
    open = '[';
    close = ']';
  } else if (mixedJson[0] === '{') {
    open = '{';
    close = '}';
  }

  if (!open) {
    throw new Error(`Can't cut unsupported JSON (need to begin with [ or { ) but got: ${mixedJson[0]}`);
  }

  // States if the loop is currently inside an escaped js object
  let isEscapedObject = null;

  // States if the current character is treated as escaped or not
  let isEscaped = false;

  // Current open brackets to be closed
  let counter = 0;

  let i;
  // Go through all characters from the start
  for (i = 0; i < mixedJson.length; i++) {
    // End of current escaped object
    if (!isEscaped && isEscapedObject !== null && mixedJson[i] === isEscapedObject.end) {
      isEscapedObject = null;
      continue;
    // Might be the start of a new escaped object
    } else if (!isEscaped && isEscapedObject === null) {
      for (const escaped of ESCAPING_SEQUENZES) {
        if (mixedJson[i] !== escaped.start) {
          continue;
        }
        // Test startPrefix against last 10 characters
        if (!escaped.startPrefix || mixedJson.substring(i - 10, i).match(escaped.startPrefix)) {
          isEscapedObject = escaped;
          break;
        }
      }
      // Continue if we found a new escaped object
      if (isEscapedObject !== null) {
        continue;
      }
    }

    // Toggle the isEscaped boolean for every backslash
    // Reset for every regular character
    isEscaped = mixedJson[i] === '\\' && !isEscaped;

    if (isEscapedObject !== null) {
      continue;
    }

    if (mixedJson[i] === open) {
      counter++;
    } else if (mixedJson[i] === close) {
      counter--;
    }

    // All brackets have been closed, thus end of JSON is reached
    if (counter === 0) {
      // Return the cut JSON
      return mixedJson.substring(0, i + 1);
    }
  }

  // We ran through the whole string and ended up with an unclosed bracket
  throw Error('Can\'t cut unsupported JSON (no matching closing bracket found)');
};

/**
 * Checks if there is a playability error.
 *
 * @param {Object} player_response
 * @param {Array.<string>} statuses
 * @param {Error} ErrorType
 * @returns {!Error}
 */
export const playError = (player_response, statuses, ErrorType = Error) => {
  let playability = player_response && player_response.playabilityStatus;
  if (playability && statuses.includes(playability.status)) {
    return new ErrorType(playability.reason || (playability.messages && playability.messages[0]));
  }
  return null;
};

// Undici request
export const requestUtil = async(url, options = {}) => {
  const { requestOptions } = options;
  const req = await request(url, requestOptions);
  const code = req.statusCode.toString();
  if (code.startsWith('2')) {
    if (req.headers['content-type'].includes('application/json')) {
      return req.body.json();
    }
    return req.body.text();
  }
  if (code.startsWith('3')) {
    return requestUtil(req.headers.location, options);
  }
  const e = new Error(`Status code: ${code}`);
  e.statusCode = req.statusCode;
  throw e;
};

/**
 * Temporary helper to help deprecating a few properties.
 *
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} value
 * @param {string} oldPath
 * @param {string} newPath
 */
export const deprecate = (obj, prop, value, oldPath, newPath) => {
  Object.defineProperty(obj, prop, {
    get: () => {
      console.warn(`\`${oldPath}\` will be removed in a near future release, ` +
        `use \`${newPath}\` instead.`);
      return value;
    }
  });
};

/**
 * Gets random IPv6 Address from a block
 *
 * @param {string} ip the IPv6 block in CIDR-Notation
 * @returns {string}
 */
export const getRandomIPv6 = ip => {
  // Start with a fast Regex-Check
  if (!isIPv6(ip)) {
    throw Error('Invalid IPv6 format');
  }
  // Start by splitting and normalizing addr and mask
  const [rawAddr, rawMask] = ip.split('/');
  let base10Mask = parseInt(rawMask);
  if (!base10Mask || base10Mask > 128 || base10Mask < 24) {
    throw Error('Invalid IPv6 subnet');
  }
  const base10addr = normalizeIP(rawAddr);
  // Get random addr to pad with
  // using Math.random since we're not requiring high level of randomness
  const randomAddr = new Array(8).fill(1).map(() => Math.floor(Math.random() * 0xffff));

  // Merge base10addr with randomAddr
  const mergedAddr = randomAddr.map((randomItem, idx) => {
    // Calculate the amount of static bits
    const staticBits = Math.min(base10Mask, 16);
    // Adjust the bitmask with the staticBits
    base10Mask -= staticBits;
    // Calculate the bitmask
    // lsb makes the calculation way more complicated
    const mask = 0xffff - ((2 ** (16 - staticBits)) - 1);
    // Combine base10addr and random
    return (base10addr[idx] & mask) + (randomItem & (mask ^ 0xffff));
  });
  // Return new addr
  return mergedAddr.map(x => x.toString('16')).join(':');
};

// eslint-disable-next-line max-len
const IPV6_REGEX = /^(([0-9a-f]{1,4}:)(:[0-9a-f]{1,4}){1,6}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,6}(:[0-9a-f]{1,4})|([0-9a-f]{1,4}:){1,7}(([0-9a-f]{1,4})|:))\/(1[0-1]\d|12[0-8]|\d{1,2})$/;
/**
 * Quick check for a valid IPv6
 * The Regex only accepts a subset of all IPv6 Addresses
 *
 * @param {string} ip the IPv6 block in CIDR-Notation to test
 * @returns {boolean} true if valid
 */
export const isIPv6 = ip => IPV6_REGEX.test(ip);

/**
 * Normalise an IP Address
 *
 * @param {string} ip the IPv6 Addr
 * @returns {number[]} the 8 parts of the IPv6 as Integers
 */
export const normalizeIP = ip => {
  // Split by fill position
  const parts = ip.split('::').map(x => x.split(':'));
  // Normalize start and end
  const partStart = parts[0] || [];
  const partEnd = parts[1] || [];
  partEnd.reverse();
  // Placeholder for full ip
  const fullIP = new Array(8).fill(0);
  // Fill in start and end parts
  for (let i = 0; i < Math.min(partStart.length, 8); i++) {
    fullIP[i] = parseInt(partStart[i], 16) || 0;
  }
  for (let i = 0; i < Math.min(partEnd.length, 8); i++) {
    fullIP[7 - i] = parseInt(partEnd[i], 16) || 0;
  }
  return fullIP;
};

export const saveDebugFile = (name, body) => {
  const filename = `${+new Date()}-${name}`;
  writeFileSync(filename, body);
  return filename;
};

const findPropKeyInsensitive = (obj, prop) =>
  Object.keys(obj).find(p => p.toLowerCase() === prop.toLowerCase()) || null;

export const getPropInsensitive = (obj, prop) => {
  const key = findPropKeyInsensitive(obj, prop);
  return key && obj[key];
};

export const setPropInsensitive = (obj, prop, value) => {
  const key = findPropKeyInsensitive(obj, prop);
  obj[key || prop] = value;
  return key;
};

let oldCookieWarning = true;
let oldDispatcherWarning = true;
export const applyDefaultAgent = options => {
  if (!options.agent) {
    const { jar } = defaultAgent;
    const c = getPropInsensitive(options.requestOptions.headers, 'cookie');
    if (c) {
      jar.removeAllCookiesSync();
      addCookiesFromString(jar, c);
      if (oldCookieWarning) {
        oldCookieWarning = false;
        console.warn(
          '\x1b[33mWARNING:\x1B[0m Using old cookie format, ' +
          'please use the new one instead. (https://github.com/distubejs/ytdl-core#cookies-support)'
        );
      }
    }
    if (options.requestOptions.dispatcher && oldDispatcherWarning) {
      oldDispatcherWarning = false;
      console.warn(
        '\x1b[33mWARNING:\x1B[0m Your dispatcher is overridden by `ytdl.Agent`. ' +
        'To implement your own, check out the documentation. ' +
        '(https://github.com/distubejs/ytdl-core#how-to-implement-ytdlagent-with-your-own-dispatcher)'
      );
    }
    options.agent = defaultAgent;
  }
};

let oldLocalAddressWarning = true;
export const applyOldLocalAddress = options => {
  if (
    !options.requestOptions ||
    !options.requestOptions.localAddress ||
    options.requestOptions.localAddress === options.agent.localAddress
  ) {
    return;
  }
  options.agent = createAgent(undefined, { localAddress: options.requestOptions.localAddress });
  if (oldLocalAddressWarning) {
    oldLocalAddressWarning = false;
    console.warn(
      '\x1b[33mWARNING:\x1B[0m Using old localAddress option, ' +
      'please add it to the agent options instead. (https://github.com/distubejs/ytdl-core#ip-rotation)'
    );
  }
};

let oldIpRotationsWarning = true;
export const applyIPv6Rotations = options => {
  if (options.IPv6Block) {
    options.requestOptions = Object.assign({}, options.requestOptions, {
      localAddress: getRandomIPv6(options.IPv6Block)
    });
    if (oldIpRotationsWarning) {
      oldIpRotationsWarning = false;
      oldLocalAddressWarning = false;
      console.warn(
        '\x1b[33mWARNING:\x1B[0m IPv6Block option is deprecated, ' +
        'please create your own ip rotation instead. (https://github.com/distubejs/ytdl-core#ip-rotation)'
      );
    }
  }
};

export const applyDefaultHeaders = options => {
  options.requestOptions = Object.assign({}, options.requestOptions);
  options.requestOptions.headers = Object.assign({}, {
    // eslint-disable-next-line max-len
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
  }, options.requestOptions.headers);
};

export const generateClientPlaybackNonce = length => {
  const CPN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  return Array.from({ length }, () => CPN_CHARS[Math.floor(Math.random() * CPN_CHARS.length)]).join('');
};
