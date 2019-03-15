import { ValidationError } from 'express-json-validator-middleware';

const getValidationMessage = ({ validationErrors }) => {
  if (validationErrors.params) {
    const err = validationErrors.params.shift();

    return `${err.dataPath} ${err.message} ${err.params.allowedValues.toString()}`;
  } else {
    return `request body ${validationErrors.body.shift().message}`;
  }
};

export function errorMiddleware(logger) {
  return (err, req, res, next) => {
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
  return (req, res) => {
    res.status(404).send('Not Found');
  };
}
