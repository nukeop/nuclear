import { transform, transformFile } from '@babel/core';

const transformGeneric = transformer => input => new Promise((resolve, reject) => {
  transformer(input, {presets: ['@babel/preset-env', '@babel/preset-react']}, (err, result) => {
    err ? reject(err) : resolve(result);
  });
});

export const transformPluginFile = transformGeneric(transformFile);

export const transformSource = transformGeneric(transform);
