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
    Wrapper.mockHistoryEntries();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the listening clock with busiest hour stats by default', async () => {
    Wrapper.mockHourlyListeningTime(
      fakeHourlyValues({ 9: 1_800_000, 20: 6_600_000 }),
    );
    await Wrapper.mount();

    expect(await Wrapper.stats.clock.find()).toBeInTheDocument();
    expect(Wrapper.stats.busiestHour).toBe('20:00');
    expect(Wrapper.stats.listeningTime).toBe('1h 50m');
  });

  it('requests the selected time range when picked from the dropdown', async () => {
    await Wrapper.mount();

    await Wrapper.stats.rangeSelect.select('Last 7 days');

    expect(Wrapper.stats.requestedRange).toEqual({
      from: Date.parse('2026-07-04T12:00:00Z'),
      to: Date.parse('2026-07-11T12:00:00Z'),
    });
  });

  it('shows an empty state when there is no listening data', async () => {
    await Wrapper.mount();

    expect(await Wrapper.stats.emptyState.find()).toHaveTextContent(
      'No listening data yet',
    );
  });
});
