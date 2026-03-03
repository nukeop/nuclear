import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import type { PlaylistProvider } from '@nuclearplayer/plugin-sdk';

import { providersHost } from '../../../services/providersHost';

export const useNavigateToPlaylist = () => {
  const navigate = useNavigate();

  return useCallback(
    (url: string) => {
      const providers = providersHost.list('playlists') as PlaylistProvider[];
      const matchingProvider = providers.find((provider) =>
        provider.matchesUrl(url),
      );

      if (!matchingProvider) {
        return;
      }

      navigate({
        to: '/playlists/import/$providerId',
        params: { providerId: matchingProvider.id },
        search: { url: encodeURIComponent(url) },
      });
    },
    [navigate],
  );
};
