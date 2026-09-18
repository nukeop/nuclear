import { render, screen } from '@testing-library/react';

import { TrackTable } from '..';

describe('TrackTableSkeleton', () => {
  it('(Snapshot) Defaults', () => {
    const { asFragment } = render(<TrackTable.Skeleton />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) WithPositionAndWithoutDuration', () => {
    const { asFragment } = render(
      <TrackTable.Skeleton
        display={{ displayPosition: true, displayDuration: false }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the requested number of rows', () => {
    render(<TrackTable.Skeleton rows={4} />);

    expect(screen.getAllByTestId('track-row-skeleton')).toHaveLength(4);
  });
});
