import Plugin from './plugin';
abstract class StreamProviderPlugin extends Plugin {
  sourceName: string;

  abstract search(query: StreamQuery): Promise<StreamData|void>;
  abstract getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData|void>;
}

export default StreamProviderPlugin;
