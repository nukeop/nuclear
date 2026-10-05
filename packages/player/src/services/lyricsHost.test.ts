import { afterEach, describe, expect, it, vi } from 'vitest';

import { LyricsProviderBuilder } from '../test/builders/LyricsProviderBuilder';
import {
  INSTRUMENTAL_LYRICS,
  LINE_SYNCED_LYRICS,
  PLAIN_LYRICS,
  WORD_SYNCED_LYRICS,
} from '../test/fixtures/lyrics';
import { createTrack } from '../test/fixtures/queue';
import { reportError } from '../utils/logging';
import { createLyricsHost } from './lyricsHost';
import { providersHost } from './providersHost';

vi.mock('../utils/logging', () => ({
  reportError: vi.fn(),
}));

const track = createTrack('Test Song');

describe('lyricsHost', () => {
  afterEach(() => {
    providersHost.clear();
  });

  it('asks providers for lyrics for the given track', async () => {
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('acme')
        .withName('Acme Lyrics')
        .withGetLyrics(async (requestedTrack) => ({
          type: 'plain',
          metadata: {},
          sections: [
            { lines: [{ segments: [{ text: requestedTrack.title }] }] },
          ],
        }))
        .build(),
    );

    const results = await createLyricsHost().getLyricsForTrack(
      createTrack('Requested Song'),
    );

    expect(results).toEqual([
      {
        providerId: 'acme',
        providerName: 'Acme Lyrics',
        lyrics: {
          type: 'plain',
          metadata: {},
          sections: [{ lines: [{ segments: [{ text: 'Requested Song' }] }] }],
        },
      },
    ]);
  });

  it('ranks results by type', async () => {
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('instrumental-provider')
        .withName('Instrumental Provider')
        .withLyrics(INSTRUMENTAL_LYRICS)
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('plain-provider')
        .withName('Plain Provider')
        .withLyrics(PLAIN_LYRICS)
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('word-synced-provider')
        .withName('Word Synced Provider')
        .withLyrics(WORD_SYNCED_LYRICS)
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('line-synced-provider')
        .withName('Line Synced Provider')
        .withLyrics(LINE_SYNCED_LYRICS)
        .build(),
    );

    const results = await createLyricsHost().getLyricsForTrack(track);

    expect(results).toEqual([
      {
        providerId: 'word-synced-provider',
        providerName: 'Word Synced Provider',
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
        lyrics: {
          type: 'plain',
          metadata: {},
          sections: [{ lines: [{ segments: [{ text: 'Plain line' }] }] }],
        },
      },
      {
        providerId: 'instrumental-provider',
        providerName: 'Instrumental Provider',
        lyrics: { type: 'instrumental', metadata: {} },
      },
    ]);
  });

  it('keeps registration order for results of the same type', async () => {
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('first-provider')
        .withName('First Provider')
        .withLyrics(PLAIN_LYRICS)
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('second-provider')
        .withName('Second Provider')
        .withLyrics(PLAIN_LYRICS)
        .build(),
    );

    const results = await createLyricsHost().getLyricsForTrack(track);

    const lyrics = {
      type: 'plain',
      metadata: {},
      sections: [{ lines: [{ segments: [{ text: 'Plain line' }] }] }],
    };
    expect(results).toEqual([
      {
        providerId: 'first-provider',
        providerName: 'First Provider',
        lyrics,
      },
      {
        providerId: 'second-provider',
        providerName: 'Second Provider',
        lyrics,
      },
    ]);
  });

  it('leaves out a provider that has no lyrics for the track', async () => {
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('empty-provider')
        .withName('Empty Provider')
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('acme')
        .withName('Acme Lyrics')
        .withLyrics(PLAIN_LYRICS)
        .build(),
    );

    const results = await createLyricsHost().getLyricsForTrack(track);

    expect(results).toEqual([
      {
        providerId: 'acme',
        providerName: 'Acme Lyrics',
        lyrics: {
          type: 'plain',
          metadata: {},
          sections: [{ lines: [{ segments: [{ text: 'Plain line' }] }] }],
        },
      },
    ]);
  });

  it('reports and leaves out a provider that returns an error', async () => {
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('failing-provider')
        .withName('Failing Provider')
        .withGetLyrics(async () => {
          throw new Error('Lyrics request failed');
        })
        .build(),
    );
    providersHost.register(
      new LyricsProviderBuilder()
        .withId('acme')
        .withName('Acme Lyrics')
        .withLyrics(PLAIN_LYRICS)
        .build(),
    );

    const results = await createLyricsHost().getLyricsForTrack(track);

    expect(reportError).toHaveBeenCalledWith('lyrics', {
      userMessage: 'A lyrics provider failed to load lyrics',
      error: new Error('Lyrics request failed'),
    });
    expect(results).toEqual([
      {
        providerId: 'acme',
        providerName: 'Acme Lyrics',
        lyrics: {
          type: 'plain',
          metadata: {},
          sections: [{ lines: [{ segments: [{ text: 'Plain line' }] }] }],
        },
      },
    ]);
  });

  it('returns no results when no lyrics providers are registered', async () => {
    expect(await createLyricsHost().getLyricsForTrack(track)).toEqual([]);
  });

  describe('with a provider id', () => {
    it('returns only the result of that provider', async () => {
      providersHost.register(
        new LyricsProviderBuilder()
          .withId('acme')
          .withName('Acme Lyrics')
          .withLyrics(PLAIN_LYRICS)
          .build(),
      );
      providersHost.register(
        new LyricsProviderBuilder()
          .withId('other-provider')
          .withName('Other Provider')
          .withLyrics(WORD_SYNCED_LYRICS)
          .build(),
      );

      const results = await createLyricsHost().getLyricsForTrack(track, 'acme');

      expect(results).toEqual([
        {
          providerId: 'acme',
          providerName: 'Acme Lyrics',
          lyrics: {
            type: 'plain',
            metadata: {},
            sections: [{ lines: [{ segments: [{ text: 'Plain line' }] }] }],
          },
        },
      ]);
    });

    it('returns an empty list when the provider has no lyrics for the track', async () => {
      providersHost.register(
        new LyricsProviderBuilder()
          .withId('empty-provider')
          .withName('Empty Provider')
          .build(),
      );
      providersHost.register(
        new LyricsProviderBuilder()
          .withId('acme')
          .withName('Acme Lyrics')
          .withLyrics(PLAIN_LYRICS)
          .build(),
      );

      const results = await createLyricsHost().getLyricsForTrack(
        track,
        'empty-provider',
      );

      expect(results).toEqual([]);
    });

    it('reports the error and throws it when the provider fails', async () => {
      providersHost.register(
        new LyricsProviderBuilder()
          .withId('failing-provider')
          .withName('Failing Provider')
          .withGetLyrics(async () => {
            throw new Error('Lyrics request failed');
          })
          .build(),
      );

      await expect(
        createLyricsHost().getLyricsForTrack(track, 'failing-provider'),
      ).rejects.toThrow(new Error('Lyrics request failed'));
      expect(reportError).toHaveBeenCalledWith('lyrics', {
        userMessage: 'A lyrics provider failed to load lyrics',
        error: new Error('Lyrics request failed'),
      });
    });
  });
});
