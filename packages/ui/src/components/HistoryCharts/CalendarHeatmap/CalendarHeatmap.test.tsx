import { render, screen } from '@testing-library/react';

import { CalendarHeatmap } from './CalendarHeatmap';
import type { CalendarHeatmapDay, CalendarHeatmapLabels } from './types';

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

const days: CalendarHeatmapDay[] = [
  { date: '2026-03-01', value: 0 },
  { date: '2026-03-10', value: 7_200_000 },
  { date: '2026-03-15', value: 1_800_000 },
  { date: '2026-03-31', value: 3_600_000 },
];

const renderHeatmap = (days: CalendarHeatmapDay[]) =>
  render(
    <CalendarHeatmap
      days={days}
      labels={labels}
      formatValue={(value) => `${value / 60_000}m`}
      formatDate={(date) => date}
      emptyState={<div data-testid="fake-empty-state">Nothing yet</div>}
    />,
  );

describe('CalendarHeatmap', () => {
  it('(Snapshot) renders a month of listening data', () => {
    const { container } = renderHeatmap(days);
    expect(container).toMatchSnapshot();
  });

  it('renders the empty state when all days have zero listening time', () => {
    renderHeatmap([
      { date: '2026-03-01', value: 0 },
      { date: '2026-03-31', value: 0 },
    ]);
    expect(screen.getByTestId('fake-empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('calendar-heatmap')).toBeNull();
  });

  it('assigns the darkest color level to the busiest day', () => {
    renderHeatmap(days);
    expect(
      screen.getByTestId('calendar-heatmap-day-2026-03-10'),
    ).toHaveAttribute('data-level', '4');
  });
});
