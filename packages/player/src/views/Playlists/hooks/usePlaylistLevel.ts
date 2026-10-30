import { useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';

import { PlaylistIndexTree } from '../../../stores/PlaylistIndexTree';
import { usePlaylistStore } from '../../../stores/playlistStore';

export const usePlaylistLevel = () => {
  const { folder: folderId } = useSearch({ from: '/playlists/' });
  const index = usePlaylistStore((state) => state.index);

  return useMemo(() => {
    const tree = new PlaylistIndexTree(index);
    const folder = tree.folder(folderId);

    if (folder) {
      return {
        folder,
        entries: folder.playlists,
        searchablePlaylists: folder.playlists,
      };
    }

    return {
      folder: undefined,
      entries: index,
      searchablePlaylists: tree.playlists(),
    };
  }, [index, folderId]);
};
