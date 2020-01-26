import Plugin from './plugin';
interface StreamProviderPlugin extends Plugin {
  sourceName: string;

  search(query: StreamQuery): Promise<StreamData>;
  getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData>;
}

export default StreamProviderPlugin;
