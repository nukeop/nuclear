import { render, screen } from '@testing-library/react';

import { HistoryDayGroup } from './HistoryDayGroup';

describe('HistoryDayGroup', () => {
  it('(Snapshot) renders a marker with content', () => {
    const { container } = render(
      <HistoryDayGroup marker="Today">
        <div>row content</div>
      </HistoryDayGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('shows the marker and the rows inside the group', () => {
    render(
      <HistoryDayGroup marker="Yesterday">
        <div>row content</div>
      </HistoryDayGroup>,
    );

    expect(screen.getByTestId('history-day-marker')).toHaveTextContent(
      'Yesterday',
    );
    expect(screen.getByTestId('history-day-group')).toHaveTextContent(
      'row content',
    );
  });
});
