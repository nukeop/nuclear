import { render } from '@testing-library/react';

import { DayOfWeekChart } from './DayOfWeekChart';
import type { DayOfWeekChartLabels } from './types';

const labels: DayOfWeekChartLabels = {
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

describe('DayOfWeekChart', () => {
  it('(Snapshot) renders a week of listening data', () => {
    const { container } = render(
      <DayOfWeekChart
        values={[
          3_600_000, 7_200_000, 1_800_000, 0, 5_400_000, 10_800_000, 9_000_000,
        ]}
        labels={labels}
        formatValue={(value) => `${value / 60_000}m`}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
