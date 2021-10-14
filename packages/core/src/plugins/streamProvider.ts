import Plugin from './plugin';
import {
  StreamQuery,
  StreamData
} from './plugins.types';

abstract class StreamProviderPlugin extends Plugin {
  sourceName: string;
  apiEndpoint?: string;
  baseUrl?: string;

  abstract search(query: StreamQuery): Promise<StreamData|void>;
  abstract getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData|void>;
  abstract getStreamForId(id: string): Promise<StreamData|void>;
}

export default StreamProviderPlugin;
