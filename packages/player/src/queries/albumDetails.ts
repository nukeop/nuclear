import { queryOptions, useQuery } from '@tanstack/react-query';

import type { Album, Track } from '@nuclearplayer/model';

import { metadataHost } from '../services/metadataHost';
import { trackRefToTrack } from '../utils/trackRefToTrack';

export const albumDetailsQuery = (providerId: string, albumId: string) =>
  queryOptions({
    queryKey: ['album-details', providerId, albumId],
    queryFn: () => metadataHost.fetchAlbumDetails(albumId, providerId),
  });

export const albumToTracks = (album: Album): Track[] =>
  (album.tracks ?? []).map((ref) => ({
    ...trackRefToTrack(ref),
    album: {
      title: album.title,
      artwork: album.artwork,
      source: album.source,
    },
    artwork: ref.artwork ?? album.artwork,
  }));

export const useAlbumDetails = (providerId: string, albumId: string) =>
  useQuery({
    ...albumDetailsQuery(providerId, albumId),
    enabled: Boolean(providerId && albumId),
  });

export const useAlbumTracks = (
  providerId: string,
  albumId: string,
  { enabled = true }: { enabled?: boolean } = {},
) =>
  useQuery({
    ...albumDetailsQuery(providerId, albumId),
    select: albumToTracks,
    enabled: enabled && Boolean(providerId && albumId),
  });
