import { NuclearSupabaseService } from './NuclearSupabaseService';

export type PromotedArtist = {
id: string;
name: string;
description: string;
link: string;
picture: string;
}

export class NuclearPromotionService extends NuclearSupabaseService {
  getPromotedArtists() {
    return this.client
      .from<PromotedArtist>('artists')
      .select();
  }
}
