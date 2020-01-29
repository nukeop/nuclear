import test from 'ava';
import { rest } from '../src';
import { Bandcamp } from '../src/rest';

test('search', t => {
  Bandcamp.search('swans');
});
