import path from 'path';

import { transformSource, transformPluginFile } from '..';

describe('Plugin tests', () => {
  it('transform a simple plugin', async () => {
    const result: any = await transformPluginFile(path.resolve(__dirname, 'testData/simple.js'));
    expect(() => eval(result.code)).not.toThrow();
  });

  it('throw an error when a nonexistent path is provided', async () => {
    expect(transformPluginFile('test'));
  });

  it('transform some code', async () => {
    const result: any = await transformSource('const f = (a,b) => a+b; const test = f(2,3); export default test;');
    expect(eval(result.code)).toEqual(5);
  });

  it('throw an error on invalid code', async () => {
    expect(transformSource('()asd')).rejects.toThrow();
  });

  it('transform jsx', async () => {
    const result: any = await transformSource(
      'import React from \'react\'; export const component = () => <div />;'
    );
    expect(() => eval(result.code)).not.toThrow();
  });
});
