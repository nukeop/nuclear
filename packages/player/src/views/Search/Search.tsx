import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import type {
  MetadataProvider,
  SearchResults,
} from '@nuclearplayer/plugin-sdk';
import {
  Button,
  Card,
  CardGrid,
  Loader,
  Tabs,
  TabsItem,
  ViewShell,
} from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { useActiveProvider } from '../../hooks/useActiveProvider';
import { metadataHost } from '../../services/metadataHost';
import { SearchEmptyState } from './SearchEmptyState';

const SearchContent: FC<{
  provider: MetadataProvider | undefined;
  isLoading: boolean;
  isError: boolean;
  results: SearchResults | undefined;
  refetch: () => void;
}> = ({ provider, isLoading, isError, results, refetch }) => {
  const { t } = useTranslation(['search', 'common']);
  const navigate = useNavigate();

  if (!provider) {
    return <SearchEmptyState />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <div className="text-accent-red">{t('search:failedToLoad')}</div>
        <Button
          onClick={() => {
            void refetch();
          }}
        >
          {t('common:actions.retry')}
        </Button>
      </div>
    );
  }

  const tabsItems = [
    results?.albums && {
      id: 'albums',
      label: t('search:results.albums'),
      content: (
        <CardGrid>
          {results.albums.map((item) => (
            <Card
              key={item.source.id}
              title={item.title}
              src={pickArtwork(item.artwork, 'cover', 300)?.url}
              onClick={() =>
                navigate({ to: `/album/${provider.id}/${item.source.id}` })
              }
            />
          ))}
        </CardGrid>
      ),
    },
    results?.artists && {
      id: 'artists',
      label: t('search:results.artists'),
      content: (
        <CardGrid>
          {results.artists.map((item) => (
            <Card
              key={item.source.id}
              title={item.name}
              src={pickArtwork(item.artwork, 'cover', 300)?.url}
              onClick={() =>
                navigate({ to: `/artist/${provider.id}/${item.source.id}` })
              }
            />
          ))}
        </CardGrid>
      ),
    },
    results?.tracks && {
      id: 'tracks',
      label: t('search:results.tracks'),
      content: (
        <div className="flex flex-col">
          <ConnectedTrackTable tracks={results.tracks} />
        </div>
      ),
    },
  ].filter(Boolean);

  return <Tabs items={tabsItems as TabsItem[]} className="flex-1" />;
};

export const Search: FC = () => {
  const { t } = useTranslation(['search', 'common']);
  const { q } = useSearch({ from: '/search' });

  const provider = useActiveProvider('metadata') as
    | MetadataProvider
    | undefined;

  const {
    data: results,
    isLoading,
    isError,
    refetch,
  } = useQuery<SearchResults>({
    queryKey: ['metadata-search', provider?.id, q],
    queryFn: () =>
      metadataHost.search({
        query: q,
      }),
    enabled: Boolean(provider && q),
  });

  return (
    <ViewShell
      data-testid="search-view"
      title={t('search:title')}
      subtitle={`${t('search:query')}: "${q}"`}
    >
      <SearchContent
        provider={provider}
        isLoading={isLoading}
        isError={isError}
        results={results}
        refetch={refetch}
      />
    </ViewShell>
  );
};
