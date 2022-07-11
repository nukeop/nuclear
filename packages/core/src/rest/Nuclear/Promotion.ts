import { NuclearSupabaseService } from './NuclearSupabaseService';

export class NuclearPromotionService extends NuclearSupabaseService {
  getPromotedArtists() {
    return this.client.from('artists').select();
  }
}
