import { IpcEvents, PlaybackStatus, PlaylistHelper, PlaylistTrack } from '@nuclear/core';
import { ipcRenderer } from 'electron';
import { logger } from '@nuclear/core';
import { head } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getType } from 'typesafe-actions';

import * as DownloadsActions from '../../actions/downloads';
import * as EqualizerActions from '../../actions/equalizer';
import { localLibraryActions } from '../../actions/local';
import * as PlayerActions from '../../actions/player';
import * as PlaylistActions from '../../actions/playlists';
import * as QueueActions from '../../actions/queue';
import * as SettingsActions from '../../actions/settings';

interface RootState {
  player: {
    playbackStatus: string;
    muted: boolean;
  };
  queue: {
    queueItems: Array<{
      artist: string;
      name: string;
      thumbnail: string;
      streams: Array<{ duration: number }>;
    }>;
    currentTrack: number;
  };
  settings: {
    shuffleQueue: boolean;
    loopAfterQueueEnd: boolean;
  };
  playlists: {
    localPlaylists: {
      data: Array<{
        name: string;
        tracks: any[];
      }>;
    };
  };
  plugin: {
    plugins: {
      streamProviders: any;
    };
  };
}

const IpcContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const player = useSelector((state: RootState) => state.player);
  const queue = useSelector((state: RootState) => state.queue);
  const settings = useSelector((state: RootState) => state.settings);
  const playlists = useSelector((state: RootState) => state.playlists.localPlaylists.data);

  useEffect(() => {
    ipcRenderer.send(IpcEvents.STARTED);

    const handlers = {
      [IpcEvents.NEXT]: () => dispatch(QueueActions.nextSong()),
      [IpcEvents.PREVIOUS]: () => dispatch(QueueActions.previousSong()),
      [IpcEvents.PAUSE]: () => dispatch(PlayerActions.pausePlayback(true)),
      [IpcEvents.PLAYPAUSE]: () => dispatch(PlayerActions.togglePlayback(player.playbackStatus as PlaybackStatus, true)),
      [IpcEvents.STOP]: () => dispatch(PlayerActions.stopPlayback(true)),
      [IpcEvents.PLAY]: () => dispatch(PlayerActions.startPlayback(true)),
      [IpcEvents.MUTE]: () => {
        if (player.muted) {
          dispatch(PlayerActions.unMute());
        } else {
          dispatch(PlayerActions.mute());
        }
      },
      [IpcEvents.VOLUME]: (_: any, data: number) => dispatch(PlayerActions.updateVolume(data, true)),
      [IpcEvents.SEEK]: (_: any, data: number) => dispatch(PlayerActions.updateSeek(data)),
      [IpcEvents.QUEUE_CLEAR]: () => dispatch(QueueActions.clearQueue()),
      [IpcEvents.QUEUE]: () => ipcRenderer.send(IpcEvents.QUEUE, queue.queueItems),
      [IpcEvents.TRACK_SELECT]: (_: any, index: number) => dispatch(QueueActions.selectSong(index)),
      [IpcEvents.PLAYLIST_CREATE]: (_: any, name: string) => 
        dispatch(PlaylistActions.addPlaylist((queue.queueItems.map(track => PlaylistHelper.extractTrackData(track))) as PlaylistTrack[], name)),
      [IpcEvents.PLAYLIST_REFRESH]: () => dispatch(PlaylistActions.loadLocalPlaylists()),
      [IpcEvents.PLAYLIST_ACTIVATE]: (_: any, playlistName: string) => {
        const tracks = playlists.find(({ name }) => playlistName === name)?.tracks || [];
        dispatch(QueueActions.clearQueue());
        dispatch(QueueActions.addPlaylistTracksToQueue(tracks));
      },
      [IpcEvents.PLAYLIST_ADD_QUEUE]: (_: any, metas: any[]) => 
        dispatch(QueueActions.addPlaylistTracksToQueue(metas)),
      [IpcEvents.EQUALIZER_UPDATE]: (_: any, data: any) => {
        dispatch(EqualizerActions.changeValue(data));
      },
      [IpcEvents.EQUALIZER_SET]: (_: any, data: any) => {
        dispatch(EqualizerActions.selectPreset(data));
      },
      [IpcEvents.LOCAL_FILES]: (_: any, data: any) => 
        dispatch(localLibraryActions.scanLocalFoldersSuccess(data)),
      [IpcEvents.LOCAL_FILES_PROGRESS]: (_: any, { scanProgress, scanTotal }: any) => 
        dispatch(localLibraryActions.scanLocalFoldersProgress(scanProgress, scanTotal)),
      [IpcEvents.LOCAL_FILES_ERROR]: () => 
        dispatch(localLibraryActions.scanLocalFoldersFailure()),
      [IpcEvents.PLAY_STARTUP_TRACK]: (_: any, meta: any) => {
        dispatch(QueueActions.playTrack([], meta));
        history.push('/library');
      },
      [IpcEvents[getType(DownloadsActions.onDownloadStarted)]]: (_: any, data: any) => {
        dispatch(DownloadsActions.onDownloadStarted(data));
      },
      [IpcEvents[getType(DownloadsActions.onDownloadProgress)]]: (_: any, data: any) => {
        dispatch(DownloadsActions.onDownloadProgress(data.uuid, data.progress));
      },
      [IpcEvents[getType(DownloadsActions.onDownloadFinished)]]: (_: any, data: any) => {
        dispatch(DownloadsActions.onDownloadFinished(data));
      },
      [IpcEvents[getType(DownloadsActions.onDownloadError)]]: (_: any, data: any) => {
        dispatch(DownloadsActions.onDownloadError(data.uuid));
        logger.error(data);
      },
      [IpcEvents.SETTINGS]: (_: any, data: Record<string, any>) => {
        const key = Object.keys(data).pop();
        const value = Object.values(data).pop();
        if (!key || value === undefined) {
          return;
        }

        switch (typeof value) {
        case 'boolean':
          dispatch(SettingsActions.setBooleanOption(key, value, true));
          break;
        case 'number':
          dispatch(SettingsActions.setNumberOption(key, value, true));
          break;
        default:
          dispatch(SettingsActions.setStringOption(key, value, true));
        }
      },
      [IpcEvents.PLAYING_STATUS]: () => {
        const { shuffleQueue, loopAfterQueueEnd } = settings;
        try {
          const currentItem = queue.queueItems[queue.currentTrack];
          const { artist, name, thumbnail } = currentItem;
          const duration = head(currentItem.streams)?.duration;

          ipcRenderer.send(IpcEvents.PLAYING_STATUS, {
            ...player,
            artist,
            name,
            thumbnail,
            loopAfterQueueEnd,
            shuffleQueue,
            duration
          });
        } catch (err) {
          ipcRenderer.send(IpcEvents.PLAYING_STATUS, {
            ...player,
            loopAfterQueueEnd,
            shuffleQueue
          });
        }
      },
      [IpcEvents.NAVIGATE_BACK]: () => {
        if (history.length > 1) {
          history.goBack();
        }
      },
      [IpcEvents.NAVIGATE_FORWARD]: () => {
        history.goForward();
      }
    };

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      ipcRenderer.on(event, handler);
    });

    // Cleanup function to remove all handlers
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        ipcRenderer.removeListener(event, handler);
      });
    };
  }, [dispatch, history, player, queue, settings, playlists]);

  // Track changes and notify IPC
  useEffect(() => {
    const currentTrack = queue.queueItems[queue.currentTrack];
    if (currentTrack) {
      ipcRenderer.send(IpcEvents.SONG_CHANGE, currentTrack);
    }
  }, [queue.currentTrack, queue.queueItems]);

  return null;
};

export default IpcContainer;
