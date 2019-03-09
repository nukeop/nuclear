import express from 'express';
import { Validator } from 'express-json-validator-middleware';

import {
  onNext,
  onPrevious,
  onPause,
  onPlayPause,
  onStop,
  onPlay,
  onVolume,
  onSeek
} from '../../mpris';
import { volumeSchema, seekSchema } from './_schema';

const { validate } = new Validator({ allErrors: true });

export function playerRouter() {

  const router = express.Router();

  router.post('/next', (req, res) => {
    onNext();
    res.send();
  });

  router.post('/previous', (req, res) => {
    onPrevious();
    res.send();
  });

  router.post('/pause', (req, res) => {
    onPause();
    res.send();
  });

  router.post('/play-pause', (req, res) => {
    onPlayPause();
    res.send();
  });

  router.post('/stop', (req, res) => {
    onStop();
    res.send();
  });

  router.post('/play', (req, res) => {
    onPlay();
    res.send();
  });

  router.post('/volume', validate(volumeSchema), (req, res) => {
    onVolume(req.body.value);
    res.send();
  });

  router.post('/seek', validate(seekSchema), (req, res) => {
    onSeek(req.body.value);
    res.send();
  });

  return router;
}
