import { NuclearSupabaseService } from './NuclearSupabaseService';

export type PromotedArtist = {
  id: string;
  name: string;
  description: string;
  link: string;
  picture: string;
  metaProvider: 'bandcamp' | 'discogs' | 'musicbrainz' | 'soundcloud';
}

export class NuclearPromotionService extends NuclearSupabaseService {
  getPromotedArtists() {
    return this.client
      .from<PromotedArtist>('artists')
      .select();
  }
}
