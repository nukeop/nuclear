import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { playlistsSelectors } from '../../selectors/playlists';
import { Playlist } from '@nuclear/core/src/helpers/playlist/types';
import * as PlaylistActions from '../../actions/playlists';
import { openLocalFilePicker } from '../../actions/local';

export const usePlaylistsProps = () => {
  const dispatch = useDispatch();
  const playlists = useSelector(playlistsSelectors.playlists) as Playlist[];
  
  const handleImportFromFile = useCallback(async () => {
    const filePath = await openLocalFilePicker();
    dispatch(PlaylistActions.addPlaylistFromFile(filePath[0]));
  }, [dispatch]);

  return {
    playlists,
    handleImportFromFile
  };
};
