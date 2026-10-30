import { useMemo } from 'react';

import { PlaylistIndexTree } from '../../../stores/PlaylistIndexTree';
import { usePlaylistStore } from '../../../stores/playlistStore';

export const usePlaylistFolderActions = (playlistId: string) => {
  const index = usePlaylistStore((state) => state.index);
  const movePlaylistToFolder = usePlaylistStore(
    (state) => state.movePlaylistToFolder,
  );

  const { currentFolder, destinations } = useMemo(() => {
    const tree = new PlaylistIndexTree(index);
    const folder = tree.folderOf(playlistId);
    return {
      currentFolder: folder,
      destinations: tree
        .folders()
        .filter((candidate) => candidate.id !== folder?.id),
    };
  }, [index, playlistId]);

  return {
    currentFolder,
    destinations,
    moveToFolder: (folderId: string) =>
      movePlaylistToFolder(playlistId, folderId),
    removeFromFolder: () => movePlaylistToFolder(playlistId, undefined),
  };
};
