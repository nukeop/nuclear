import test from 'ava';
import path from 'path';
import { transformPluginFile } from '..';

test('transform a simple plugin', t => {
  return transformPluginFile(path.resolve(__dirname, 'plugins/simple.js'))
    .then(result => {
      eval(result.code);
      t.pass();
    })
    .catch(err => {
      t.log(err);
      t.fail();
    });
});

test('throw an error when a nonexistent path is provided', async t => {
  await t.throwsAsync(transformPluginFile('test'));
});
