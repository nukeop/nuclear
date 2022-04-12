import extractPlaylist from '@nuclear/core/src/helpers/playlist/spotify';
import { WebviewTag } from 'electron';
import { useCallback } from 'react';
import { TFunction } from 'react-i18next';
import { useDispatch } from 'react-redux';

import * as PlaylistActions from '../../actions/playlists';

type CloseCallback = () => void;

export const useSpotifyPlaylistImporterProps = (t: TFunction<string>) => {
  const dispatch = useDispatch();
  const onImportFromUrl = useCallback((data: string) => {
    dispatch(PlaylistActions.addPlaylistFromUrl(data, t));
  }, [dispatch, t]);

  const onAccept = (w: WebviewTag, handleClose: CloseCallback) => {
    if (w !== null) {
      w.addEventListener('dom-ready', () => {
        w.addEventListener('ipc-message', event => {
          onImportFromUrl(event.channel);
          handleClose();
        });
        setTimeout(() => {
          w.executeJavaScript(`(function() {
            const ipcRenderer = window.require('electron').ipcRenderer;
            (${extractPlaylist.toString()})()
            }
            )()`.replace('electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"]', 'ipcRenderer').replace('electron__WEBPACK_IMPORTED_MODULE_0__.', ''));
        }, 1500);
      });
    }
  };

  return { onAccept };
};
