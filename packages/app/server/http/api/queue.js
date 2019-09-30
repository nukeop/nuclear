import express from 'express';
import swagger from 'swagger-spec-express';

import {
  onEmptyQueue,
  getQueue
} from '../../mpris';
import { getStandardDescription } from '../swagger';

export function queueRouter() {

  const router = express.Router();
  
  swagger.swaggerize(router);

  router.get('/', (req, res, next) => {
    getQueue()
      .then(res.json.bind(res))
      .catch(next);
  })
    .describe(getStandardDescription({
      successDescription: 'The current queue',
      tags: ['Queue']
    }));

  router
    .post('/empty', (req, res) => {
      onEmptyQueue();
      res.send();
    })
    .describe(getStandardDescription({
      successDescription: 'The queue is now empty',
      tags: ['Queue']
    }));
  
  return router;
}
