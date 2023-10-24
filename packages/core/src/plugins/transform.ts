import { createConfigItem, transform, transformFile } from '@babel/core';
import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';

interface TransformResult {
  [key: string]: any;
}

type Transformer = typeof transform | typeof transformFile;

const transformGeneric = (transformer: Transformer) => 
  (input: string) => 
    new Promise<TransformResult>((resolve, reject) => {
      transformer(
        input,
        {
          configFile: false,
          sourceType: 'module',
          presets: [
            createConfigItem([
              presetEnv,
              {
                targets: {electron: '12'}
              }
            ]),
            createConfigItem(presetReact)
          ]
        },
        (err: Error, result) => {
          if (err) {
            reject(err);
          } else {
            const module = { exports: {} };
            new Function('exports', result.code)(module.exports); 
            resolve(module.exports as TransformResult);
          }
        }
      );
    });

export const transformPluginFile = transformGeneric(transformFile);
export const transformSource = transformGeneric(transform);
