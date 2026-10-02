import { afterEach, describe, expect, it } from 'vitest';

import { LyricsProviderBuilder } from '../test/builders/LyricsProviderBuilder';
import {
  FIRST_CANDIDATE,
  INSTRUMENTAL_LYRICS,
  LINE_SYNCED_LYRICS,
  PLAIN_LYRICS,
  SECOND_CANDIDATE,
  WORD_SYNCED_LYRICS,
} from '../test/fixtures/lyrics';
import { createTrack } from '../test/fixtures/queue';
import { createLyricsHost } from './lyricsHost';
import { providersHost } from './providersHost';

const track = createTrack('Test Song');

describe('lyricsHost', () => {
  afterEach(() => {
    providersHost.clear();
  });

  it('returns the lyrics of the first candidate with provider', async () => {
    const lyricsByCandidateId = {
      [FIRST_CANDIDATE.id]: LINE_SYNCED_LYRICS,
      [SECOND_CANDIDATE.id]: PLAIN_LYRICS,
    };
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('acme')
        .withName('Acme Lyrics')
        .withCandidates(FIRST_CANDIDATE, SECOND_CANDIDATE)
        .withGetLyricsForCandidate(
          async (candidate) => lyricsByCandidateId[candidate.id],
        )
        .build(),
    );

    const results = await createLyricsHost().getLyricsForTrack(track);

    expect(results).toEqual([
      {
        providerId: 'acme',
        providerName: 'Acme Lyrics',
        candidate: {
          id: 'candidate-1',
          title: 'Test Song',
          artist: 'Test Artist',
        },
        lyrics: {
          type: 'lineSynced',
          metadata: {},
          sections: [
            {
              lines: [
                {
                  startMs: 1000,
                  endMs: 4000,
                  segments: [{ text: 'Synced line' }],
                },
              ],
            },
          ],
        },
      },
    ]);
  });

  it('asks providers for candidates for the given track', async () => {
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('acme')
        .withName('Acme Lyrics')
        .withGetCandidatesForTrack(async (requestedTrack) => [
          { ...FIRST_CANDIDATE, title: requestedTrack.title },
        ])
        .withLyrics(PLAIN_LYRICS)
        .build(),
    );

    const results = await createLyricsHost().getLyricsForTrack(
      createTrack('Requested Song'),
    );

    expect(results).toEqual([
      {
        providerId: 'acme',
        providerName: 'Acme Lyrics',
        candidate: {
          id: 'candidate-1',
          title: 'Requested Song',
          artist: 'Test Artist',
        },
        lyrics: {
          type: 'plain',
          metadata: {},
          sections: [{ lines: [{ segments: [{ text: 'Plain line' }] }] }],
        },
      },
    ]);
  });

  it('ranks results by type', async () => {
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('instrumental-provider')
        .withName('Instrumental Provider')
        .withCandidates(FIRST_CANDIDATE)
        .withLyrics(INSTRUMENTAL_LYRICS)
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('plain-provider')
        .withName('Plain Provider')
        .withCandidates(FIRST_CANDIDATE)
        .withLyrics(PLAIN_LYRICS)
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('word-synced-provider')
        .withName('Word Synced Provider')
        .withCandidates(FIRST_CANDIDATE)
        .withLyrics(WORD_SYNCED_LYRICS)
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('line-synced-provider')
        .withName('Line Synced Provider')
        .withCandidates(FIRST_CANDIDATE)
        .withLyrics(LINE_SYNCED_LYRICS)
        .build(),
    );

    const results = await createLyricsHost().getLyricsForTrack(track);

    const candidate = {
      id: 'candidate-1',
      title: 'Test Song',
      artist: 'Test Artist',
    };
    expect(results).toEqual([
      {
        providerId: 'word-synced-provider',
        providerName: 'Word Synced Provider',
        candidate,
        lyrics: {
          type: 'wordSynced',
          metadata: {},
          sections: [
            {
              lines: [
                {
                  startMs: 1000,
                  endMs: 2000,
                  segments: [{ text: 'Word', startMs: 1000, endMs: 2000 }],
                },
              ],
            },
          ],
        },
      },
      {
        providerId: 'line-synced-provider',
        providerName: 'Line Synced Provider',
        candidate,
        lyrics: {
          type: 'lineSynced',
          metadata: {},
          sections: [
            {
              lines: [
                {
                  startMs: 1000,
                  endMs: 4000,
                  segments: [{ text: 'Synced line' }],
                },
              ],
            },
          ],
        },
      },
      {
        providerId: 'plain-provider',
        providerName: 'Plain Provider',
        candidate,
        lyrics: {
          type: 'plain',
          metadata: {},
          sections: [{ lines: [{ segments: [{ text: 'Plain line' }] }] }],
        },
      },
      {
        providerId: 'instrumental-provider',
        providerName: 'Instrumental Provider',
        candidate,
        lyrics: { type: 'instrumental', metadata: {} },
      },
    ]);
  });

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
