import { useMemo, useState } from 'react';

import { type MarketplaceTheme } from '@nuclearplayer/themes';

import { useMarketplaceThemes } from './useThemeRegistry';

const matchesSearch = (theme: MarketplaceTheme, query: string): boolean => {
  const lower = query.toLowerCase();
  return (
    theme.name.toLowerCase().includes(lower) ||
    theme.description.toLowerCase().includes(lower) ||
    theme.author.toLowerCase().includes(lower) ||
    (theme.tags?.some((tag) => tag.toLowerCase().includes(lower)) ?? false)
  );
};

export const useFilteredMarketplaceThemes = () => {
  const query = useMarketplaceThemes();
  const [search, setSearch] = useState('');

  const filteredThemes = useMemo(
    () =>
      search
        ? query.data?.filter((theme) => matchesSearch(theme, search))
        : query.data,
    [query.data, search],
  );

  return {
    ...query,
    themes: filteredThemes,
    search,
    setSearch,
  };
};
