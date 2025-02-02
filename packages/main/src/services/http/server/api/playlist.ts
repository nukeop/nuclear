import { NuclearPlaylist, IpcEvents } from '@nuclear/core';
import { BrowserWindow } from 'electron';
import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import swagger, { ISwaggerizedRouter } from 'swagger-spec-express';

import { addPlaylistSchema } from '../schema';
import { getStandardDescription } from '../swagger';
import Store from '../../../store';

const { validate } = new Validator({ allErrors: true });

export function playlistRouter(store: Store, rendererWindow: BrowserWindow['webContents']): ISwaggerizedRouter {

  const router = express.Router() as ISwaggerizedRouter;
  
  swagger.swaggerize(router);

  router
    .post('/', validate(addPlaylistSchema), (req, res) => {
      rendererWindow.send(IpcEvents.PLAYLIST_CREATE, req.body.name);
      res.send();
    })
    .describe(
      getStandardDescription({
        successDescription: 'The playlist has been created',
        errorDescription: 'The playlist has not been created',
        tags: ['Playlist'],
        body: ['playlistName']
      })
    );

  router
    .get('/', (req, res, next) => {
      try {
        const playlists = store.get('playlists');

        res.json(playlists);
      } catch (err) {
        next(err);
      }
    })
    .describe(
      getStandardDescription({
        successDescription: 'The list of all playlists',
        errorDescription: 'The playlist has not been created',
        tags: ['Playlist']
      })
    );

  router
    .delete('/:name', (req, res, next) => {
      try {
        const playlists: NuclearPlaylist[] = store.get('playlists') as NuclearPlaylist[];

        store.set('playlists', playlists.filter(({ name }) => name !== req.params.name));
        rendererWindow.send(IpcEvents.PLAYLIST_REFRESH);
        res.send();
      } catch (err) {
        next(err);
      }
    })
    .describe(
      getStandardDescription({
        errorDescription: 'The playlist has not been removed',
        tags: ['Playlist'],
        path: ['name']
      })
    );

  return router;
}
