import * as StreamProviderPlugins from './stream/';
import * as LyricsProviderPlugins from './lyrics';

export const config = {
  plugins: {
    streamProviders: StreamProviderPlugins,
    lyricsProviders: LyricsProviderPlugins
  }
};
