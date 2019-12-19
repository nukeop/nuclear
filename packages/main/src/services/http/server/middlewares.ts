import { ValidationError } from 'express-json-validator-middleware';
import { Request, Response, NextFunction } from 'express';
import Logger from '../../../services/logger';

const getValidationMessage = ({ validationErrors }: ValidationError): string => {
  if (validationErrors.params) {
    const err = validationErrors.params.shift();

    return `${err.dataPath} ${err.message} ${err.params.allowedValues.toString()}`;
  } else {
    return `request body ${validationErrors.body.shift().message}`;
  }
};

export function errorMiddleware(logger: Logger) {
  return (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof ValidationError) {
      const message = getValidationMessage(err);

      res.status(400).send(message);
      next();
    } else {
      logger.error(err);
      res.status(500).send('Internal Server Error');
    }
  };
}

export function notFoundMiddleware() {
  return (req: Request, res: Response): void => {
    res.status(404).send('Not Found');
  };
}
