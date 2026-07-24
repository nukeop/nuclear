import { Meta, StoryObj } from '@storybook/react-vite';

import { CalendarHeatmap, CalendarHeatmapProps } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/HistoryCharts/CalendarHeatmap',
  component: CalendarHeatmap,
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarHeatmap>;

export default meta;

type Story = StoryObj<typeof CalendarHeatmap>;

const sampleProps: CalendarHeatmapProps = {
  days: [
    { date: '2025-07-26', value: 45 * 60_000 },
    { date: '2025-08-02', value: 120 * 60_000 },
    { date: '2025-08-15', value: 30 * 60_000 },
    { date: '2025-08-23', value: 95 * 60_000 },
    { date: '2025-09-06', value: 80 * 60_000 },
    { date: '2025-09-19', value: 15 * 60_000 },
    { date: '2025-10-04', value: 60 * 60_000 },
    { date: '2025-10-18', value: 150 * 60_000 },
    { date: '2025-10-25', value: 40 * 60_000 },
    { date: '2025-11-08', value: 135 * 60_000 },
    { date: '2025-11-21', value: 20 * 60_000 },
    { date: '2025-12-05', value: 90 * 60_000 },
    { date: '2025-12-24', value: 165 * 60_000 },
    { date: '2025-12-31', value: 180 * 60_000 },
    { date: '2026-01-10', value: 75 * 60_000 },
    { date: '2026-01-24', value: 55 * 60_000 },
    { date: '2026-02-07', value: 110 * 60_000 },
    { date: '2026-02-21', value: 35 * 60_000 },
    { date: '2026-03-07', value: 70 * 60_000 },
    { date: '2026-03-21', value: 125 * 60_000 },
    { date: '2026-04-11', value: 25 * 60_000 },
    { date: '2026-04-25', value: 85 * 60_000 },
    { date: '2026-05-09', value: 50 * 60_000 },
    { date: '2026-05-23', value: 145 * 60_000 },
    { date: '2026-06-06', value: 100 * 60_000 },
    { date: '2026-06-20', value: 65 * 60_000 },
    { date: '2026-07-04', value: 130 * 60_000 },
    { date: '2026-07-18', value: 40 * 60_000 },
    { date: '2026-07-22', value: 140 * 60_000 },
  ],
  labels: {
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
  },
  formatValue: (value) => `${Math.round(value / 60_000)}m`,
  formatDate: (date) => date,
};

export const Default: Story = {
  render: (_, context) => (
    <div className="bg-background w-fit rounded-md p-6">
      <CalendarHeatmap
        {...sampleProps}
        colorScheme={context.globals.theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  ),
};
