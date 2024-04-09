import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { playlistsSelectors } from '../../selectors/playlists';
import { nuclearSelectors } from '../../selectors/nuclear';
import * as PlaylistActions from '../../actions/playlists';
import { openLocalFilePicker } from '../../actions/local';

export const useRemotePlaylists = () => {
  const dispatch = useDispatch();
  const identityStore = useSelector(nuclearSelectors.identity);

  useEffect(() => {
    dispatch(PlaylistActions.loadRemotePlaylists(identityStore));
  }, [dispatch, identityStore]);

  return {
    remotePlaylists: useSelector(playlistsSelectors.remotePlaylists)
  };
};

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
  const { remotePlaylists } = useRemotePlaylists();

  return {
    isLoading: localPlaylists.isLoading,
    hasError: localPlaylists.hasError,
    playlists: localPlaylists.data,
    remotePlaylists,
    onImportFromFile,
    onCreate
  };
};
