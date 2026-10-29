import { queryOptions, useQuery } from '@tanstack/react-query';

import type { Track } from '@nuclearplayer/model';

import { metadataHost } from '../services/metadataHost';
import { trackRefToTrack } from '../utils/trackRefToTrack';

export const artistTopTracksQuery = (providerId: string, artistId: string) =>
  queryOptions({
    queryKey: ['artist-top-tracks', providerId, artistId],
    queryFn: async (): Promise<Track[]> => {
      const refs = await metadataHost.fetchArtistTopTracks(
        artistId,
        providerId,
      );
      return refs.map(trackRefToTrack);
    },
  });

export const useArtistTopTracks = (
  providerId: string,
  artistId: string,
  { enabled = true }: { enabled?: boolean } = {},
) =>
  useQuery({
    ...artistTopTracksQuery(providerId, artistId),
    enabled: enabled && Boolean(providerId && artistId),
  });
