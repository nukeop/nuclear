import { IpcEvents } from '@nuclear/core';
import extractPlaylist from '@nuclear/core/src/helpers/playlist/spotify';
import { WebviewTag } from 'electron';
import { useCallback, useState } from 'react';
import { TFunction } from 'react-i18next';
import { useDispatch } from 'react-redux';

import * as PlaylistActions from '../../actions/playlists';

type CloseCallback = () => void;

export type SpotifyTrack = {
  index: number;
  id?: string;
  thumbnail: string;
  title: string;
  album: string;
  duration: string;
  artist: string;
  otherArtists?: string[];
}

export type SpotifyPlaylist = {
  name: string;
  totalTracks: number;
  source: 'Spotify';
  tracks: SpotifyTrack[];
}

export const useSpotifyPlaylistImporterProps = (t: TFunction<string>) => {
  const dispatch = useDispatch();
  const onImportFromUrl = useCallback((data: SpotifyPlaylist) => {
    dispatch(PlaylistActions.addPlaylistFromUrl(data, t));
  }, [dispatch, t]);

  const [playlistMeta, setPlaylistMeta] = useState<SpotifyPlaylist | undefined>();
  const [importProgress, setImportProgress] = useState(0);

  const onAccept = (w: WebviewTag, handleClose: CloseCallback) => {
    if (w !== null) {
      w.addEventListener('dom-ready', () => {
        w.addEventListener('ipc-message', event => {
          switch (event.channel) {
          case IpcEvents.IMPORT_SPOTIFY_PLAYLIST_METADATA:
            setPlaylistMeta(event.args[0]);
            break;
          case IpcEvents.IMPORT_SPOTIFY_PLAYLIST_PROGRESS:
            setImportProgress(event.args[0]);
            break;
          case IpcEvents.IMPORT_SPOTIFY_PLAYLIST_SUCCESS:
            onImportFromUrl(event.args[0]);
            handleClose();
            break;
          default:
            break;
          }
        });

        setTimeout(() => {
          const js = `(function() {
            const ipcRenderer = window.require('electron').ipcRenderer;
            (${extractPlaylist.toString()})()
            })()`
            .replaceAll('electron__WEBPACK_IMPORTED_MODULE_0__.', '')
            .replaceAll('a(\'electron\')', 'window.require(\'electron\'))');

          w.executeJavaScript(js);
        }, 1500);
      });
    }
  };

  const onClose = useCallback(() => {
    setImportProgress(0);
    setPlaylistMeta(undefined);
  }, [importProgress, playlistMeta]);

  return { onAccept, importProgress, playlistMeta, onClose };
};
