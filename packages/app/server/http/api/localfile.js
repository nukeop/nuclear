import express from 'express';
import { Validator } from 'express-json-validator-middleware';

<<<<<<< HEAD
import { scanFoldersAndGetMeta } from '../../local-files';
import { getOption } from '../../store';
import store from '../../libraryStore';
=======
>>>>>>> refactor(server): huge refactor server codebase

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

export function localFileRouter(localService, store) {
  const router = express.Router();

  const checkCache = (req, res, next) => {
    if (!localService.cache) {
      next(new Error('files are not availabale'));
    } else if (!localService.cache[req.params.fileId]) {
      res.status(404).send('Not Found');
    } else {
      return next();
    }
  };

  router.get('/:fileId', validate(localGetSchema), checkCache, (req, res) => {
    res.download(localService.cache[req.params.fileId].path);
  });

  router.post('/search', validate(localSearchSchema), (req, res, next) => {
    const port = store.getOption('api.port');

    try {
      res.json(
        Object.keys(localService.byArtist)
          .filter(artist => artist.includes(req.body.artist))
          .map(artist => localService.byArtist[artist])
          .flat()
          .filter(track => track.name.includes(req.body.track))
          .map(track => ({
            uuid: track.uuid,
            title: track.name,
            duration: track.duration,
            source: 'Local',
            stream: `http://127.0.0.1:${port}/nuclear/file/${track.uuid}`,
            thumbnail: track.thumbnail || track.image && track.image[0] ? track.image[0]['#text'] : undefined
          }))
          .pop()
      );
    } catch (err) {
      next(err);
    }
  });

  return router;
}
