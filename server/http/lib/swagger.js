import swagger from 'swagger-spec-express';

import { volumeSchema, seekSchema, updateSettingsSchema, getSettingsSchema } from '../schema';

export function getStandardDescription({
  successDescription = 'Action successfull',
  errorDescription = 'Internal server error',
  tags,
  body,
  path
}) {
  return {
    tags,
    common: {
      parameters: {
        body,
        path
      }
    },
    responses: {
      200: {
        description: successDescription
      },
      500: {
        description: errorDescription
      }
    }
  };
}

export function initSwagger(app) {
  swagger.reset();
  swagger.initialise(app, {
    title: 'Nuclear REST API',
    description: 'This Api allow you to remotly control nuclear desktop app',
    tags: [
      {
        name: 'Player',
        description: 'Player related endpoints (play, pause, volume ...)' 
      },
      {
        name: 'Window',
        description: 'Window related endpoints (maximize, close ...)'
      },
      {
        name: 'Settings',
        description: 'Settings related endpoints (update settings ...)'
      }
    ]
  });

  swagger.common.parameters.addBody({
    name: 'settingsValue',
    description: 'The value of the property you want to change',
    required: true,
    schema: updateSettingsSchema.body.properties.value
  });

  swagger.common.parameters.addBody({
    name: 'volumeValue',
    description: 'The new volume',
    required: true,
    schema: volumeSchema.body.properties.value
  });

  swagger.common.parameters.addBody({
    name: 'seekValue',
    description: 'The new position of the seek',
    required: true,
    schema: seekSchema.body.properties.value
  });

  swagger.common.parameters.addPath({
    name: 'option',
    description: 'The name of the settings you want to get / update',
    required: true,
    ...getSettingsSchema.params.properties.option
  });
}

