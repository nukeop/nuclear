import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistIndexEntry } from '@nuclearplayer/model';
import { Card } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../../stores/playlistStore';
import { usePlaylistQueueActions } from '../hooks/usePlaylistQueueActions';
import { DeletePlaylistDialog } from './DeletePlaylistDialog';
import { PlaylistArtwork } from './PlaylistArtwork';
import { PlaylistCardMenuItems } from './PlaylistCardMenuItems';

type PlaylistCardProps = {
  playlist: PlaylistIndexEntry;
  onClick: () => void;
};

export const PlaylistCard: FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  const { t } = useTranslation('playlists');
  const { play, enqueue } = usePlaylistQueueActions(playlist.id);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const hasTracks = playlist.itemCount > 0;

  const handleDelete = async () => {
    setIsDeleteDialogOpen(false);
    await deletePlaylist(playlist.id);
  };

  return (
    <>
      <Card
        image={
          <PlaylistArtwork
            name={playlist.name}
            thumbnails={playlist.thumbnails}
          />
        }
        title={playlist.name}
        subtitle={t('trackCount', { count: playlist.itemCount })}
        onClick={onClick}
        onPlay={hasTracks ? play : undefined}
        menuItems={
          <PlaylistCardMenuItems
            playlistId={playlist.id}
            onAddToQueue={enqueue}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
        }
        labels={{ play: t('play'), menu: t('common:actions.moreActions') }}
      />
      <DeletePlaylistDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};
