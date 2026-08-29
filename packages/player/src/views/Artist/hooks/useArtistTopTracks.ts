import { useQuery } from '@tanstack/react-query';

import type { Track, TrackRef } from '@nuclearplayer/model';

import { metadataHost } from '../../../services/metadataHost';

const mapTrackRefs = (refs: TrackRef[]): Track[] => {
  return refs.map((ref) => ({
    ...ref,
    artists: ref.artists.map((artist) => ({ ...artist, roles: [] })),
  }));
};

export const useArtistTopTracks = (providerId: string, artistId: string) => {
  return useQuery<Track[]>({
    queryKey: ['artist-top-tracks', providerId, artistId],
    queryFn: async () => {
      const refs = await metadataHost.fetchArtistTopTracks(
        artistId,
        providerId,
      );
      return mapTrackRefs(refs);
    },
    enabled: Boolean(providerId && artistId),
  });
};
