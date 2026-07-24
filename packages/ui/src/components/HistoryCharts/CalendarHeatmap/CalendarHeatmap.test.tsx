import { render } from '@testing-library/react';

import { CalendarHeatmap } from './CalendarHeatmap';
import type { CalendarHeatmapLabels } from './types';

const labels: CalendarHeatmapLabels = {
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  legendLess: 'Less',
  legendMore: 'More',
};

describe('CalendarHeatmap', () => {
  it('(Snapshot) renders a month of listening data', () => {
    const { container } = render(
      <CalendarHeatmap
        days={[
          { date: '2026-03-01', value: 0 },
          { date: '2026-03-10', value: 7_200_000 },
          { date: '2026-03-15', value: 1_800_000 },
          { date: '2026-03-31', value: 3_600_000 },
        ]}
        labels={labels}
        formatValue={(value) => `${value / 60_000}m`}
        formatDate={(date) => date}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
