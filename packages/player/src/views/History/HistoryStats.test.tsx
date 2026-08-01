import times from 'lodash-es/times';

import { createHistoryWrapper } from './History.test-wrapper';

const commandMocks = await vi.hoisted(async () => {
  const { TauriCommandMocks } = await import('../../test/utils/commandMocks');
  return new TauriCommandMocks();
});

vi.mock('../../services/tauri/bindings', () => commandMocks.moduleFactory());

const Wrapper = createHistoryWrapper(commandMocks);

const fakeHourlyValues = (peaks: Record<number, number>) =>
  times(24, (hour) => peaks[hour] ?? 0);

describe('History stats view', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.parse('2026-07-11T12:00:00Z'));
    Wrapper.init();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the listening clock with busiest hour stats by default', async () => {
    Wrapper.mockHourlyListeningTime(
      fakeHourlyValues({ 9: 1_800_000, 20: 7_180_000 }),
    );
    await Wrapper.mount();

    expect(await Wrapper.stats.clock.find()).toBeInTheDocument();
    expect(Wrapper.stats.busiestHour).toBe('8:00 PM');
    expect(Wrapper.stats.listeningTime).toBe('2h');
  });

  it('requests the selected time range when picked from the dropdown', async () => {
    await Wrapper.mount();

    await Wrapper.stats.rangeSelect.select('Last 7 days');

    expect(
      commandMocks.command('historyHourlyListeningTime'),
    ).toHaveBeenCalledWith({
      from: Date.parse('2026-07-05T00:00:00Z'),
      to: Date.parse('2026-07-11T12:00:00Z'),
    });
  });

  it('requests the range starting at the first play timestamp when All time is picked from the dropdown', async () => {
    Wrapper.mockFirstPlayAt(Date.parse('2024-03-02T08:30:00Z'));
    await Wrapper.mount();

    await Wrapper.stats.rangeSelect.select('All time');

    expect(
      commandMocks.command('historyHourlyListeningTime'),
    ).toHaveBeenCalledWith({
      from: Date.parse('2024-03-02T08:30:00Z'),
      to: Date.parse('2026-07-11T12:00:00Z'),
    });
  });

  it('shows only the empty state when there is no listening history at all', async () => {
    Wrapper.mockNoListeningHistory();

    await Wrapper.mount();

    expect(await Wrapper.stats.emptyState.find()).toHaveTextContent(
      'No listening data yet',
    );
  });

  it('hides the range selector, clock, day-of-week chart, and calendar heatmap when there is no listening history at all', async () => {
    Wrapper.mockNoListeningHistory();

    await Wrapper.mount();
    await Wrapper.stats.emptyState.find();

    expect(Wrapper.stats.rangeSelect.element).not.toBeInTheDocument();
    expect(Wrapper.stats.clock.element).not.toBeInTheDocument();
    expect(Wrapper.stats.dayOfWeekChart.element).not.toBeInTheDocument();
    expect(Wrapper.stats.heatmap.element).not.toBeInTheDocument();
    expect(Wrapper.stats.topArtists.element).not.toBeInTheDocument();
    expect(Wrapper.stats.topAlbums.element).not.toBeInTheDocument();
    expect(Wrapper.stats.topTracks.element).not.toBeInTheDocument();
  });

  it('shows the calendar heatmap of daily listening', async () => {
    await Wrapper.mount();

    expect(await Wrapper.stats.heatmap.find()).toBeInTheDocument();
  });

  it('shows the top artists ranked by listening time', async () => {
    Wrapper.mockTopArtists(
      {
        name: 'John Maus',
        artworkUrl: null,
        msPlayed: 6_600_000,
        plays: 31,
      },
      {
        name: 'Ariel Pink',
        artworkUrl: null,
        msPlayed: 1_800_000,
        plays: 12,
      },
    );

    await Wrapper.mount();

    expect(await Wrapper.stats.topArtists.find()).toBeInTheDocument();
    expect(Wrapper.stats.topArtists.rows).toEqual([
      { label: 'John Maus', value: '1h, 50m' },
      { label: 'Ariel Pink', value: '30m' },
    ]);
  });

  it('shows the top albums with their artist ranked by listening time', async () => {
    Wrapper.mockTopAlbums(
      {
        title: 'The Idiot',
        artist: 'Iggy Pop',
        artworkUrl: null,
        msPlayed: 6_600_000,
        plays: 18,
      },
      {
        title: 'Fun House',
        artist: 'The Stooges',
        artworkUrl: null,
        msPlayed: 1_800_000,
        plays: 5,
      },
    );

    await Wrapper.mount();

    expect(await Wrapper.stats.topAlbums.find()).toBeInTheDocument();
    expect(Wrapper.stats.topAlbums.rows).toEqual([
      { label: 'The Idiot', sublabel: 'Iggy Pop', value: '1h, 50m' },
      { label: 'Fun House', sublabel: 'The Stooges', value: '30m' },
    ]);
  });

  it('shows the top tracks with their artists ranked by listening time', async () => {
    Wrapper.mockTopTracks(
      {
        title: 'Fright Night',
        artists: ['Ariel Pink', 'Devin Lynn'],
        artworkUrl: null,
        msPlayed: 6_600_000,
        plays: 27,
      },
      {
        title: 'Believer',
        artists: ['John Maus'],
        artworkUrl: null,
        msPlayed: 1_800_000,
        plays: 9,
      },
    );

    await Wrapper.mount();

    expect(await Wrapper.stats.topTracks.find()).toBeInTheDocument();
    expect(Wrapper.stats.topTracks.rows).toEqual([
      {
        label: 'Fright Night',
        sublabel: 'Ariel Pink, Devin Lynn',
        value: '1h, 50m',
      },
      { label: 'Believer', sublabel: 'John Maus', value: '30m' },
    ]);
  });

  it('hides the top albums list when there are no top albums, while still showing top artists and top tracks', async () => {
    Wrapper.mockTopArtists({
      name: 'John Maus',
      artworkUrl: null,
      msPlayed: 6_600_000,
      plays: 31,
    });
    Wrapper.mockTopTracks({
      title: 'Fright Night',
      artists: ['Ariel Pink'],
      artworkUrl: null,
      msPlayed: 6_600_000,
      plays: 27,
    });

    await Wrapper.mount();

    expect(await Wrapper.stats.topArtists.find()).toBeInTheDocument();
    expect(await Wrapper.stats.topTracks.find()).toBeInTheDocument();
    expect(Wrapper.stats.topAlbums.element).not.toBeInTheDocument();
  });

  it('requests the top lists for the selected time range', async () => {
    await Wrapper.mount();

    await Wrapper.stats.rangeSelect.select('Last 7 days');

    const range = {
      from: Date.parse('2026-07-05T00:00:00Z'),
      to: Date.parse('2026-07-11T12:00:00Z'),
    };
    expect(commandMocks.command('historyTopArtists')).toHaveBeenCalledWith(
      range,
      10,
    );
    expect(commandMocks.command('historyTopAlbums')).toHaveBeenCalledWith(
      range,
      10,
    );
    expect(commandMocks.command('historyTopTracks')).toHaveBeenCalledWith(
      range,
      10,
    );
  });

  it('requests the last 12 months of daily listening for the heatmap', async () => {
    await Wrapper.mount();

    expect(
      commandMocks.command('historyDailyListeningTime'),
    ).toHaveBeenCalledWith({
      from: Date.parse('2025-07-11T12:00:00Z'),
      to: Date.parse('2026-07-11T12:00:00Z'),
    });
  });
});
