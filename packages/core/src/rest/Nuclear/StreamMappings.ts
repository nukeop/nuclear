import { NuclearSupabaseService } from './NuclearSupabaseService';

type StreamMapping = {
    id: string;
    artist: string;
    title: string;
    source: string;
    stream_id: string;
    author_id: string;
}

type PostStreamMappingPayload = Omit<StreamMapping, 'id'>;

export class NuclearStreamMappingsService extends NuclearSupabaseService {
  async getStreamMappingsByArtistAndTitle(artist: string, title: string, source: string){
    return this.client.rpc<{stream_id: string, count: number}>('mappings_for_track', { artist, title, source });
  }

  async getStreamMappingsByAuthorId(authorId: string) {
    return this.client
      .from<StreamMapping>('stream-mappings')
      .select()
      .eq('author_id', authorId);
  }

  async postStreamMapping(mapping: PostStreamMappingPayload) {
    return this.client
      .from<StreamMapping>('stream-mappings')
      .insert(mapping);
  }

  async putStreamMapping(mapping: Partial<StreamMapping>) {
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
