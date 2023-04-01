import { has } from 'lodash';
import { NuclearService } from './NuclearService';

type StreamMapping = {
    id: string;
    artist: string;
    title: string;
    source: string;
    stream_id: string;
    author_id: string;
}

export type TopStream = {
  stream_id: string;
  score: number;
  self_verified: boolean;
}

type PostStreamMappingPayload = Omit<StreamMapping, 'id'>;

type DeleteStreamMappingPayload = Omit<StreamMapping, 'id'>;

type ErrorBody = {
  message: string[];
  error: string;
}

export const isTopStream = (data: TopStream | ErrorBody): data is TopStream => {
  return has(data, 'stream_id');
};

export class NuclearStreamMappingsService extends NuclearService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getTopStream(artist: string, title: string, source: string, author_id: string){
    return this.getJson<TopStream, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/top-stream`, {
      headers: this.getHeaders(),
      method: 'POST',
      body: JSON.stringify({ artist, title, source, author_id })
    }));
  }

  async postStreamMapping(mapping: PostStreamMappingPayload) {
    return this.getJson<void, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/verify`, {
      headers: this.getHeaders(),
      method: 'POST',
      body: JSON.stringify(mapping)
    }));
  }

  async deleteStreamMapping(mapping: DeleteStreamMappingPayload) {
    return this.getJson<void, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/unverify`, {
      headers: this.getHeaders(),
      method: 'DELETE',
      body: JSON.stringify(mapping)
    }));
  }
}
