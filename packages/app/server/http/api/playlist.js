import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import swagger from 'swagger-spec-express';

import {
  onCreatePlaylist,
  onRemovePlaylist
} from '../../mpris';
import { addPlaylistSchema } from '../schema';
import { getStandardDescription } from '../swagger';
import { store } from '../../store';


const { validate } = new Validator({ allErrors: true });

export function playlistRouter() {

  const router = express.Router();
  
  swagger.swaggerize(router);

  router
    .post('/', validate(addPlaylistSchema), (req, res) => {
      onCreatePlaylist(req.body.name);
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
        const playlists = store.get('playlists');

        store.set('playlists', playlists.filter(({ name }) => name !== req.params.name));
        onRemovePlaylist();
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
