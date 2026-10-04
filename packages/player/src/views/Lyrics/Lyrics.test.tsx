import { act } from '@testing-library/react';

import { ConnectedPlayerBarWrapper } from '../../components/ConnectedPlayerBar/ConnectedPlayerBar.test-wrapper';
import { QueueWrapper } from '../../integration-tests/Queue.test-wrapper';
import {
  LineSyncedLyricsBuilder,
  PlainLyricsBuilder,
  WordSyncedLyricsBuilder,
} from '../../test/builders/LyricsBuilders';
import { LyricsProviderBuilder } from '../../test/builders/LyricsProviderBuilder';
import { createQueueItem } from '../../test/fixtures/queue';
import { PluginsWrapper } from '../Plugins/Plugins.test-wrapper';
import { LyricsWrapper } from './Lyrics.test-wrapper';

describe('Lyrics view', () => {
  beforeEach(() => {
    LyricsWrapper.reset();
    QueueWrapper.initQueue([]);
    ConnectedPlayerBarWrapper.setPlaybackPosition(0);
  });

  it('loads the lyrics of the new track when the track changes', async () => {
    QueueWrapper.initQueue([
      createQueueItem('Lorem Ipsum'),
      createQueueItem('Consectetur'),
    ]);
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
    await LyricsWrapper.mountLyrics();

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
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerProvider(
        new LyricsProviderBuilder().withGetCandidatesForTrack(
          () => new Promise(() => {}),
        ),
      );

      await LyricsWrapper.mount();

      expect(LyricsWrapper.loadingState).toBeInTheDocument();
    });

    it('shows "No lyrics plugins installed" with a button that opens the plugin store when no lyrics provider is registered', async () => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);

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
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
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
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerLyrics({ type: 'instrumental', metadata: {} });

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
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerLyrics(
        new PlainLyricsBuilder()
          .withSection('Verse 1')
          .withLine('Lorem ipsum dolor')
          .withLine('Sit amet')
          .withSection('Chorus')
          .withLine('Consectetur adipiscing')
          .build(),
      );
    });

    it('shows the loaded lyrics', async () => {
      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.sections).toEqual([
        { label: 'Verse 1', lines: ['Lorem ipsum dolor', 'Sit amet'] },
        { label: 'Chorus', lines: ['Consectetur adipiscing'] },
      ]);
    });

    it("doesn't show offset controls", async () => {
      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.offsetControls).not.toBeInTheDocument();
    });

    it("doesn't show the auto-scroll toggle", async () => {
      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.autoScrollToggle.exists).toBe(false);
    });
  });

  describe('line synced lyrics', () => {
    beforeEach(() => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder()
          .withLine(0, 4000, 'Lorem ipsum dolor')
          .withLine(4000, 8000, 'Sit amet')
          .withLine(8000, 12000, 'Consectetur adipiscing')
          .build(),
      );
    });

    it('highlights the line at the current timestamp', async () => {
      ConnectedPlayerBarWrapper.setPlaybackPosition(5);

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.syncedLines).toEqual([
        { text: 'Lorem ipsum dolor', isActive: false },
        { text: 'Sit amet', isActive: true },
        { text: 'Consectetur adipiscing', isActive: false },
      ]);
    });

    it('seeks to the start of a line when clicking it', async () => {
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.clickLine('Consectetur adipiscing');

      expect(ConnectedPlayerBarWrapper.playbackPosition).toBe(8);
    });

    it('changes the highlighted line when offset changes to earlier', async () => {
      ConnectedPlayerBarWrapper.setPlaybackPosition(3.95);
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.offsetMinus.click();

      expect(LyricsWrapper.syncedLines).toEqual([
        { text: 'Lorem ipsum dolor', isActive: false },
        { text: 'Sit amet', isActive: true },
        { text: 'Consectetur adipiscing', isActive: false },
      ]);
    });

    it('changes the highlighted line when offset changes to later', async () => {
      ConnectedPlayerBarWrapper.setPlaybackPosition(4.05);
      await LyricsWrapper.mountLyrics();

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
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerLyrics(
        new WordSyncedLyricsBuilder()
          .withCustomLine({
            startMs: 0,
            endMs: 2000,
            segments: [
              { text: 'Lorem ', startMs: 0, endMs: 500 },
              { text: 'ipsum ', startMs: 500, endMs: 1000 },
              { text: 'dolor', startMs: 1000, endMs: 2000 },
            ],
          })
          .withCustomLine({
            startMs: 2000,
            endMs: 4000,
            segments: [
              { text: 'Sit ', startMs: 2000, endMs: 3000 },
              { text: 'amet', startMs: 3000, endMs: 4000 },
            ],
          })
          .build(),
      );
    });

    it('highlights the words up to the current timestamp', async () => {
      ConnectedPlayerBarWrapper.setPlaybackPosition(0.75);

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.syncedWords).toEqual([
        { text: 'Lorem ', isActive: true },
        { text: 'ipsum ', isActive: true },
        { text: 'dolor', isActive: false },
      ]);
    });

    describe('while playing', () => {
      beforeEach(() => {
        vi.useFakeTimers({
          toFake: [
            'requestAnimationFrame',
            'cancelAnimationFrame',
            'performance',
          ],
        });
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('keeps highlighting words between playback position updates', async () => {
        ConnectedPlayerBarWrapper.setPlaybackPosition(0.95);
        await LyricsWrapper.mountLyrics();
        await ConnectedPlayerBarWrapper.controls.playButton.click();

        await act(async () => {
          vi.advanceTimersByTime(100);
        });

        expect(LyricsWrapper.syncedWords).toEqual([
          { text: 'Lorem ', isActive: true },
          { text: 'ipsum ', isActive: true },
          { text: 'dolor', isActive: true },
        ]);
      });
    });

    it('changes the highlighted word when offset changes to earlier', async () => {
      ConnectedPlayerBarWrapper.setPlaybackPosition(0.95);
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.offsetMinus.click();

      expect(LyricsWrapper.syncedWords).toEqual([
        { text: 'Lorem ', isActive: true },
        { text: 'ipsum ', isActive: true },
        { text: 'dolor', isActive: true },
      ]);
    });

    it('changes the highlighted word when offset changes to later', async () => {
      ConnectedPlayerBarWrapper.setPlaybackPosition(1.05);
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.offsetPlus.click();

      expect(LyricsWrapper.syncedWords).toEqual([
        { text: 'Lorem ', isActive: true },
        { text: 'ipsum ', isActive: true },
        { text: 'dolor', isActive: false },
      ]);
    });
  });

  describe('instrumental breaks', () => {
    beforeEach(() => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
    });

    describe('between lines 5 seconds apart', () => {
      beforeEach(() => {
        LyricsWrapper.registerLyrics(
          new LineSyncedLyricsBuilder()
            .withLine(0, 4000, 'Lorem ipsum dolor')
            .withLine(9000, 13000, 'Sit amet')
            .build(),
        );
      });

      it('shows an instrumental break between lines that are 5 seconds or more apart', async () => {
        ConnectedPlayerBarWrapper.setPlaybackPosition(6);

        await LyricsWrapper.mountLyrics();

        expect(LyricsWrapper.syncedRows).toEqual([
          { type: 'line', text: 'Lorem ipsum dolor', isActive: false },
          { type: 'break', isActive: true },
          { type: 'line', text: 'Sit amet', isActive: false },
        ]);
      });

      it("doesn't highlight the break before the previous line ends", async () => {
        ConnectedPlayerBarWrapper.setPlaybackPosition(3.95);

        await LyricsWrapper.mountLyrics();

        expect(LyricsWrapper.syncedRows).toEqual([
          { type: 'line', text: 'Lorem ipsum dolor', isActive: true },
          { type: 'break', isActive: false },
          { type: 'line', text: 'Sit amet', isActive: false },
        ]);
      });

      it("doesn't highlight the break once the next line starts", async () => {
        ConnectedPlayerBarWrapper.setPlaybackPosition(9.05);

        await LyricsWrapper.mountLyrics();

        expect(LyricsWrapper.syncedRows).toEqual([
          { type: 'line', text: 'Lorem ipsum dolor', isActive: false },
          { type: 'break', isActive: false },
          { type: 'line', text: 'Sit amet', isActive: true },
        ]);
      });
    });

    it('shows an instrumental break before the first line when it starts 5 seconds or more into the track', async () => {
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder()
          .withLine(5000, 9000, 'Lorem ipsum dolor')
          .build(),
      );
      ConnectedPlayerBarWrapper.setPlaybackPosition(3);

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.syncedRows).toEqual([
        { type: 'break', isActive: true },
        { type: 'line', text: 'Lorem ipsum dolor', isActive: false },
      ]);
    });

    it("doesn't show an instrumental break before the first line when it starts less than 5 seconds into the track", async () => {
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder()
          .withLine(4900, 9000, 'Lorem ipsum dolor')
          .build(),
      );
      ConnectedPlayerBarWrapper.setPlaybackPosition(3);

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.syncedRows).toEqual([
        { type: 'line', text: 'Lorem ipsum dolor', isActive: false },
      ]);
    });

    it("doesn't show an instrumental break between lines less than 5 seconds apart", async () => {
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder()
          .withLine(0, 4000, 'Lorem ipsum dolor')
          .withLine(8900, 12900, 'Sit amet')
          .build(),
      );
      ConnectedPlayerBarWrapper.setPlaybackPosition(6);

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.syncedRows).toEqual([
        { type: 'line', text: 'Lorem ipsum dolor', isActive: false },
        { type: 'line', text: 'Sit amet', isActive: false },
      ]);
    });

    it('shows instrumental breaks in word synced lyrics', async () => {
      LyricsWrapper.registerLyrics(
        new WordSyncedLyricsBuilder()
          .withCustomLine({
            startMs: 0,
            endMs: 4000,
            segments: [
              { text: 'Lorem ', startMs: 0, endMs: 2000 },
              { text: 'ipsum', startMs: 2000, endMs: 4000 },
            ],
          })
          .withCustomLine({
            startMs: 9000,
            endMs: 13000,
            segments: [
              { text: 'Sit ', startMs: 9000, endMs: 11000 },
              { text: 'amet', startMs: 11000, endMs: 13000 },
            ],
          })
          .build(),
      );
      ConnectedPlayerBarWrapper.setPlaybackPosition(6);

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.syncedRows).toEqual([
        { type: 'line', text: 'Lorem ipsum', isActive: false },
        { type: 'break', isActive: true },
        { type: 'line', text: 'Sit amet', isActive: false },
      ]);
    });
  });

  describe('auto-scroll', () => {
    beforeEach(() => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder()
          .withLine(0, 4000, 'Lorem ipsum dolor')
          .withLine(4000, 8000, 'Sit amet')
          .withLine(8000, 12000, 'Consectetur adipiscing')
          .build(),
      );
    });

    it('is on by default', async () => {
      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.autoScrollToggle.isOn).toBe(true);
    });

    it('turns auto-scroll off', async () => {
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.autoScrollToggle.click();

      expect(LyricsWrapper.autoScrollToggle.isOn).toBe(false);
      expect(LyricsWrapper.autoScroll).toBe(false);
    });

    it('turns auto-scroll on', async () => {
      LyricsWrapper.setAutoScroll(false);
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.autoScrollToggle.click();

      expect(LyricsWrapper.autoScrollToggle.isOn).toBe(true);
      expect(LyricsWrapper.autoScroll).toBe(true);
    });

    it('scrolls to the current line when auto-scroll is turned on', async () => {
      LyricsWrapper.setAutoScroll(false);
      ConnectedPlayerBarWrapper.setPlaybackPosition(5);
      await LyricsWrapper.mountLyrics();
      LyricsWrapper.layOutLyrics();

      await LyricsWrapper.autoScrollToggle.click();

      expect(LyricsWrapper.scrollPosition).toBe(100);
    });

    describe('current line button', () => {
      it('shows the current line button when the current line is out of view', async () => {
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();

        LyricsWrapper.scrollTo(200);

        expect(LyricsWrapper.currentLineButton.exists).toBe(true);
      });

      it('hides the current line button after scrolling back to the current line', async () => {
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();
        LyricsWrapper.scrollTo(200);

        LyricsWrapper.scrollTo(0);

        expect(LyricsWrapper.currentLineButton.exists).toBe(false);
      });

      it('points up when the current line is above the view', async () => {
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();

        LyricsWrapper.scrollTo(200);

        expect(LyricsWrapper.currentLineButton.direction).toBe('up');
      });

      it('points down when the current line is below the view', async () => {
        LyricsWrapper.setAutoScroll(false);
        ConnectedPlayerBarWrapper.setPlaybackPosition(9);
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();

        LyricsWrapper.scrollTo(0);

        expect(LyricsWrapper.currentLineButton.direction).toBe('down');
      });

      it('brings you to the current line when auto-scroll is on', async () => {
        ConnectedPlayerBarWrapper.setPlaybackPosition(5);
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();
        LyricsWrapper.scrollTo(250);

        await LyricsWrapper.currentLineButton.click();

        expect(LyricsWrapper.scrollPosition).toBe(100);
      });

      it('brings you to the current line when auto-scroll is off', async () => {
        LyricsWrapper.setAutoScroll(false);
        ConnectedPlayerBarWrapper.setPlaybackPosition(5);
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();
        LyricsWrapper.scrollTo(250);

        await LyricsWrapper.currentLineButton.click();

        expect(LyricsWrapper.scrollPosition).toBe(100);
      });
    });

    describe('during playback', () => {
      beforeEach(() => {
        vi.useFakeTimers({
          toFake: [
            'requestAnimationFrame',
            'cancelAnimationFrame',
            'performance',
          ],
        });
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('follows the active line', async () => {
        ConnectedPlayerBarWrapper.setPlaybackPosition(3.9);
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();
        await ConnectedPlayerBarWrapper.controls.playButton.click();

        await act(async () => {
          vi.advanceTimersByTime(200);
        });

        expect(LyricsWrapper.scrollPosition).toBe(100);
      });

      it('follows the active line after scrolling away', async () => {
        ConnectedPlayerBarWrapper.setPlaybackPosition(3.9);
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();
        LyricsWrapper.scrollTo(200);
        await ConnectedPlayerBarWrapper.controls.playButton.click();

        await act(async () => {
          vi.advanceTimersByTime(200);
        });

        expect(LyricsWrapper.scrollPosition).toBe(100);
      });

      it("doesn't follow the active line when auto-scroll is off", async () => {
        ConnectedPlayerBarWrapper.setPlaybackPosition(3.9);
        await LyricsWrapper.mountLyrics();
        LyricsWrapper.layOutLyrics();
        await LyricsWrapper.autoScrollToggle.click();
        await ConnectedPlayerBarWrapper.controls.playButton.click();

        await act(async () => {
          vi.advanceTimersByTime(200);
        });

        expect(LyricsWrapper.scrollPosition).toBe(0);
      });
    });
  });

  describe('furigana', () => {
    beforeEach(() => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
    });

    it('shows furigana in plain lyrics', async () => {
      LyricsWrapper.registerLyrics(
        new PlainLyricsBuilder()
          .withCustomLine({
            segments: [
              { text: '夜', ruby: 'よる' },
              { text: 'に' },
              { text: '駆', ruby: 'か' },
              { text: 'ける' },
            ],
          })
          .build(),
      );

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.furigana).toEqual([
        { text: '夜', reading: 'よる' },
        { text: '駆', reading: 'か' },
      ]);
    });

    it('shows furigana in line synced lyrics', async () => {
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder()
          .withCustomLine({
            startMs: 0,
            endMs: 4000,
            segments: [
              { text: '夜', ruby: 'よる' },
              { text: 'に' },
              { text: '駆', ruby: 'か' },
              { text: 'ける' },
            ],
          })
          .build(),
      );

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.furigana).toEqual([
        { text: '夜', reading: 'よる' },
        { text: '駆', reading: 'か' },
      ]);
    });

    it('shows furigana in word synced lyrics', async () => {
      LyricsWrapper.registerLyrics(
        new WordSyncedLyricsBuilder()
          .withCustomLine({
            startMs: 0,
            endMs: 4000,
            segments: [
              { text: '夜', ruby: 'よる', startMs: 0, endMs: 1000 },
              { text: 'に', startMs: 1000, endMs: 2000 },
              { text: '駆', ruby: 'か', startMs: 2000, endMs: 3000 },
              { text: 'ける', startMs: 3000, endMs: 4000 },
            ],
          })
          .build(),
      );

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.furigana).toEqual([
        { text: '夜', reading: 'よる' },
        { text: '駆', reading: 'か' },
      ]);
    });
  });

  describe('annotations', () => {
    beforeEach(() => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
    });

    it('shows translations and romanizations in plain lyrics', async () => {
      LyricsWrapper.registerLyrics(
        new PlainLyricsBuilder()
          .withCustomLine({
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
          })
          .build(),
      );

      await LyricsWrapper.mountLyrics();

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
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder()
          .withCustomLine({
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
          })
          .build(),
      );

      await LyricsWrapper.mountLyrics();

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
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
    });

    it('shows background vocals in plain lyrics', async () => {
      LyricsWrapper.registerLyrics(
        new PlainLyricsBuilder()
          .withCustomLine({
            segments: [{ text: 'Lorem ipsum dolor' }],
            background: [{ text: 'Sit amet' }],
          })
          .build(),
      );

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.backgroundVocals).toEqual(['(Sit amet)']);
    });

    it('shows background vocals in synced lyrics', async () => {
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder()
          .withCustomLine({
            startMs: 0,
            endMs: 4000,
            segments: [{ text: 'Lorem ipsum dolor' }],
            background: [{ text: 'Sit amet' }],
          })
          .build(),
      );

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.backgroundVocals).toEqual(['(Sit amet)']);
    });
  });

  describe('vocalists', () => {
    it('shows who sings each section of plain lyrics', async () => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerLyrics(
        new PlainLyricsBuilder()
          .withVocalists(
            { id: 'lorem', name: 'Lorem', type: 'person' },
            { id: 'ipsum', name: 'Ipsum', type: 'person' },
          )
          .withSection('Verse 1')
          .withCustomLine({
            segments: [{ text: 'Dolor sit amet' }],
            vocalistIds: ['lorem'],
          })
          .withSection('Chorus')
          .withCustomLine({
            segments: [{ text: 'Consectetur adipiscing' }],
            vocalistIds: ['lorem', 'ipsum'],
          })
          .build(),
      );

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.sections).toEqual([
        { label: 'Verse 1 - Lorem', lines: ['Dolor sit amet'] },
        { label: 'Chorus - Lorem - Ipsum', lines: ['Consectetur adipiscing'] },
      ]);
    });
  });

  describe('source picker', () => {
    beforeEach(() => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerLyrics(
        new PlainLyricsBuilder()
          .withSection('Verse 1')
          .withLine('Lorem ipsum dolor')
          .build(),
        { id: 'alpha', name: 'Alpha Lyrics' },
      );
      LyricsWrapper.registerLyrics(
        new LineSyncedLyricsBuilder().withLine(0, 4000, 'Sit amet').build(),
        { id: 'beta', name: 'Beta Lyrics' },
      );
    });

    it('shows the top lyrics by default', async () => {
      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.sourcePicker.selected()).toBe('Beta Lyrics');
      expect(LyricsWrapper.syncedLines).toEqual([
        { text: 'Sit amet', isActive: true },
      ]);
    });

    it('lists lyrics from all providers', async () => {
      await LyricsWrapper.mountLyrics();

      expect(await LyricsWrapper.sourcePicker.availableOptions()).toEqual([
        'Beta Lyrics',
        'Alpha Lyrics',
      ]);
    });

    it('shows lyrics from the picked provider', async () => {
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.sourcePicker.select('Alpha Lyrics');

      expect(LyricsWrapper.sections).toEqual([
        { label: 'Verse 1', lines: ['Lorem ipsum dolor'] },
      ]);
    });

    it('goes back to the top lyrics when the track changes', async () => {
      QueueWrapper.initQueue([
        createQueueItem('Lorem Ipsum'),
        createQueueItem('Consectetur'),
      ]);
      await LyricsWrapper.mountLyrics();
      await LyricsWrapper.sourcePicker.select('Alpha Lyrics');

      await ConnectedPlayerBarWrapper.controls.nextButton.click();

      expect(await LyricsWrapper.findLyrics()).toBeInTheDocument();
      expect(LyricsWrapper.sourcePicker.selected()).toBe('Beta Lyrics');
    });
  });

  describe('text size', () => {
    beforeEach(() => {
      QueueWrapper.initQueue([createQueueItem('Lorem Ipsum')]);
      LyricsWrapper.registerLyrics(
        new PlainLyricsBuilder()
          .withSection('Verse 1')
          .withLine('Lorem ipsum dolor')
          .build(),
      );
    });

    it('makes text smaller', async () => {
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.textSizeMinus.click();

      expect(LyricsWrapper.textSize).toBe(0);
    });

    it('makes text larger', async () => {
      await LyricsWrapper.mountLyrics();

      await LyricsWrapper.textSizePlus.click();

      expect(LyricsWrapper.textSize).toBe(2);
    });

    it('disables "Smaller lyrics" at the smallest size', async () => {
      LyricsWrapper.setTextSize(0);

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.textSizeMinus.element).toBeDisabled();
    });

    it('disables "Larger lyrics" at the largest size', async () => {
      LyricsWrapper.setTextSize(2);

      await LyricsWrapper.mountLyrics();

      expect(LyricsWrapper.textSizePlus.element).toBeDisabled();
    });
  });
});
