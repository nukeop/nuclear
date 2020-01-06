/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createConfigItem, transform, transformFile } from '@babel/core';
import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';

interface BabelConfig {
  configFile: boolean;
  sourceType: string;
  presets: any[];
}

interface TransformResult {
  metadata: any;
  options: BabelConfig;
}

type Cb = (err: Error, result: TransformResult) => void;
type Transformer = (input: string, babelConfig: BabelConfig, cb: Cb) => void;

const transformGeneric = (transformer: Transformer) => 
  (input: string) => 
    new Promise<TransformResult>((resolve, reject) => {
      transformer(
        input,
        {
          configFile: false,
          sourceType: 'unambiguous',
          presets: [
            createConfigItem([
              presetEnv,
              {
                targets: {electron: '4'}
              }
            ]),
            createConfigItem(presetReact)
          ]
        },
        (err: Error, result: TransformResult) => {
          err ? reject(err) : resolve(result);
        }
      );
    });

export const transformPluginFile = transformGeneric(transformFile);
export const transformSource = transformGeneric(transform);
