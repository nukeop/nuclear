import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { playlistsSelectors } from '../../selectors/playlists';
import { nuclearSelectors } from '../../selectors/nuclear';
import * as PlaylistActions from '../../actions/playlists';
import { openLocalFilePicker } from '../../actions/local';
import { IdentityStore } from '../../reducers/nuclear/identity';
import { PlaylistsStore } from '../../reducers/playlists';

export const useNuclearServicePlaylists = () => {
  const dispatch = useDispatch();
  const identityStore: IdentityStore = useSelector(nuclearSelectors.identity);

  useEffect(() => {
    dispatch(PlaylistActions.loadRemotePlaylists(identityStore));
  }, [dispatch, identityStore]);
};

export const usePlaylistsProps = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('playlists');
  const playlists = useSelector(playlistsSelectors.playlists) as PlaylistsStore['playlists'];

  const onImportFromFile = useCallback(async () => {
    const filePath = await openLocalFilePicker();
    dispatch(PlaylistActions.addPlaylistFromFile(filePath[0], t));
  }, [dispatch, t]);

  const onCreate = useCallback(
    (name: string) => {
      dispatch(PlaylistActions.addPlaylist([], name));
    },
    [dispatch]
  );

  useNuclearServicePlaylists();

  useEffect(() => {
    dispatch(PlaylistActions.loadLocalPlaylists());
  }, [dispatch]);

  return {
    playlists,
    onImportFromFile,
    onCreate
  };
};
