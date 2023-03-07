import { NuclearService } from './NuclearService';

type StreamMapping = {
    id: string;
    artist: string;
    title: string;
    source: string;
    stream_id: string;
    author_id: string;
}

type TopStream = {
  artist: string;
  title: string;
  source: string;
}

type PostStreamMappingPayload = Omit<StreamMapping, 'id'>;

type DeleteStreamMappingPayload = Omit<StreamMapping, 'id'>;

type GetStreamMappingsResponseBody = StreamMapping[];


type ErrorBody = {
  message: string[];
  error: string;
}

export class NuclearStreamMappingsService extends NuclearService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
  async getStreamMappingsByArtistAndTitle(artist: string, title: string, source: string){
    return this.getJson<GetStreamMappingsResponseBody, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/find-all`, {
      headers: this.getHeaders(),
      method: 'POST',
      body: JSON.stringify({ artist, title, source })
    }));
  }

  async getTopStream(artist: string, title: string, source: string){
    return this.getJson<TopStream, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/top-stream`, {
      headers: this.getHeaders(),
      method: 'POST',
      body: JSON.stringify({ artist, title, source })
    }));
  }

  async postStreamMapping(mapping: PostStreamMappingPayload) {
    return this.getJson<StreamMapping, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/verify`, {
      headers: this.getHeaders(),
      method: 'POST',
      body: JSON.stringify(mapping)
    }));
  }

  async deleteStreamMapping(mapping: DeleteStreamMappingPayload) {}
}
