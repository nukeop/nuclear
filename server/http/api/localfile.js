import express from 'express';
import { ipcMain } from 'electron';
import { Validator } from 'express-json-validator-middleware';
import _ from 'lodash';

import { scanDirectories } from '../lib/files';
import { store, getOption } from '../../store';

export const localSearchSchema = {
  body: {
    type: 'object',
    required: ['artist', 'track'],
    properties: {
      artist: {
        type: 'string'
      },
      track: {
        type: 'string'
      }
    }
  }
};

export const localGetSchema = {
  params: {
    type: 'object',
    required: ['fileId'],
    properties: {
      fileId: {
        type: 'string'
      }
    }
  }
};

const { validate } = new Validator({ allErrors: true });

export function localFileRouter() {
  let cache;
  let byArtist;

  ipcMain.on('refresh-localfolders', event => {
    scanDirectories(store.get('localFolders'))
      .then(data => {
        cache = data.reduce((acc, item) => ({
          ...acc,
          [item.id]: item
        }), {});
        byArtist = _.groupBy(data, track => track.artist.name);

        event.sender.send('local-files', data);
      })
      .catch(err => event.sender.send('local-files-error', err));
  });

  const router = express.Router();

  const checkCache = (req, res, next) => {
    if (!cache) {
      next(new Error('files are not availabale'));
    } else if (!cache[req.params.fileId]) {
      res.status(404).send('Not Found');
    } else {
      return next();
    }
  };

  router.get(
    '/:fileId',
    validate(localGetSchema),
    checkCache,
    (req, res) => {
      res.download(cache[req.params.fileId].path);
    }
  );

  router.get(
    '/:fileId/thumb',
    validate(localGetSchema),
    checkCache,
    (req, res, next) => {
      const picture = cache[req.params.fileId].cover;

      if (picture) {
        res.end(picture[0].data);
      } else {
        next();
      }
    }
  );

  router.post('/search', validate(localSearchSchema), (req, res, next) => {
    const port = getOption('api.port');

    try {
      res.json(
        Object.keys(byArtist)
          .filter(artist => artist.includes(req.body.artist))
          .map(artist => byArtist[artist])
          .flat()
          .filter(track => track.name.includes(req.body.track))
          .map(track => ({
            id: track.id,
            title: track.name,
            duration: track.duration,
            source: 'Local',
            stream: `http://127.0.0.1:${port}/nuclear/file/${track.id}`,
            thumbnail: `http://127.0.0.1:${port}/nuclear/file/${track.id}/thumb`
          }))
          .pop());
    } catch (err) {
      next(err);
    }
  });

  return router;
}
