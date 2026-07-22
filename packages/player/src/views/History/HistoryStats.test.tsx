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
    Wrapper.init();
    Wrapper.mockHistoryEntries();
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

  it('shows an empty state when there is no listening data', async () => {
    await Wrapper.mount();

    expect(await Wrapper.stats.emptyState.find()).toHaveTextContent(
      'No listening data yet',
    );
  });
});
