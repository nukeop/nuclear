import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Playlist } from '@nuclear/core/src/helpers/playlist/types';

import { playlistsSelectors } from '../../selectors/playlists';
import { nuclearSelectors } from '../../selectors/nuclear';
import * as PlaylistActions from '../../actions/playlists';
import { openLocalFilePicker } from '../../actions/local';
import { IdentityStore } from '../../reducers/nuclear/identity';

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
  const playlists = useSelector(playlistsSelectors.playlists) as Playlist[];

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

  return {
    playlists,
    onImportFromFile,
    onCreate
  };
};
