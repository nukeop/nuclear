import { User } from 'lucide-react';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { CardGrid, EmptyState, ViewShell } from '@nuclearplayer/ui';

import { useFavoritesStore } from '../../stores/favoritesStore';
import { sortByAddedAtDesc } from '../../utils/sort';
import { FavoriteArtistCard } from './components/FavoriteArtistCard';

export const FavoriteArtists: FC = () => {
  const { t } = useTranslation('favorites');
  const artists = useFavoritesStore((state) => state.artists);

  const sortedArtists = useMemo(() => sortByAddedAtDesc(artists), [artists]);

  return (
    <ViewShell data-testid="favorite-artists-view" title={t('artists.title')}>
      {sortedArtists.length === 0 ? (
        <EmptyState
          icon={<User size={48} />}
          title={t('artists.empty')}
          description={t('artists.emptyDescription')}
          className="flex-1"
        />
      ) : (
        <CardGrid>
          {sortedArtists.map((entry) => (
            <FavoriteArtistCard
              key={`${entry.ref.source.provider}-${entry.ref.source.id}`}
              artist={entry.ref}
            />
          ))}
        </CardGrid>
      )}
    </ViewShell>
  );
};
