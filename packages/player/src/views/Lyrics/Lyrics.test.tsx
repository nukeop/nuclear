import { ConnectedPlayerBarWrapper } from '../../components/ConnectedPlayerBar/ConnectedPlayerBar.test-wrapper';
import { LyricsProviderBuilder } from '../../test/builders/LyricsProviderBuilder';
import { createQueueItem } from '../../test/fixtures/queue';
import { PluginsWrapper } from '../Plugins/Plugins.test-wrapper';
import { LyricsWrapper } from './Lyrics.test-wrapper';

window.scrollTo = vi.fn();

describe('Lyrics view', () => {
  beforeEach(() => {
    LyricsWrapper.reset();
  });

  it('loads the lyrics of the new track when the track changes', async () => {
    LyricsWrapper.setQueue(
      createQueueItem('Lorem Ipsum'),
      createQueueItem('Consectetur'),
    );
    LyricsWrapper.registerProvider(
      new LyricsProviderBuilder()
        .withGetCandidatesForTrack(async (track) => [
          { id: track.title, title: track.title, artist: 'Dolor' },
        ])
        .withGetLyricsForCandidate(async (candidate) => ({
          type: 'plain',
          metadata: {},
          sections: [
            {
              label: 'Verse 1',
              lines: [{ segments: [{ text: `Lyrics of ${candidate.id}` }] }],
            },
          ],
        })),
    );
    await LyricsWrapper.mount();
    expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

    await ConnectedPlayerBarWrapper.controls.nextButton.click();

    expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
    expect(LyricsWrapper.sections).toEqual([
      { label: 'Verse 1', lines: ['Lyrics of Consectetur'] },
    ]);
  });

  describe('states', () => {
    it('shows an empty state when nothing is playing', async () => {
      await LyricsWrapper.mount();

      expect(await LyricsWrapper.emptyState.find()).toBeInTheDocument();
      expect(LyricsWrapper.emptyState.title).toBe('Nothing is playing');
      expect(LyricsWrapper.emptyState.description).toBe(
        'Play a track to see its lyrics here.',
      );
    });

    it('shows a loading state while providers are fetching lyrics', async () => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder().withGetCandidatesForTrack(
          () => new Promise(() => {}),
        ),
      );

      await LyricsWrapper.mount();

      expect(LyricsWrapper.loadingState).toBeInTheDocument();
    });

    it('shows "No lyrics plugins installed" with a button that opens the plugin store when no lyrics provider is registered', async () => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.emptyState.find()).toBeInTheDocument();
      expect(LyricsWrapper.emptyState.title).toBe(
        'No lyrics plugins installed',
      );
      expect(LyricsWrapper.emptyState.description).toBe(
        'Install a lyrics plugin to see lyrics for your music.',
      );

      await LyricsWrapper.emptyState.action.click();

      expect(PluginsWrapper.selectedTab).toBe('Store');
    });
    it('shows "No lyrics for this track" and lists providers without results', async () => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder().withId('alpha').withName('Alpha Lyrics'),
      );
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder().withId('beta').withName('Beta Lyrics'),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.emptyState.find()).toBeInTheDocument();
      expect(LyricsWrapper.emptyState.title).toBe('No lyrics for this track');
      expect(LyricsWrapper.emptyState.description).toBe(
        'Alpha Lyrics and Beta Lyrics returned no results.',
      );
    });

    it('shows "Instrumental" for instrumental tracks', async () => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({ type: 'instrumental', metadata: {} }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.emptyState.find()).toBeInTheDocument();
      expect(LyricsWrapper.emptyState.title).toBe('Instrumental');
      expect(LyricsWrapper.emptyState.description).toBe(
        'This track has no lyrics.',
      );
    });
  });

  describe('plain lyrics', () => {
    beforeEach(() => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'plain',
            metadata: {},
            sections: [
              {
                label: 'Verse 1',
                lines: [
                  { segments: [{ text: 'Lorem ipsum dolor' }] },
                  { segments: [{ text: 'Sit amet' }] },
                ],
              },
              {
                label: 'Chorus',
                lines: [{ segments: [{ text: 'Consectetur adipiscing' }] }],
              },
            ],
          }),
      );
    });

    it('shows the loaded lyrics', async () => {
      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.sections).toEqual([
        { label: 'Verse 1', lines: ['Lorem ipsum dolor', 'Sit amet'] },
        { label: 'Chorus', lines: ['Consectetur adipiscing'] },
      ]);
    });

    it("doesn't show offset controls", async () => {
      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.offsetControls).not.toBeInTheDocument();
    });
  });

  describe('line synced lyrics', () => {
    beforeEach(() => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'lineSynced',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    startMs: 0,
                    endMs: 4000,
                    segments: [{ text: 'Lorem ipsum dolor' }],
                  },
                  {
                    startMs: 4000,
                    endMs: 8000,
                    segments: [{ text: 'Sit amet' }],
                  },
                  {
                    startMs: 8000,
                    endMs: 12000,
                    segments: [{ text: 'Consectetur adipiscing' }],
                  },
                ],
              },
            ],
          }),
      );
    });

    it('highlights the line at the current timestamp', async () => {
      LyricsWrapper.setPlaybackPosition(5);

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.syncedLines).toEqual([
        { text: 'Lorem ipsum dolor', isActive: false },
        { text: 'Sit amet', isActive: true },
        { text: 'Consectetur adipiscing', isActive: false },
      ]);
    });

    it('seeks to the start of a line when clicking it', async () => {
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

      await LyricsWrapper.clickLine('Consectetur adipiscing');

      expect(LyricsWrapper.playbackPosition).toBe(8);
    });

    it('changes the highlighted line when offset changes to earlier', async () => {
      LyricsWrapper.setPlaybackPosition(3.95);
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

      await LyricsWrapper.offsetMinus.click();

      expect(LyricsWrapper.syncedLines).toEqual([
        { text: 'Lorem ipsum dolor', isActive: false },
        { text: 'Sit amet', isActive: true },
        { text: 'Consectetur adipiscing', isActive: false },
      ]);
    });

    it('changes the highlighted line when offset changes to later', async () => {
      LyricsWrapper.setPlaybackPosition(4.05);
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

      await LyricsWrapper.offsetPlus.click();

      expect(LyricsWrapper.syncedLines).toEqual([
        { text: 'Lorem ipsum dolor', isActive: true },
        { text: 'Sit amet', isActive: false },
        { text: 'Consectetur adipiscing', isActive: false },
      ]);
    });
  });

  describe('word synced lyrics', () => {
    beforeEach(() => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'wordSynced',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    startMs: 0,
                    endMs: 2000,
                    segments: [
                      { text: 'Lorem ', startMs: 0, endMs: 500 },
                      { text: 'ipsum ', startMs: 500, endMs: 1000 },
                      { text: 'dolor', startMs: 1000, endMs: 2000 },
                    ],
                  },
                  {
                    startMs: 2000,
                    endMs: 4000,
                    segments: [
                      { text: 'Sit ', startMs: 2000, endMs: 3000 },
                      { text: 'amet', startMs: 3000, endMs: 4000 },
                    ],
                  },
                ],
              },
            ],
          }),
      );
    });

    it('highlights the words up to the current timestamp', async () => {
      LyricsWrapper.setPlaybackPosition(0.75);

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.syncedWords).toEqual([
        { text: 'Lorem ', isActive: true },
        { text: 'ipsum ', isActive: true },
        { text: 'dolor', isActive: false },
      ]);
    });

    it('changes the highlighted word when offset changes to earlier', async () => {
      LyricsWrapper.setPlaybackPosition(0.95);
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

      await LyricsWrapper.offsetMinus.click();

      expect(LyricsWrapper.syncedWords).toEqual([
        { text: 'Lorem ', isActive: true },
        { text: 'ipsum ', isActive: true },
        { text: 'dolor', isActive: true },
      ]);
    });

    it('changes the highlighted word when offset changes to later', async () => {
      LyricsWrapper.setPlaybackPosition(1.05);
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

      await LyricsWrapper.offsetPlus.click();

      expect(LyricsWrapper.syncedWords).toEqual([
        { text: 'Lorem ', isActive: true },
        { text: 'ipsum ', isActive: true },
        { text: 'dolor', isActive: false },
      ]);
    });
  });

  describe('furigana', () => {
    beforeEach(() => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
    });

    it('shows furigana in plain lyrics', async () => {
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'plain',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    segments: [
                      { text: '夜', ruby: 'よる' },
                      { text: 'に' },
                      { text: '駆', ruby: 'か' },
                      { text: 'ける' },
                    ],
                  },
                ],
              },
            ],
          }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.furigana).toEqual([
        { text: '夜', reading: 'よる' },
        { text: '駆', reading: 'か' },
      ]);
    });

    it('shows furigana in line synced lyrics', async () => {
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'lineSynced',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    startMs: 0,
                    endMs: 4000,
                    segments: [
                      { text: '夜', ruby: 'よる' },
                      { text: 'に' },
                      { text: '駆', ruby: 'か' },
                      { text: 'ける' },
                    ],
                  },
                ],
              },
            ],
          }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.furigana).toEqual([
        { text: '夜', reading: 'よる' },
        { text: '駆', reading: 'か' },
      ]);
    });

    it('shows furigana in word synced lyrics', async () => {
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'wordSynced',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    startMs: 0,
                    endMs: 4000,
                    segments: [
                      { text: '夜', ruby: 'よる', startMs: 0, endMs: 1000 },
                      { text: 'に', startMs: 1000, endMs: 2000 },
                      { text: '駆', ruby: 'か', startMs: 2000, endMs: 3000 },
                      { text: 'ける', startMs: 3000, endMs: 4000 },
                    ],
                  },
                ],
              },
            ],
          }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.furigana).toEqual([
        { text: '夜', reading: 'よる' },
        { text: '駆', reading: 'か' },
      ]);
    });
  });

  describe('annotations', () => {
    beforeEach(() => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
    });

    it('shows translations and romanizations in plain lyrics', async () => {
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'plain',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    segments: [{ text: '夜に駆ける' }],
                    annotations: [
                      {
                        type: 'romanization',
                        language: 'ja-Latn',
                        text: 'Yoru ni kakeru',
                      },
                      {
                        type: 'translation',
                        language: 'en',
                        text: 'Racing into the night',
                      },
                    ],
                  },
                ],
              },
            ],
          }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.annotations).toEqual([
        {
          type: 'romanization',
          language: 'ja-Latn',
          text: 'Yoru ni kakeru',
        },
        { type: 'translation', language: 'en', text: 'Racing into the night' },
      ]);
    });

    it('shows translations and romanizations in synced lyrics', async () => {
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'lineSynced',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    startMs: 0,
                    endMs: 4000,
                    segments: [{ text: '夜に駆ける' }],
                    annotations: [
                      {
                        type: 'romanization',
                        language: 'ja-Latn',
                        text: 'Yoru ni kakeru',
                      },
                      {
                        type: 'translation',
                        language: 'en',
                        text: 'Racing into the night',
                      },
                    ],
                  },
                ],
              },
            ],
          }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.annotations).toEqual([
        {
          type: 'romanization',
          language: 'ja-Latn',
          text: 'Yoru ni kakeru',
        },
        { type: 'translation', language: 'en', text: 'Racing into the night' },
      ]);
    });
  });

  describe('background vocals', () => {
    beforeEach(() => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
    });

    it('shows background vocals in plain lyrics', async () => {
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'plain',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    segments: [{ text: 'Lorem ipsum dolor' }],
                    background: [{ text: 'Sit amet' }],
                  },
                ],
              },
            ],
          }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.backgroundVocals).toEqual(['(Sit amet)']);
    });

    it('shows background vocals in synced lyrics', async () => {
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'lineSynced',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    startMs: 0,
                    endMs: 4000,
                    segments: [{ text: 'Lorem ipsum dolor' }],
                    background: [{ text: 'Sit amet' }],
                  },
                ],
              },
            ],
          }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.backgroundVocals).toEqual(['(Sit amet)']);
    });
  });

  describe('vocalists', () => {
    it('shows who sings each section of plain lyrics', async () => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'plain',
            metadata: {
              vocalists: [
                { id: 'lorem', name: 'Lorem', type: 'person' },
                { id: 'ipsum', name: 'Ipsum', type: 'person' },
              ],
            },
            sections: [
              {
                label: 'Verse 1',
                lines: [
                  {
                    segments: [{ text: 'Dolor sit amet' }],
                    vocalistIds: ['lorem'],
                  },
                ],
              },
              {
                label: 'Chorus',
                lines: [
                  {
                    segments: [{ text: 'Consectetur adipiscing' }],
                    vocalistIds: ['lorem', 'ipsum'],
                  },
                ],
              },
            ],
          }),
      );

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.sections).toEqual([
        { label: 'Verse 1 - Lorem', lines: ['Dolor sit amet'] },
        { label: 'Chorus - Lorem - Ipsum', lines: ['Consectetur adipiscing'] },
      ]);
    });
  });

  describe('source picker', () => {
    beforeEach(() => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withId('alpha')
          .withName('Alpha Lyrics')
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'plain',
            metadata: {},
            sections: [
              {
                label: 'Verse 1',
                lines: [{ segments: [{ text: 'Lorem ipsum dolor' }] }],
              },
            ],
          }),
      );
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withId('beta')
          .withName('Beta Lyrics')
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'lineSynced',
            metadata: {},
            sections: [
              {
                lines: [
                  {
                    startMs: 0,
                    endMs: 4000,
                    segments: [{ text: 'Sit amet' }],
                  },
                ],
              },
            ],
          }),
      );
    });

    it('shows the top lyrics by default', async () => {
      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.sourcePicker.selected()).toBe('Beta Lyrics');
      expect(LyricsWrapper.syncedLines).toEqual([
        { text: 'Sit amet', isActive: true },
      ]);
    });

    it('lists lyrics from all providers', async () => {
      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(await LyricsWrapper.sourcePicker.availableOptions()).toEqual([
        'Beta Lyrics',
        'Alpha Lyrics',
      ]);
    });

    it('shows lyrics from the picked provider', async () => {
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

      await LyricsWrapper.sourcePicker.select('Alpha Lyrics');

      expect(LyricsWrapper.sections).toEqual([
        { label: 'Verse 1', lines: ['Lorem ipsum dolor'] },
      ]);
    });

    it('goes back to the top lyrics when the track changes', async () => {
      LyricsWrapper.setQueue(
        createQueueItem('Lorem Ipsum'),
        createQueueItem('Consectetur'),
      );
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      await LyricsWrapper.sourcePicker.select('Alpha Lyrics');

      await ConnectedPlayerBarWrapper.controls.nextButton.click();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.sourcePicker.selected()).toBe('Beta Lyrics');
    });
  });

  describe('text size', () => {
    beforeEach(() => {
      LyricsWrapper.setQueue(createQueueItem('Lorem Ipsum'));
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder()
          .withCandidates({
            id: 'lorem-ipsum',
            title: 'Lorem Ipsum',
            artist: 'Dolor',
          })
          .withLyrics({
            type: 'plain',
            metadata: {},
            sections: [
              {
                label: 'Verse 1',
                lines: [{ segments: [{ text: 'Lorem ipsum dolor' }] }],
              },
            ],
          }),
      );
    });

    it('makes text smaller', async () => {
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

      await LyricsWrapper.textSizeMinus.click();

      expect(LyricsWrapper.textSize).toBe('small');
    });

    it('makes text larger', async () => {
      await LyricsWrapper.mount();
      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();

      await LyricsWrapper.textSizePlus.click();

      expect(LyricsWrapper.textSize).toBe('large');
    });

    it('disables "Smaller lyrics" at the smallest size', async () => {
      LyricsWrapper.setTextSize('small');

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.textSizeMinus.element).toBeDisabled();
    });

    it('disables "Larger lyrics" at the largest size', async () => {
      LyricsWrapper.setTextSize('large');

      await LyricsWrapper.mount();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.textSizePlus.element).toBeDisabled();
    });
  });
});
