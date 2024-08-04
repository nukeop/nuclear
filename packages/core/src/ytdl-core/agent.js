import { ProxyAgent } from 'undici';
import { Cookie, CookieJar, canonicalDomain } from 'tough-cookie';
import { CookieAgent, CookieClient } from 'http-cookie-agent/undici';

const convertSameSite = sameSite => {
  switch (sameSite) {
  case 'strict':
    return 'strict';
  case 'lax':
    return 'lax';
  case 'no_restriction':
  case 'unspecified':
  default:
    return 'none';
  }
};

const convertCookie = cookie => cookie instanceof Cookie ? cookie : new Cookie({
  key: cookie.name,
  value: cookie.value,
  expires: typeof cookie.expirationDate === 'number' ? new Date(cookie.expirationDate * 1000) : 'Infinity',
  domain: canonicalDomain(cookie.domain),
  path: cookie.path,
  secure: cookie.secure,
  httpOnly: cookie.httpOnly,
  sameSite: convertSameSite(cookie.sameSite),
  hostOnly: cookie.hostOnly
});

export const addCookies = (jar, cookies) => {
  if (!cookies || !Array.isArray(cookies)) {
    throw new Error('cookies must be an array');
  }
  if (!cookies.some(c => c.name === 'SOCS')) {
    cookies.push({
      domain: '.youtube.com',
      hostOnly: false,
      httpOnly: false,
      name: 'SOCS',
      path: '/',
      sameSite: 'lax',
      secure: true,
      session: false,
      value: 'CAI'
    });
  }
  for (const cookie of cookies) {
    jar.setCookieSync(convertCookie(cookie), 'https://www.youtube.com');
  }
};

export const addCookiesFromString = (jar, cookies) => {
  if (!cookies || typeof cookies !== 'string') {
    throw new Error('cookies must be a string');
  }
  return addCookies(jar, cookies.split(';').map(c => Cookie.parse(c)).filter(Boolean));
};

export const createAgent = (cookies = [], opts = {}) => {
  const options = Object.assign({}, opts);
  if (!options.cookies) {
    const jar = new CookieJar();
    addCookies(jar, cookies);
    options.cookies = { jar };
  }
  return {
    dispatcher: new CookieAgent(options),
    localAddress: options.localAddress,
    jar: options.cookies.jar
  };
};

export const createProxyAgent = (options, cookies = []) => {
  if (!cookies) {
    cookies = [];
  }
  if (typeof options === 'string') {
    options = { uri: options };
  }
  if (options.factory) {
    throw new Error('Cannot use factory with createProxyAgent');
  }
  const jar = new CookieJar();
  addCookies(jar, cookies);
  const proxyOptions = Object.assign({
    factory: (origin, opts) => {
      const o = Object.assign({ cookies: { jar } }, opts);
      return new CookieClient(origin, o);
    }
  }, options);
  return { dispatcher: new ProxyAgent(proxyOptions), jar, localAddress: options.localAddress };
};

export const defaultAgent = createAgent();
