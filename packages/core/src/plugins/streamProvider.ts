import Plugin from './plugin';

abstract class StreamProviderPlugin extends Plugin {
  sourceName: string;

  abstract search(query: StreamQuery): Promise<Response>;
  abstract getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<Response>;
}

export default StreamProviderPlugin;
