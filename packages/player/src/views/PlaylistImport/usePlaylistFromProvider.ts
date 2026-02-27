import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Playlist, PlaylistItem } from '@nuclearplayer/model';
import type { PlaylistProvider } from '@nuclearplayer/plugin-sdk';

import { providersHost } from '../../services/providersHost';
import { reportError } from '../../utils/logging';

const EMPTY_ITEMS: PlaylistItem[] = [];

export const usePlaylistFromProvider = (
  providerId: string,
  encodedUrl: string,
) => {
  const { t } = useTranslation('playlists');
  const provider = providersHost.get<PlaylistProvider>(providerId, 'playlists');
  const decodedUrl = decodeURIComponent(encodedUrl);

  const query = useQuery<Playlist>({
    queryKey: ['playlist-import', providerId, decodedUrl],
    queryFn: async () => {
      if (!provider) {
        throw new Error('Provider not found');
      }

      const fetched = await provider.fetchPlaylistByUrl(decodedUrl);
      return {
        ...fetched,
        isReadOnly: true,
        origin: {
          provider: provider.name,
          id: provider.id,
          url: decodedUrl,
        },
      };
    },
    enabled: Boolean(provider),
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      toast.success(t('importSuccess'));
    }
  }, [query.isSuccess, t]);

  useEffect(() => {
    if (query.error) {
      reportError('playlists', {
        userMessage: t('importError'),
        error: query.error,
      });
    }
  }, [query.error, t]);

  const playlist = query.data ?? null;
  const items = playlist?.items ?? EMPTY_ITEMS;
  const tracks = useMemo(() => items.map((item) => item.track), [items]);

  return { playlist, items, tracks, isLoading: query.isLoading };
};
