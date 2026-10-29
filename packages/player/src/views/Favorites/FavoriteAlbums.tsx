import { Disc3 } from 'lucide-react';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { CardGrid, EmptyState, ViewShell } from '@nuclearplayer/ui';

import { ConnectedAlbumCard } from '../../components/ConnectedAlbumCard';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { sortByAddedAtDesc } from '../../utils/sort';

export const FavoriteAlbums: FC = () => {
  const { t } = useTranslation('favorites');
  const albums = useFavoritesStore((state) => state.albums);

  const sortedAlbums = useMemo(() => sortByAddedAtDesc(albums), [albums]);

  return (
    <ViewShell data-testid="favorite-albums-view" title={t('albums.title')}>
      {sortedAlbums.length === 0 ? (
        <EmptyState
          icon={<Disc3 size={48} />}
          title={t('albums.empty')}
          description={t('albums.emptyDescription')}
          className="flex-1"
        />
      ) : (
        <CardGrid>
          {sortedAlbums.map((entry) => (
            <ConnectedAlbumCard
              key={`${entry.ref.source.provider}-${entry.ref.source.id}`}
              album={entry.ref}
            />
          ))}
        </CardGrid>
      )}
    </ViewShell>
  );
};
