import { render, screen } from '@testing-library/react';

import { ListeningClock } from './ListeningClock';

const fakeMinutesByHour = [
  45, 30, 12, 0, 0, 0, 0, 5, 18, 25, 20, 32, 40, 28, 22, 35, 48, 55, 70, 85,
  110, 95, 80, 60,
];

const labels = {
  busiestHour: 'Busiest hour',
  busiestHourValue: 'Time during busiest hour',
};

const minutesLabel = (value: number) => `${value}m`;

describe('ListeningClock', () => {
  it('(Snapshot) renders a full day of listening data', () => {
    const { container } = render(
      <ListeningClock
        values={fakeMinutesByHour}
        labels={labels}
        formatValue={minutesLabel}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('shows the busiest hour and its value in the stats panel', () => {
    render(
      <ListeningClock
        values={fakeMinutesByHour}
        labels={labels}
        formatValue={minutesLabel}
      />,
    );

    expect(screen.getByText('Busiest hour')).toBeInTheDocument();
    expect(
      screen.getByTestId('listening-clock-busiest-hour'),
    ).toHaveTextContent('20:00');
    expect(screen.getByText('Time during busiest hour')).toBeInTheDocument();
    expect(
      screen.getByTestId('listening-clock-busiest-value'),
    ).toHaveTextContent('110m');
  });

  it('renders bars only for hours with listening time', () => {
    render(
      <ListeningClock
        values={[10, 20]}
        labels={labels}
        formatValue={minutesLabel}
      />,
    );

    expect(screen.getAllByTestId('listening-clock-bar')).toHaveLength(2);
  });

  it('renders hour marks around the clock', () => {
    render(
      <ListeningClock
        values={fakeMinutesByHour}
        labels={labels}
        formatValue={minutesLabel}
      />,
    );

    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('06')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });
});
