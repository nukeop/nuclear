import { Meta, StoryObj } from '@storybook/react-vite';

import { ListeningClock } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/HistoryCharts/ListeningClock',
  component: ListeningClock,
  tags: ['autodocs'],
} satisfies Meta<typeof ListeningClock>;

export default meta;

type Story = StoryObj<typeof ListeningClock>;

export const Default: Story = {
  args: {
    values: [
      45, 30, 12, 0, 0, 0, 0, 5, 18, 25, 20, 32, 40, 28, 22, 35, 48, 55, 70, 85,
      110, 95, 80, 60,
    ],
    labels: {
      busiestHour: 'Busiest hour',
      busiestHourValue: 'Time during busiest hour',
    },
    formatValue: (value) => `${value}m`,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <ListeningClock
        values={[
          45, 30, 12, 0, 0, 0, 0, 5, 18, 25, 20, 32, 40, 28, 22, 35, 48, 55, 70,
          85, 110, 95, 80, 60,
        ]}
        labels={{
          busiestHour: 'Busiest hour',
          busiestHourValue: 'Time during busiest hour',
        }}
        formatValue={(value) => `${value}m`}
      />
      <ListeningClock
        values={[
          0, 0, 0, 0, 0, 10, 35, 55, 40, 8, 5, 12, 20, 10, 6, 4, 30, 60, 45, 15,
          25, 20, 10, 2,
        ]}
        labels={{
          busiestHour: 'Busiest hour',
          busiestHourValue: 'Time during busiest hour',
        }}
        formatValue={(value) => `${value}m`}
        classes={{ bar: 'fill-accent-orange' }}
      />
    </div>
  ),
};
