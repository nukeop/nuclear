import Plugin from './plugin';
import {
  StreamQuery,
  StreamData
} from './plugins.types';

abstract class StreamProviderPlugin extends Plugin {
  sourceName: string;
  apiEndpoint?: string;
  baseUrl?: string;

  abstract search(query: StreamQuery): Promise<StreamData|undefined>;
  abstract getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData|undefined>;
  abstract getStreamForId(id: string): Promise<StreamData|undefined>;
}

export default StreamProviderPlugin;
