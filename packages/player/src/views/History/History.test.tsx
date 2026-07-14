import { HistoryEntryBuilder } from '../../test/builders/HistoryEntryBuilder';
import { createHistoryWrapper } from './History.test-wrapper';

const commandMocks = await vi.hoisted(async () => {
  const { TauriCommandMocks } = await import('../../test/utils/commandMocks');
  return new TauriCommandMocks();
});

vi.mock('../../services/tauri/bindings', () => commandMocks.moduleFactory());

const Wrapper = createHistoryWrapper(commandMocks);

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

  it.todo(
    'separates plays with day markers: Today, Yesterday, then calendar dates',
  );

  describe('Pagination', () => {
    it.todo('shows page numbers and highlights the current page');
    it.todo('moves between pages with next and previous');
    it.todo('changes how many plays are shown per page');
    it.todo('hides the pagination controls when all plays fit on one page');
  });

  describe('Row actions', () => {
    it.todo('favorites a track from its history row');
    it.todo('adds a track to the queue from its history row');
    it.todo('plays a track immediately from its history row');
  });
});
