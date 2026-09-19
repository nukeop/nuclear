import { render, screen } from '@testing-library/react';

import { CardGrid } from './CardGrid';

describe('CardGridSkeleton', () => {
  it('(Snapshot) Renders correctly', () => {
    const { container } = render(<CardGrid.Skeleton />);

    expect(container).toMatchSnapshot();
  });

  it('renders the requested number of card skeletons', () => {
    render(<CardGrid.Skeleton count={4} />);

    expect(screen.getAllByTestId('card-skeleton')).toHaveLength(4);
  });
});
