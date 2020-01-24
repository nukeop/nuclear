import 'isomorphic-fetch';

export * from './settings';
export * from './interfaces';
export { default as LastFmApi } from './rest/lastfm';
export { isElectron } from './util';
export { transformSource, transformPluginFile } from './plugins/transform';

export { default as Plugin } from './plugins/plugin';
export { default as MetaProvider } from './plugins/metaProvider';