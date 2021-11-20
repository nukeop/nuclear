import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Playlist } from '@nuclear/core/src/helpers/playlist/types';

import { playlistsSelectors } from '../../selectors/playlists';
import * as PlaylistActions from '../../actions/playlists';
import { openLocalFilePicker } from '../../actions/local';

export const usePlaylistsProps = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('playlists');
  const playlists = useSelector(playlistsSelectors.playlists) as Playlist[];
  
  const handleImportFromFile = useCallback(async () => {
    const filePath = await openLocalFilePicker();
    dispatch(PlaylistActions.addPlaylistFromFile(filePath[0], t));
  }, [dispatch, t]);

  const createNew = useCallback((name: string) => {
    dispatch(PlaylistActions.addPlaylist([], name));
  }, [dispatch]);

  return {
    playlists,
    handleImportFromFile,
    createNew
  };
};
