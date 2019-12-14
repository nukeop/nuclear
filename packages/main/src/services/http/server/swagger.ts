/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from 'express';
import swagger from 'swagger-spec-express';

import {
  volumeSchema,
  seekSchema,
  updateSettingsSchema,
  getSettingsSchema,
  addPlaylistSchema,
  deletePlaylistSchema,
  updateEqualizerSchema,
  setEqualizerSchema
} from './schema';

export function getStandardDescription({
  successDescription = 'Action successfull',
  errorDescription = 'Internal server error',
  tags,
  body,
  path
}: any): any {
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

export function initSwagger(app: Express): void {
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
      },
      {
        name: 'Playlist',
        description: 'Playlist related endpoints (create, clean queue ...)'
      },
      {
        name: 'Queue',
        description: 'Queue related endpoints'
      },
      {
        name: 'Equalizer',
        description: 'Equalizer related endpoints'
      }
    ] as any
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
    schema: volumeSchema.body
  });

  swagger.common.parameters.addBody({
    name: 'seekValue',
    description: 'The new position of the seek',
    required: true,
    schema: seekSchema.body
  });

  swagger.common.parameters.addPath({
    name: 'option',
    description: 'The name of the settings you want to get / update',
    required: true,
    ...getSettingsSchema.params.properties.option
  });

  swagger.common.parameters.addBody({
    name: 'playlistName',
    description: 'the name of the new playlist',
    required: true,
    schema: addPlaylistSchema.body
  });

  swagger.common.parameters.addPath({
    name: 'name',
    description: 'The name of the playlist to remove',
    required: true,
    ...deletePlaylistSchema.params.properties.name
  });

  swagger.common.parameters.addPath({
    name: 'eqName',
    description: 'The name of the equalizer presets to set',
    required: true,
    ...setEqualizerSchema.params.properties.name
  });

  swagger.common.parameters.addBody({
    name: 'eqValues',
    description: 'The values of the equalizer to set',
    required: true,
    schema: updateEqualizerSchema.body
  });
}

