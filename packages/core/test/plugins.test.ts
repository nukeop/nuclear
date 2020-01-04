/* eslint-disable @typescript-eslint/no-explicit-any */
import test from 'ava';
import path from 'path';
import { transformSource, transformPluginFile } from '../src';

test('transform a simple plugin', async t => {
  const result: any = await transformPluginFile(path.resolve(__dirname, 'plugins/simple.js'));
  eval(result.code);
  t.pass();
});

test('throw an error when a nonexistent path is provided', async t => {
  await t.throwsAsync(transformPluginFile('test'));
});

test('transform some code', async t => {
  const result: any = await transformSource('const f = (a,b) => a+b; const test = f(2,3); export default test;');
  t.is(eval(result.code), 5);
});

test('throw an error on invalid code', async t => {
  await t.throwsAsync(transformSource('()asd'));
});

test('transform jsx', async t => {
  const result: any = await transformSource(
    'import React from \'react\'; export const component = () => <div />;'
  );
  eval(result.code);
  t.pass();
});
