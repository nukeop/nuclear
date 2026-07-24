import { Meta, StoryObj } from '@storybook/react-vite';

import { DayOfWeekChart, DayOfWeekChartProps } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/HistoryCharts/DayOfWeekChart',
  component: DayOfWeekChart,
  tags: ['autodocs'],
} satisfies Meta<typeof DayOfWeekChart>;

export default meta;

type Story = StoryObj<typeof DayOfWeekChart>;

const sampleProps: DayOfWeekChartProps = {
  values: [
    95 * 60_000,
    60 * 60_000,
    75 * 60_000,
    40 * 60_000,
    120 * 60_000,
    180 * 60_000,
    150 * 60_000,
  ],
  labels: {
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  formatValue: (value) => `${Math.round(value / 60_000)}m`,
};

export const Default: Story = {
  render: () => (
    <div className="bg-background h-80 w-[36rem] rounded-md p-6">
      <DayOfWeekChart {...sampleProps} />
    </div>
  ),
};
