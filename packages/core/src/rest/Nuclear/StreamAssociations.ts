import { StreamProvider } from '../..';
import { NuclearSupabaseService } from './NuclearSupabaseService';

type StreamAssociation = {
    id: string;
    artist: string;
    title: string;
    source: string;
    stream_id: string;
    author_id: string;
}

export class NuclearStreamAssociationsService extends NuclearSupabaseService {
  async getStreamAssociationsByArtistAndTitle(artist: string, title: string) {
    return this.client
      .from<StreamAssociation>('stream-associations')
      .select()
      .eq('artist', artist)
      .eq('title', title);
  }

  async getStreamAssociationsByAuthorId(authorId: string) {
    return this.client
      .from<StreamAssociation>('stream-associations')
      .select()
      .eq('author_id', authorId);
  }

  async postStreamAssociation(association: StreamAssociation) {
    return this.client
      .from<StreamAssociation>('stream-associations')
      .insert(association);
  }

  async putStreamAssociation(association: StreamAssociation) {
    return this.client
      .from<StreamAssociation>('stream-associations')
      .update(association)
      .eq('author_id', association.author_id)
      .eq('artist', association.artist)
      .eq('title', association.title)
      .eq('source', association.source);
  }

  async deleteStreamAssociation(association: StreamAssociation) {
    return this.client
      .from<StreamAssociation>('stream-associations')
      .delete()
      .eq('id', association.id);
  }
}
