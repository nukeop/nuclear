import { StreamProvider } from '../..';
import { NuclearSupabaseService } from './NuclearSupabaseService';

type StreamMapping = {
    id: string;
    artist: string;
    title: string;
    source: string;
    stream_id: string;
    author_id: string;
}

export class NuclearStreamMappingsService extends NuclearSupabaseService {
  async getStreamMappingsByArtistAndTitle(artist: string, title: string) {
    return this.client
      .from<StreamMapping>('stream-mappings')
      .select()
      .eq('artist', artist)
      .eq('title', title);
  }

  async getStreamMappingsByAuthorId(authorId: string) {
    return this.client
      .from<StreamMapping>('stream-mappings')
      .select()
      .eq('author_id', authorId);
  }

  async postStreamMapping(mapping: StreamMapping) {
    return this.client
      .from<StreamMapping>('stream-mappings')
      .insert(mapping);
  }

  async putStreamMapping(mapping: StreamMapping) {
    return this.client
      .from<StreamMapping>('stream-mappings')
      .update(mapping)
      .eq('author_id', mapping.author_id)
      .eq('artist', mapping.artist)
      .eq('title', mapping.title)
      .eq('source', mapping.source);
  }

  async deleteStreamMapping(mapping: StreamMapping) {
    return this.client
      .from<StreamMapping>('stream-mappings')
      .delete()
      .eq('id', mapping.id);
  }
}
