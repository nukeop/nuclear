import querystring from 'querystring';
import Cache from './cache';
import {requestUtil, saveDebugFile} from './utils';
import vm from 'vm';
import { URL } from 'url';

// A shared cache to keep track of html5player js functions.
export const cache = new Cache(1);

/**
 * Extract signature deciphering and n parameter transform functions from html5player file.
 *
 * @param {string} html5playerfile
 * @param {Object} options
 * @returns {Promise<Array.<string>>}
 */
export const getFunctions = (html5playerfile, options) => cache.getOrSet(html5playerfile, async() => {
  const body = await requestUtil(html5playerfile, options);
  const functions = extractFunctions(body);
  cache.set(html5playerfile, functions);
  return functions;
});

// NewPipeExtractor regexps
const DECIPHER_NAME_REGEXPS = [
  '\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)',
  '\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)',
  // eslint-disable-next-line max-len
  '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)',
  '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;'
];

const SCVR = '[a-zA-Z0-9$_]';
const FNR = `${SCVR}+`;
const AAR = '\\[(\\d+)]';
const N_TRANSFORM_NAME_REGEXPS = [
  // NewPipeExtractor regexps
  `${SCVR}+="nn"\\[\\+${
    SCVR}+\\.${SCVR}+],${
    SCVR}+=${SCVR
  }+\\.get\\(${SCVR}+\\)\\)&&\\(${
    SCVR}+=(${SCVR
  }+)\\[(\\d+)]`,
  `${SCVR}+="nn"\\[\\+${
    SCVR}+\\.${SCVR}+],${
    SCVR}+=${SCVR}+\\.get\\(${
    SCVR}+\\)\\).+\\|\\|(${SCVR
  }+)\\(""\\)`,
  `\\(${SCVR}=String\\.fromCharCode\\(110\\),${
    SCVR}=${SCVR}\\.get\\(${
    SCVR}\\)\\)&&\\(${SCVR
  }=(${FNR})(?:${AAR})?\\(${
    SCVR}\\)`,
  `\\.get\\("n"\\)\\)&&\\(${SCVR
  }=(${FNR})(?:${AAR})?\\(${
    SCVR}\\)`,
  // Skick regexps
  '(\\w+).length\\|\\|\\w+\\(""\\)',
  '\\w+.length\\|\\|(\\w+)\\(""\\)'
];

// LavaPlayer regexps
const VARIABLE_PART = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
const VARIABLE_PART_DEFINE = `\\"?${VARIABLE_PART}\\"?`;
const BEFORE_ACCESS = '(?:\\[\\"|\\.)';
const AFTER_ACCESS = '(?:\\"\\]|)';
const VARIABLE_PART_ACCESS = BEFORE_ACCESS + VARIABLE_PART + AFTER_ACCESS;
const REVERSE_PART = ':function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}';
const SLICE_PART = ':function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}';
const SPLICE_PART = ':function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}';
const SWAP_PART = ':function\\(a,b\\)\\{' +
      'var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}';

const DECIPHER_REGEXP = `function(?: ${VARIABLE_PART})?\\(a\\)\\{` +
  'a=a\\.split\\(""\\);\\s*' +
  `((?:(?:a=)?${VARIABLE_PART}${VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)` +
  'return a\\.join\\(""\\)' +
  '\\}';

const HELPER_REGEXP = `var (${VARIABLE_PART})=\\{((?:(?:${
  VARIABLE_PART_DEFINE}${REVERSE_PART}|${
  VARIABLE_PART_DEFINE}${SLICE_PART}|${
  VARIABLE_PART_DEFINE}${SPLICE_PART}|${
  VARIABLE_PART_DEFINE}${SWAP_PART}),?\\n?)+)\\};`;

const N_TRANSFORM_REGEXP = 'function\\(\\s*(\\w+)\\s*\\)\\s*\\{' +
  'var\\s*(\\w+)=(?:\\1\\.split\\(""\\)|String\\.prototype\\.split\\.call\\(\\1,""\\)),' +
  '\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+]' +
  '(.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\' +
  '{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}' +
  '\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';

const DECIPHER_ARGUMENT = 'sig';
const N_ARGUMENT = 'ncode';

const matchRegex = (regex, str) => {
  const match = str.match(new RegExp(regex, 's'));
  if (!match) {
    throw new Error(`Could not match ${regex}`);
  }
  return match;
};

const matchFirst = (regex, str) => matchRegex(regex, str)[0];

const matchGroup1 = (regex, str) => matchRegex(regex, str)[1];

const getFuncName = (body, regexps) => {
  let fn;
  for (const regex of regexps) {
    try {
      fn = matchGroup1(regex, body);
      try {
        fn = matchGroup1(`${fn.replace(/\$/g, '\\$')}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`, body);
      } catch (err) {
        // Function name is not inside an array
      }
      break;
    } catch (err) {
      continue;
    }
  }
  if (!fn || fn.includes('[')) {
    throw Error();
  }
  return fn;
};

const DECIPHER_FUNC_NAME = 'DisTubeDecipherFunc';
const extractDecipherFunc = body => {
  try {
    const helperObject = matchFirst(HELPER_REGEXP, body);
    const decipherFunc = matchFirst(DECIPHER_REGEXP, body);
    const resultFunc = `var ${DECIPHER_FUNC_NAME}=${decipherFunc};`;
    const callerFunc = `${DECIPHER_FUNC_NAME}(${DECIPHER_ARGUMENT});`;
    return helperObject + resultFunc + callerFunc;
  } catch (e) {
    return null;
  }
};

const extractDecipherWithName = body => {
  try {
    const decipherFuncName = getFuncName(body, DECIPHER_NAME_REGEXPS);
    const funcPattern = `(${decipherFuncName.replace(/\$/g, '\\$')}=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`;
    const decipherFunc = `var ${matchGroup1(funcPattern, body)};`;
    const helperObjectName = matchGroup1(';([A-Za-z0-9_\\$]{2,})\\.\\w+\\(', decipherFunc);
    const helperPattern = `(var ${helperObjectName.replace(/\$/g, '\\$')}=\\{[\\s\\S]+?\\}\\};)`;
    const helperObject = matchGroup1(helperPattern, body);
    const callerFunc = `${decipherFuncName}(${DECIPHER_ARGUMENT});`;
    return helperObject + decipherFunc + callerFunc;
  } catch (e) {
    return null;
  }
};

const getExtractFunctions = (extractFunctions, body) => {
  for (const extractFunction of extractFunctions) {
    try {
      const func = extractFunction(body);
      if (!func) {
        continue;
      }
      return new vm.Script(func);
    } catch (err) {
      continue;
    }
  }
  return null;
};

let decipherWarning = false;
// This is required function to get the stream url, but we can continue if user doesn't need stream url.
const extractDecipher = body => {
  // Faster: extractDecipherWithName
  const decipherFunc = getExtractFunctions([extractDecipherWithName, extractDecipherFunc], body);
  if (!decipherFunc && !decipherWarning) {
    console.warn('\x1b[33mWARNING:\x1B[0m Could not parse decipher function.\n' +
      `Please report this issue with the "${
        saveDebugFile('base.js', body)
      }" file on https://github.com/distubejs/ytdl-core/issues.\nStream URL will be missing.`);
    decipherWarning = true;
  }
  return decipherFunc;
};

const N_TRANSFORM_FUNC_NAME = 'DisTubeNTransformFunc';
const extractNTransformFunc = body => {
  try {
    const nFunc = matchFirst(N_TRANSFORM_REGEXP, body);
    const resultFunc = `var ${N_TRANSFORM_FUNC_NAME}=${nFunc}`;
    const callerFunc = `${N_TRANSFORM_FUNC_NAME}(${N_ARGUMENT});`;
    return resultFunc + callerFunc;
  } catch (e) {
    return null;
  }
};

const extractNTransformWithName = body => {
  try {
    const nFuncName = getFuncName(body, N_TRANSFORM_NAME_REGEXPS);
    const funcPattern = `(${
      nFuncName.replace(/\$/g, '\\$')
    // eslint-disable-next-line max-len
    }=\\s*function([\\S\\s]*?\\}\\s*return (([\\w$]+?\\.join\\(""\\))|(Array\\.prototype\\.join\\.call\\([\\w$]+?,[\\n\\s]*(("")|(\\("",""\\)))\\)))\\s*\\}))`;
    const nTransformFunc = `var ${matchGroup1(funcPattern, body)};`;
    const callerFunc = `${nFuncName}(${N_ARGUMENT});`;
    return nTransformFunc + callerFunc;
  } catch (e) {
    return null;
  }
};

let nTransformWarning = false;
const extractNTransform = body => {
  // Faster: extractNTransformFunc
  const nTransformFunc = getExtractFunctions([extractNTransformFunc, extractNTransformWithName], body);
  if (!nTransformFunc && !nTransformWarning) {
    // This is optional, so we can continue if it's not found, but it will bottleneck the download.
    console.warn('\x1b[33mWARNING:\x1B[0m Could not parse n transform function.\n' +
      `Please report this issue with the "${
        saveDebugFile('base.js', body)
      }" file on https://github.com/distubejs/ytdl-core/issues.`);
    nTransformWarning = true;
  }
  return nTransformFunc;
};

/**
 * Extracts the actions that should be taken to decipher a signature
 * and transform the n parameter
 *
 * @param {string} body
 * @returns {Array.<string>}
 */
export const extractFunctions = body => [
  extractDecipher(body),
  extractNTransform(body)
];

/**
 * Apply decipher and n-transform to individual format
 *
 * @param {Object} format
 * @param {vm.Script} decipherScript
 * @param {vm.Script} nTransformScript
 */
export const setDownloadURL = (format, decipherScript, nTransformScript) => {
  if (!decipherScript) {
    return;
  }
  const decipher = url => {
    const args = querystring.parse(url);
    if (!args.s) {
      return args.url;
    }
    const components = new URL(decodeURIComponent(args.url));
    const context = {};
    context[DECIPHER_ARGUMENT] = decodeURIComponent(args.s);
    components.searchParams.set(args.sp || 'sig', decipherScript.runInNewContext(context));
    return components.toString();
  };
  const nTransform = url => {
    const components = new URL(decodeURIComponent(url));
    const n = components.searchParams.get('n');
    if (!n || !nTransformScript) {
      return url;
    }
    const context = {};
    context[N_ARGUMENT] = n;
    components.searchParams.set('n', nTransformScript.runInNewContext(context));
    return components.toString();
  };
  const cipher = !format.url;
  const url = format.url || format.signatureCipher || format.cipher;
  format.url = nTransform(cipher ? decipher(url) : url);
  delete format.signatureCipher;
  delete format.cipher;
};

/**
 * Applies decipher and n parameter transforms to all format URL's.
 *
 * @param {Array.<Object>} formats
 * @param {string} html5player
 * @param {Object} options
 */
export const decipherFormats = async(formats, html5player, options) => {
  const decipheredFormats = {};
  const [decipherScript, nTransformScript] = await getFunctions(html5player, options);
  formats.forEach(format => {
    setDownloadURL(format, decipherScript, nTransformScript);
    decipheredFormats[format.url] = format;
  });
  return decipheredFormats;
};
