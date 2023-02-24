import fs from 'fs';
import { v4 } from 'uuid';
import _ from 'lodash';
import { remote } from 'electron';
import { createAsyncAction, createStandardAction } from 'typesafe-actions';

import { store, PlaylistHelper, Playlist, PlaylistTrack, rest } from '@nuclear/core';
import { GetPlaylistsByUserIdResponseBody } from '@nuclear/core/src/rest/Nuclear/Playlists.types';
import { ErrorBody } from '@nuclear/core/src/rest/Nuclear/types';

import { Playlists } from './actionTypes';

import {
  deletePlaylistEffect,
  updatePlaylistEffect,
  updatePlaylistsOrderEffect
} from './playlists.effects';
import { success, error } from './toasts';
import { IdentityStore } from '../reducers/nuclear/identity';
import { PlaylistsStore } from '../reducers/playlists';
import { SpotifyPlaylist } from '../containers/SpotifyPlaylistImporter/hooks';
import logoIcon from '../../resources/media/512x512.png'
import logonew from '../../resources/media/presskit/logo/logo-medium.png'
export const updatePlaylistsAction = createStandardAction(Playlists.UPDATE_LOCAL_PLAYLISTS)<PlaylistsStore['localPlaylists']['data']>();

export const loadLocalPlaylistsAction = createAsyncAction(
  Playlists.LOAD_LOCAL_PLAYLISTS_START,
  Playlists.LOAD_LOCAL_PLAYLISTS_SUCCESS,
  Playlists.LOAD_LOCAL_PLAYLISTS_ERROR
)<void, Array<Playlist>, void>();

export const loadRemotePlaylistsAction = createAsyncAction(
  Playlists.LOAD_REMOTE_PLAYLISTS_START,
  Playlists.LOAD_REMOTE_PLAYLISTS_SUCCESS,
  Playlists.LOAD_REMOTE_PLAYLISTS_ERROR
)<void, GetPlaylistsByUserIdResponseBody, ErrorBody>();

export const addPlaylist = (tracks: Array<PlaylistTrack>, name: string) => dispatch => {
  if (name?.length === 0) {
    return;
  }
  let playlists: PlaylistsStore['localPlaylists']['data'] = store.get('playlists') || [];
  const playlist = PlaylistHelper.formatPlaylistForStorage(name, tracks, v4());

  playlists = [...playlists, playlist];

  store.set('playlists', playlists);
  dispatch(updatePlaylistsAction(playlists));
};

export const deletePlaylist = (id: string) => dispatch => {
  const playlists = deletePlaylistEffect(store)(id);
  dispatch(updatePlaylistsAction(playlists));
};

export const loadLocalPlaylists = () => dispatch => {
  dispatch(loadLocalPlaylistsAction.request());

  try {
    const playlists: Playlist[] = store.get('playlists');
    dispatch(loadLocalPlaylistsAction.success(playlists ?? []));
  } catch (error) {
    dispatch(loadLocalPlaylistsAction.failure());
  }
};


export const loadRemotePlaylists = ({ token, signedInUser }: IdentityStore) => async (dispatch, getState) => {
  dispatch(loadRemotePlaylistsAction.request());
  const { settings } = getState();
  const service = new rest.NuclearPlaylistsService(
    settings.nuclearPlaylistsServiceUrl
  );

  try {
    if (token) {
      const playlists = await service.getPlaylistsByUserId(token, signedInUser.id);
      if (playlists.ok) {
        dispatch(loadRemotePlaylistsAction.success(playlists.body as GetPlaylistsByUserIdResponseBody));
      } else {
        throw playlists.body;
      }
    } else {
      throw new Error('No token');
    }
  } catch (e) {
    dispatch(loadRemotePlaylistsAction.failure(e.message));
  }
};

export const updatePlaylist = (playlist: Playlist) => dispatch => {
  const playlists = updatePlaylistEffect(store)(playlist);
  dispatch(updatePlaylistsAction(playlists));
};

export const reorderPlaylists = (source: number, destination: number) => async (dispatch) => {
  const playlists = updatePlaylistsOrderEffect(store)(source, destination);
  dispatch(updatePlaylistsAction(playlists));
};


export const exportPlaylist = (playlist, t) => async (dispatch) => {
  const name = playlist.name;
  const dialogResult = await remote.dialog.showSaveDialog({
    defaultPath: name,
    filters: [
      { name: 'file', extensions: ['json'] }
    ],
    properties: ['createDirectory', 'showOverwriteConfirmation']
  });
  const filePath = dialogResult?.filePath?.replace(/\\/g, '/');

  if (filePath) {
    try {
      const data = JSON.stringify(playlist, null, 2);
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          dispatch(error(t('export-fail-title'), t('error-save-file'), null, null));
          return;
        }
        dispatch(success(t('export-success-title'), t('playlist-exported', { name }), null, null));
      });
    } catch (e) {
      dispatch(error(t('export-fail-title'), t('error-save-file'), null, null));
    }
  }
};

export const exportPlaylistPng = (playlist, t) => async (dispatch) => {
  const name = playlist.name;
  let canvas = document.createElement('canvas')
  let trcks = playlist.tracks;
  canvas.height = 1600
  canvas.width  = 800
  var tracksnum = trcks.length;
  if(tracksnum>8)tracksnum=8;
  if(tracksnum==0){
    dispatch(error(t('export-fail-title'), t('error-save-file'), null, null));
  } 

  let ctx = canvas.getContext('2d')
  ctx.fillStyle = "#424557";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#6c7494";
  ctx.fillRect(0, 0, canvas.width, 220);
  ctx.fillStyle = "white";
  ctx.font = "120px serif";
  ctx.fillText(name, 240, 130, 700);
  var ynum=250;

  for (let i = 0; i < tracksnum; i++) {
    const element = trcks[i];
    var img = document.createElement('img');
    img.src=element.thumbnail;
    ctx.drawImage(img, 20, ynum,130,130 );
    
    ctx.fillStyle = "white";
    ctx.font = "50px serif";
    ctx.fillText(element.name, 170, ynum+50, 560);
    ctx.font = "30px serif";
    ctx.fillText("by "+element.artist, 170, ynum+85, 400);
    if(i<tracksnum-1){
      ctx.moveTo(30, ynum+150);
      ctx.lineTo(770, ynum+150);
      ctx.lineWidth = 2;
      ctx.strokeStyle="#6c7494"
      ctx.stroke();
    }
    
    ynum+=165;

  }
  //var img = document.createElement('img');
  //img.src="https://e-cdns-images.dzcdn.net/images/artist/d085c55df9e089015e79bea1a064f8fc/250x250-000000-80-0-0.jpg"
  //ctx.drawImage(img, 10, 10);
  var image = new Image();
  image.src=logoIcon as unknown as string;
  ctx.drawImage(image, 10, 10,200,200);
  ctx.fillStyle = "#6c7494";
    ctx.font = "40px monospace";
    ctx.fillText("nuclear", 325, 1560, 560);

  try {
    canvas.toBlob(blob => {
      let data = window.URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = data
      link.download = 'untitled.png'
      link.click()
    }, 'image/png')
      
  } catch (error) {
    console.log(error);
    dispatch(error(t('export-fail-title'), t('error-save-file'), null, null));
  }
  dispatch(success(t('export-success-title'), t('playlist-exported', { name }), null, null));
};


export function addPlaylistFromUrl(playlist: SpotifyPlaylist, t) {
  return async dispatch => {
    try {
      if (!playlist.name || !playlist.tracks) {
        throw new Error('missing tracks or name');
      }

      let playlists = store.get('playlists') || [];
      const importedPlaylist = PlaylistHelper.formatPlaylistForStorage(playlist.name, playlist.tracks, v4(), playlist.source);

      if (_.isEmpty(playlist.tracks)) {
        dispatch(error(t('import-fail-title'), t('error-empty-data'), null, null));
        return;
      }

      playlists = [...playlists, importedPlaylist];

      store.set('playlists', playlists);
      dispatch(success(t('import-success-title'), t('playlist-created', { name: playlist.name }), null, null));
      dispatch(updatePlaylistsAction(playlists));

    } catch (e) {
      dispatch(error(t('import-fail-title'), t('error-invalid-data'), null, null));
    }
  };
}

export function addPlaylistFromFile(filePath, t) {
  return async dispatch => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        dispatch(error(t('import-fail-title'), t('error-open-file'), null, null));
        return;
      }

      try {
        const parsed = JSON.parse(data.toString());
        const name = _.get(parsed, 'name', null);
        const tracks = _.get(parsed, 'tracks', null);
        const source = _.get(parsed, 'source', null);

        if (!name || !tracks) {
          throw new Error('missing tracks or name');
        }

        let playlists = store.get('playlists') || [];
        const playlist = PlaylistHelper.formatPlaylistForStorage(name, tracks, v4(), source);

        if (_.isEmpty(tracks)) {
          dispatch(error(t('import-fail-title'), t('error-empty-data'), null, null));
          return;
        }

        playlists = [...playlists, playlist];

        store.set('playlists', playlists);
        dispatch(success(t('import-success-title'), t('playlist-created', { name }), null, null));
        dispatch(updatePlaylistsAction(playlists));

      } catch (e) {
        dispatch(error(t('import-fail-title'), t('error-invalid-data'), null, null));
      }
    });
  };
}
