import test from 'ava';

import { formatDuration } from '../lib/utils';

test('Should format 0 second duration as 00:00', t => {
  t.is(formatDuration(0), '00:00');
});

test('Should format negative numbers as 00:00', t => {
  t.is(formatDuration(-30), '00:00');
  t.is(formatDuration(-3600), '00:00');
  t.is(formatDuration(-5425), '00:00');
});

test('Should format non-number values as 00:00', t => {
  t.is(formatDuration([]), '00:00');
  t.is(formatDuration(null), '00:00');
  t.is(formatDuration({}), '00:00');
  t.is(formatDuration('test'), '00:00');
});

test('Should format hours', t => {
  t.is(formatDuration(3600), '01:00:00');
  t.is(formatDuration(7200), '02:00:00');
  t.is(formatDuration(5400), '01:30:00');
  t.is(formatDuration(5425), '01:30:25');
  t.is(formatDuration(36000), '10:00:00');
});

test('Should format minutes', t => {
  t.is(formatDuration(60), '01:00');
  t.is(formatDuration(120), '02:00');
  t.is(formatDuration(3545), '59:05');
  t.is(formatDuration(1827), '30:27');
});

test('Should format seconds', t => {
  t.is(formatDuration(1), '00:01');
  t.is(formatDuration(59), '00:59');
  t.is(formatDuration(30), '00:30');
  t.is(formatDuration(11), '00:11');
});
