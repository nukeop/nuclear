import { act, render } from '@testing-library/react';

import { DayOfWeekChart } from './DayOfWeekChart';
import type { DayOfWeekChartLabels } from './types';

const labels: DayOfWeekChartLabels = {
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

describe('DayOfWeekChart', () => {
  it('(Snapshot) renders a week of listening data', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <DayOfWeekChart
        values={[
          3_600_000, 7_200_000, 1_800_000, 0, 5_400_000, 10_800_000, 9_000_000,
        ]}
        labels={labels}
        formatValue={(value) => `${value / 60_000}m`}
        data-test-resize-observer-inline-size={600}
        data-test-resize-observer-block-size={320}
      />,
    );

    await act(() => vi.advanceTimersByTimeAsync(5_000));
    vi.useRealTimers();

    expect(container).toMatchSnapshot();
  });
});
