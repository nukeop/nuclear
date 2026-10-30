import isEmpty from 'lodash-es/isEmpty';
import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistIndexEntry } from '@nuclearplayer/model';
import { Card } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../../stores/playlistStore';
import { usePlaylistFolderActions } from '../hooks/usePlaylistFolderActions';
import { usePlaylistQueueActions } from '../hooks/usePlaylistQueueActions';
import { DeletePlaylistDialog } from './DeletePlaylistDialog';
import { MoveToFolderDialog } from './MoveToFolderDialog';
import { PlaylistArtwork } from './PlaylistArtwork';
import { PlaylistCardMenuItems } from './PlaylistCardMenuItems';

type PlaylistCardProps = {
  playlist: PlaylistIndexEntry;
  onClick: () => void;
};

type OpenDialog = 'delete' | 'moveToFolder' | null;

export const PlaylistCard: FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  const { t } = useTranslation('playlists');
  const { play, enqueue } = usePlaylistQueueActions(playlist.id);
  const { currentFolder, destinations, moveToFolder, removeFromFolder } =
    usePlaylistFolderActions(playlist.id);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  const closeDialog = () => setOpenDialog(null);
  const hasTracks = playlist.itemCount > 0;

  const handleDelete = async () => {
    closeDialog();
    await deletePlaylist(playlist.id);
  };

  const handleMoveToFolder = async (folderId: string) => {
    closeDialog();
    await moveToFolder(folderId);
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
            onDelete={() => setOpenDialog('delete')}
            canMoveToFolder={!isEmpty(destinations)}
            isInFolder={Boolean(currentFolder)}
            onMoveToFolder={() => setOpenDialog('moveToFolder')}
            onRemoveFromFolder={removeFromFolder}
          />
        }
        labels={{ play: t('play'), menu: t('common:actions.moreActions') }}
      />
      <DeletePlaylistDialog
        isOpen={openDialog === 'delete'}
        onClose={closeDialog}
        onConfirm={handleDelete}
      />
      <MoveToFolderDialog
        isOpen={openDialog === 'moveToFolder'}
        folders={destinations}
        onClose={closeDialog}
        onSelect={handleMoveToFolder}
      />
    </>
  );
};
