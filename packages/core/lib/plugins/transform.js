import { transformFile } from '@babel/core';

export const transformPluginFile = path => new Promise((resolve, reject) => {
  transformFile(path, null, (err, result) => {
    err ? reject(err) : resolve(result);
  });
});
