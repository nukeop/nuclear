import 'isomorphic-fetch';

export * from './settings';
export * from './interfaces';
export { isElectron } from './util';
export { transformSource, transformPluginFile } from './plugins/transform';

export { default as Plugin } from './plugins/plugin';
export { default as LyricsProvider } from './plugins/lyricsProvider';
export { default as MetaProvider } from './plugins/metaProvider';
export { default as StreamProvider } from './plugins/streamProvider';
export { config as PluginConfig } from './plugins/config';
export { default as createApi } from './plugins/api';
export * from './persistence/store';

import * as mpris from './mpris';
export { mpris };

import * as rest from './rest';
export { rest };