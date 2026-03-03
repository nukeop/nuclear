import isEmpty from 'lodash-es/isEmpty';
import { ListMusicIcon } from 'lucide-react';
import type { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState, ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { PlaylistDetailActions } from './components/PlaylistDetailActions';
import { PlaylistDetailHeader } from './components/PlaylistDetailHeader';
import { usePlaylistDetail } from './usePlaylistDetail';
import { usePlaylistEditing } from './usePlaylistEditing';

export const PlaylistDetail: FC = () => {
  const { t } = useTranslation('playlists');
  const { playlistId, playlist, items, tracks } = usePlaylistDetail();
  const editing = usePlaylistEditing(
    playlistId,
    items,
    Boolean(playlist && !playlist.isReadOnly),
  );

  return (
    <ViewShell
      data-testid="playlist-detail-view"
      classes={{ scrollableArea: '[&>div>:first-child]:mb-2' }}
    >
      {playlist && (
        <PlaylistDetailHeader playlist={playlist}>
          <PlaylistDetailActions playlistId={playlistId} tracks={tracks} />
        </PlaylistDetailHeader>
      )}
      {isEmpty(tracks) ? (
        <EmptyState
          icon={<ListMusicIcon size={48} />}
          title={t('emptyTracks')}
          description={t('emptyTracksDescription')}
          className="flex-1"
        />
      ) : (
        <ConnectedTrackTable
          tracks={tracks}
          getItemId={editing.getItemId}
          features={{ header: true, reorderable: editing.isEditable }}
          display={{
            displayThumbnail: true,
            displayArtist: true,
            displayDuration: tracks.some((t) => t.durationMs != null),
            displayQueueControls: true,
            displayDeleteButton: editing.isEditable,
          }}
          actions={editing.actions}
        />
      )}
    </ViewShell>
  );
};
