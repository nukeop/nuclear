import { describe, it } from 'vitest';

describe('lyricsHost', () => {
  it.todo('returns the lyrics of the first candidate with provider');
  it.todo('asks providers for candidates for the given track');
  it.todo('ranks results by type');
  it.todo('keeps registration order for results of the same type');
  it.todo('leaves out a provider that has no candidates for the track');
  it.todo('reports and leaves out a provider that returns an error');
  it.todo(
    'reports and leaves out a provider that fails to load lyrics for its candidate',
  );
  it.todo('throws an error when no lyrics providers are registered');

  describe('with a provider id', () => {
    it.todo('returns only the result of that provider');
    it.todo('returns an empty list when the provider has no candidates');
    it.todo('reports the error and throws it when the provider fails');
  });
});
