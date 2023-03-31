import Plugin from './plugin';
import { StreamFormats } from './plugins.types';
import { StreamQuery, StreamData } from './plugins.types';

abstract class StreamProviderPlugin extends Plugin {
  sourceName: string;
  apiEndpoint?: string;
  baseUrl?: string;

  abstract search(query: StreamQuery): Promise<StreamData[]>;
  abstract getStreamForId(id: string): Promise<StreamData | undefined>;
  mapStreamFormats(listOfStreams: StreamData[]) {
    return listOfStreams.map((currStream) => {
      return {
        ...currStream,
        streamFormat: this.identifyStreamFormat(currStream?.stream)
      };
    });
  }
  identifyStreamFormat = (stream: string) => {
    if (stream?.includes('m3u8')) {
      return StreamFormats.HLS;
    } else {
      return StreamFormats.NONHLS;
    }
  };
}

export default StreamProviderPlugin;
