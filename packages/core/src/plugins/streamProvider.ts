import Plugin from './plugin';
interface StreamProviderPlugin extends Plugin {
  sourceName: string;

  search(query: StreamQuery): Promise<StreamData|void>;
  getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData|void>;
}

export default StreamProviderPlugin;
