import { useNavigate } from '@tanstack/react-router';
import isEmpty from 'lodash-es/isEmpty';
import { ListMusic } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState, ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../stores/playlistStore';
import { CreatePlaylistDialog } from './components/CreatePlaylistDialog';
import { PlaylistCardGrid } from './components/PlaylistCardGrid';
import { PlaylistsToolbar } from './components/PlaylistsToolbar';
import { usePlaylistFilter } from './hooks/usePlaylistFilter';
import { PlaylistsProvider } from './PlaylistsContext';

const PlaylistsContent: FC = () => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const index = usePlaylistStore((state) => state.index);
  const { filter, setFilter, filteredIndex } = usePlaylistFilter(index);

  return (
    <ViewShell data-testid="playlists-view" title={t('title')}>
      <PlaylistsToolbar
        filter={filter}
        onFilterChange={setFilter}
        isFilterVisible={!isEmpty(index)}
      />

      {isEmpty(index) ? (
        <EmptyState
          icon={<ListMusic size={48} />}
          title={t('empty')}
          description={t('emptyDescription')}
          className="flex-1"
        />
      ) : (
        <ScrollableArea className="flex-1 overflow-hidden">
          <PlaylistCardGrid
            index={filteredIndex}
            onCardClick={(id) =>
              navigate({
                to: '/playlists/$playlistId',
                params: { playlistId: id },
              })
            }
          />
        </ScrollableArea>
      )}

      <CreatePlaylistDialog />
    </ViewShell>
  );
};

export const Playlists: FC = () => (
  <PlaylistsProvider>
    <PlaylistsContent />
  </PlaylistsProvider>
);
