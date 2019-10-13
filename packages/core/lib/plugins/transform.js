import { createConfigItem, transform, transformFile } from '@babel/core';
import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';

const transformGeneric = transformer => input => new Promise((resolve, reject) => {
  transformer(input, {
    configFile: false,
    sourceType: 'unambiguous',
    presets: [
      createConfigItem([presetEnv, {
        targets: {electron: '4'}
      }]),
      createConfigItem(presetReact)
    ]
  }, (err, result) => {
    err ? reject(err) : resolve(result);
  });
});

export const transformPluginFile = transformGeneric(transformFile);
export const transformSource = transformGeneric(transform);
