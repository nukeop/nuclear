import { formatDuration } from '../lib/utils';

it('Should format 0 second duration as 00:00', () => {
  expect(formatDuration(0)).toBe('00:00');
});

it('Should format negative numbers as 00:00', () => {
  expect(formatDuration(-30)).toBe('00:00');
  expect(formatDuration(-3600)).toBe('00:00');
  expect(formatDuration(-5425)).toBe('00:00');
});

it('Should format non-number values as 00:00', () => {
  expect(formatDuration([])).toBe('00:00');
  expect(formatDuration(null)).toBe('00:00');
  expect(formatDuration({})).toBe('00:00');
  expect(formatDuration('test')).toBe('test');
});

it('Should format hours', () => {
  expect(formatDuration(3600)).toBe('01:00:00');
  expect(formatDuration(7200)).toBe('02:00:00');
  expect(formatDuration(5400)).toBe('01:30:00');
  expect(formatDuration(5425)).toBe('01:30:25');
  expect(formatDuration(36000)).toBe('10:00:00');
});

it('Should format minutes', () => {
  expect(formatDuration(60)).toBe('01:00');
  expect(formatDuration(120)).toBe('02:00');
  expect(formatDuration(3545)).toBe('59:05');
  expect(formatDuration(1827)).toBe('30:27');
});

it('Should format seconds', () => {
  expect(formatDuration(1)).toBe('00:01');
  expect(formatDuration(59)).toBe('00:59');
  expect(formatDuration(30)).toBe('00:30');
  expect(formatDuration(11)).toBe('00:11');
});
