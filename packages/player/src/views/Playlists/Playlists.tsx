import { useNavigate } from '@tanstack/react-router';
import isEmpty from 'lodash-es/isEmpty';
import { ListMusic, Plus } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import {
  Button,
  EmptyState,
  ScrollableArea,
  ViewShell,
} from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../stores/playlistStore';
import { CreatePlaylistDialog } from './components/CreatePlaylistDialog';
import { ImportPlaylistMenu } from './components/ImportPlaylistMenu';
import { PlaylistCardGrid } from './components/PlaylistCardGrid';
import {
  PlaylistsProvider,
  useCreatePlaylistContext,
} from './PlaylistsContext';

const PlaylistsContent: FC = () => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const index = usePlaylistStore((state) => state.index);
  const { openCreateDialog } = useCreatePlaylistContext();

  return (
    <ViewShell data-testid="playlists-view" title={t('title')}>
      <div className="mb-4 flex items-center gap-2">
        <Button onClick={openCreateDialog} data-testid="create-playlist-button">
          <Plus size={16} />
          {t('create')}
        </Button>
        <ImportPlaylistMenu />
      </div>

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
            index={index}
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
