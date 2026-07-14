import { HistoryEntryBuilder } from '../../test/builders/HistoryEntryBuilder';
import { createHistoryWrapper } from './History.test-wrapper';

const commandMocks = await vi.hoisted(async () => {
  const { TauriCommandMocks } = await import('../../test/utils/commandMocks');
  return new TauriCommandMocks();
});

vi.mock('../../services/tauri/bindings', () => commandMocks.moduleFactory());

const Wrapper = createHistoryWrapper(commandMocks);

const TODAY_10_AM = Date.parse('2026-07-11T10:00:00Z');
const MINUTE_MS = 60_000;

const numberedEntries = (count: number) =>
  Array.from({ length: count }, (_, index) =>
    new HistoryEntryBuilder()
      .withTitle(`Track ${index + 1}`)
      .withStartedAt(TODAY_10_AM - index * MINUTE_MS)
      .build(),
  );

describe('Listening history view', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.parse('2026-07-11T12:00:00Z'));
    Wrapper.init();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows an empty state when nothing has been played yet', async () => {
    Wrapper.mockHistoryEntries();
    await Wrapper.mount();

    expect(Wrapper.emptyState).toHaveTextContent('Nothing played yet');
  });

  it('shows recent plays with artwork, title, artist, and start time', async () => {
    Wrapper.mockHistoryEntries(
      new HistoryEntryBuilder()
        .withTitle('Paranoid Android')
        .withArtists(['Radiohead'])
        .withArtworkUrl('https://example.com/ok-computer.jpg')
        .withStartedAt(Date.parse('2026-07-11T11:55:00Z'))
        .build(),
    );
    await Wrapper.mount();

    const row = Wrapper.row(0);
    expect(row.title).toBe('Paranoid Android');
    expect(row.artist).toBe('Radiohead');
    expect(row.artwork).toHaveAttribute(
      'src',
      'https://example.com/ok-computer.jpg',
    );
    expect(row.playedAt).toBe('11:55 AM');
  });

  it('separates plays with day markers: Today, Yesterday, then calendar dates', async () => {
    Wrapper.mockHistoryEntries(
      new HistoryEntryBuilder()
        .withTitle('Airbag')
        .withStartedAt(Date.parse('2026-07-11T09:00:00Z'))
        .build(),
      new HistoryEntryBuilder()
        .withTitle('Karma Police')
        .withStartedAt(Date.parse('2026-07-10T22:00:00Z'))
        .build(),
      new HistoryEntryBuilder()
        .withTitle('Let Down')
        .withStartedAt(Date.parse('2026-07-08T15:00:00Z'))
        .build(),
    );
    await Wrapper.mount();

    expect(Wrapper.dayGroups).toEqual([
      { marker: 'Today', rowTitles: ['Airbag'] },
      { marker: 'Yesterday', rowTitles: ['Karma Police'] },
      { marker: 'July 8, 2026', rowTitles: ['Let Down'] },
    ]);
  });

  describe('Pagination', () => {
    it('shows page numbers and highlights the current page', async () => {
      Wrapper.mockHistoryEntries(...numberedEntries(25));
      await Wrapper.mount();

      expect(Wrapper.pagination.pages).toEqual(['1', '2', '3']);
      expect(Wrapper.pagination.currentPage).toBe('1');
    });

    it('moves between pages with next and previous', async () => {
      Wrapper.mockHistoryEntries(...numberedEntries(25));
      await Wrapper.mount();

      await Wrapper.pagination.next.click();
      expect(Wrapper.row(0).title).toBe('Track 11');
      expect(Wrapper.pagination.currentPage).toBe('2');

      await Wrapper.pagination.previous.click();
      expect(Wrapper.row(0).title).toBe('Track 1');
      expect(Wrapper.pagination.currentPage).toBe('1');
    });

    it('changes how many plays are shown per page', async () => {
      Wrapper.mockHistoryEntries(...numberedEntries(25));
      await Wrapper.mount();

      expect(Wrapper.rows).toHaveLength(10);

      await Wrapper.pageSizeSelect.select('25');
      expect(Wrapper.rows).toHaveLength(25);
    });

    it('hides the pagination controls when all plays fit on one page', async () => {
      Wrapper.mockHistoryEntries(...numberedEntries(3));
      await Wrapper.mount();

      expect(Wrapper.rows).toHaveLength(3);
      expect(Wrapper.pagination.isVisible).toBe(false);
    });
  });

  describe('Row actions', () => {
    it('favorites a track from its history row', async () => {
      Wrapper.mockHistoryEntries(
        new HistoryEntryBuilder().withTitle('Paranoid Android').build(),
      );
      await Wrapper.mount();

      const row = Wrapper.row(0);
      expect(row.favoriteButton.isFavorited).toBe(false);

      await row.favoriteButton.click();

      expect(row.favoriteButton.isFavorited).toBe(true);
    });

    it('adds a track to the queue from its history row', async () => {
      Wrapper.mockHistoryEntries(
        new HistoryEntryBuilder()
          .withTitle('Paranoid Android')
          .withArtists(['Radiohead'])
          .build(),
      );
      await Wrapper.mount();

      await Wrapper.row(0).addToQueueButton.click();

      expect(Wrapper.queue.tracks).toEqual([
        { title: 'Paranoid Android', artist: 'Radiohead' },
      ]);
    });

    it('plays a track immediately from its history row', async () => {
      Wrapper.mockHistoryEntries(
        new HistoryEntryBuilder().withTitle('Paranoid Android').build(),
      );
      await Wrapper.mount();

      await Wrapper.row(0).playButton.click();

      expect(Wrapper.queue.currentTrackTitle).toBe('Paranoid Android');
    });
  });
});
