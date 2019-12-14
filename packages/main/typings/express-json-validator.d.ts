/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'express-json-validator-middleware' {
  import { NextFunction } from 'express';
  import { Options } from 'ajv';

  export class Validator {
    constructor(ajvOptions: Options)
    validate(options: Record<string, any>): NextFunction;
  }

  export class ValidationError extends Error {
    validationErrors: Record<string, any[]>;
    name: 'JsonSchemaValidationError';
    constructor(validationErrors: Record<string, any[]>);
  }
}
