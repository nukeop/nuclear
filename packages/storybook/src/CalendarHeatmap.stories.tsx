import { Meta, StoryObj } from '@storybook/react-vite';

import { CalendarHeatmap, EmptyState } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/HistoryCharts/CalendarHeatmap',
  component: CalendarHeatmap,
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarHeatmap>;

export default meta;

type Story = StoryObj<typeof CalendarHeatmap>;

export const Default: Story = {
  args: {
    days: [
      { date: '2026-04-02', value: 45 * 60_000 },
      { date: '2026-04-03', value: 120 * 60_000 },
      { date: '2026-04-07', value: 30 * 60_000 },
      { date: '2026-04-11', value: 80 * 60_000 },
      { date: '2026-04-12', value: 95 * 60_000 },
      { date: '2026-04-18', value: 15 * 60_000 },
      { date: '2026-04-25', value: 60 * 60_000 },
      { date: '2026-05-01', value: 150 * 60_000 },
      { date: '2026-05-02', value: 135 * 60_000 },
      { date: '2026-05-03', value: 90 * 60_000 },
      { date: '2026-05-09', value: 20 * 60_000 },
      { date: '2026-05-16', value: 75 * 60_000 },
      { date: '2026-05-23', value: 40 * 60_000 },
      { date: '2026-05-30', value: 110 * 60_000 },
      { date: '2026-06-05', value: 25 * 60_000 },
      { date: '2026-06-06', value: 180 * 60_000 },
      { date: '2026-06-13', value: 55 * 60_000 },
      { date: '2026-06-20', value: 70 * 60_000 },
      { date: '2026-06-27', value: 35 * 60_000 },
      { date: '2026-07-04', value: 100 * 60_000 },
      { date: '2026-07-11', value: 50 * 60_000 },
      { date: '2026-07-18', value: 85 * 60_000 },
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
  },
};

export const Empty: Story = {
  args: {
    days: [
      { date: '2026-05-01', value: 0 },
      { date: '2026-06-15', value: 0 },
      { date: '2026-07-22', value: 0 },
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
    emptyState: (
      <EmptyState
        size="sm"
        title="Nothing played yet"
        description="Your listening calendar will fill in as you play music."
      />
    ),
  },
};
