import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { playlistsSelectors } from '../../selectors/playlists';
import * as PlaylistActions from '../../actions/playlists';
import { openLocalFilePicker } from '../../actions/local';

export const useLocalPlaylists = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(PlaylistActions.loadLocalPlaylists());
  }, [dispatch]);

  return {
    localPlaylists: useSelector(playlistsSelectors.localPlaylists)
  };
};

export const usePlaylistsProps = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('playlists');

  const onImportFromFile = useCallback(async () => {
    const filePath = await openLocalFilePicker();
    if (filePath.length > 0) {
      dispatch(PlaylistActions.addPlaylistFromFile(filePath[0], t));
    }
  }, [dispatch, t]);

  const onCreate = useCallback(
    (name: string) => {
      dispatch(PlaylistActions.addPlaylist([], name));
    },
    [dispatch]
  );

  const { localPlaylists } = useLocalPlaylists();

  return {
    isLoading: localPlaylists.isLoading,
    hasError: localPlaylists.hasError,
    playlists: localPlaylists.data,
    onImportFromFile,
    onCreate
  };
};
