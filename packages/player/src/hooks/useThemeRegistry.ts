import { useQuery } from '@tanstack/react-query';

import { type MarketplaceTheme } from '@nuclearplayer/themes';

import { themeRegistryApi } from '../apis/themeRegistryApi';

export const MARKETPLACE_THEMES_QUERY_KEY = ['marketplace-themes'];

const STALE_TIME_MS = 5 * 60 * 1000;

export const useMarketplaceThemes = () => {
  return useQuery<MarketplaceTheme[]>({
    queryKey: MARKETPLACE_THEMES_QUERY_KEY,
    queryFn: () => themeRegistryApi.getThemes(),
    staleTime: STALE_TIME_MS,
  });
};
