import { render } from '@testing-library/react';

import { CardGrid } from '.';
import { Card } from '..';

describe('Card grid', () => {
  it('(Snapshot) Renders correctly', () => {
    const { container } = render(
      <CardGrid>
        <Card
          src="https://picsum.photos/300"
          title="Test album"
          subtitle="Test artist"
        />
      </CardGrid>,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) Sortable', () => {
    const { container } = render(
      <CardGrid.Sortable itemIds={['first', 'second']} onReorder={() => {}}>
        <CardGrid.SortableItem id="first">
          <Card title="First album" subtitle="Test artist" />
        </CardGrid.SortableItem>
        <CardGrid.SortableItem id="second">
          <Card title="Second album" subtitle="Test artist" />
        </CardGrid.SortableItem>
      </CardGrid.Sortable>,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) Sortable disabled', () => {
    const { container } = render(
      <CardGrid.Sortable itemIds={['first']} onReorder={() => {}} disabled>
        <CardGrid.SortableItem id="first">
          <Card title="First album" subtitle="Test artist" />
        </CardGrid.SortableItem>
      </CardGrid.Sortable>,
    );
    expect(container).toMatchSnapshot();
  });
});
