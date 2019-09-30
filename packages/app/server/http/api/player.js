import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import swagger from 'swagger-spec-express';

import {
  onNext,
  onPrevious,
  onPause,
  onPlayPause,
  onStop,
  onPlay,
  onVolume,
  onSeek,
  onMute,
  getPlayingStatus
} from '../../mpris';
import { volumeSchema, seekSchema } from '../schema';
import { getStandardDescription } from '../swagger';


const { validate } = new Validator({ allErrors: true });

export function playerRouter() {

  const router = express.Router();
  
  swagger.swaggerize(router);

  router
    .get('/now-playing', (req, res, next) => {
      getPlayingStatus()
        .then(res.json.bind(res))
        .catch(next);
    })
    .describe(
      getStandardDescription({
        successDescription: 'the status of nuclear player',
        tags: ['Player']
      })
    );

  router
    .post('/next', (req, res) => {
      onNext();
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/previous', (req, res) => {
      onPrevious();
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/pause', (req, res) => {
      onPause();
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/play-pause', (req, res) => {
      onPlayPause();
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/stop', (req, res) => {
      onStop();
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/play', (req, res) => {
      onPlay();
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/mute', (req, res) => {
      onMute();
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/volume', validate(volumeSchema), (req, res) => {
      onVolume(req.body.value);
      res.send();
    })
    .describe(
      getStandardDescription({
        tags: ['Player'],
        body: ['volumeValue']
      })
    );

  router
    .post('/seek', validate(seekSchema), (req, res) => {
      onSeek(req.body.value);
      res.send();
    })
    .describe(
      getStandardDescription({
        tags: ['Player'],
        body: ['seekValue']
      })
    );
  
  return router;
}
