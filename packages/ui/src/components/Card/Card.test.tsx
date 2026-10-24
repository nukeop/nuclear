import { render } from '@testing-library/react';

import { Card } from '.';
import { Popover } from '../Popover';

describe('Card', () => {
  it('(Snapshot) renders correctly', async () => {
    const { container } = render(
      <Card
        src="https://picsum.photos/300"
        title="Test album"
        subtitle="Test artist"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders with play and menu buttons', async () => {
    const { container } = render(
      <Card
        src="https://picsum.photos/300"
        title="Test album"
        subtitle="Test artist"
        onPlay={() => {}}
        menuItems={<Popover.Item>Add to queue</Popover.Item>}
        labels={{ play: 'Play', menu: 'More actions' }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
