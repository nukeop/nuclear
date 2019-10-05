import * as MetaProviderPlugins from './meta';
import * as StreamProviderPlugins from './stream';
import * as LyricsProviderPlugins from './lyrics';

export const config = {
  plugins: {
    metaProviders: MetaProviderPlugins,
    streamProviders: StreamProviderPlugins,
    lyricsProviders: LyricsProviderPlugins
  }
};
