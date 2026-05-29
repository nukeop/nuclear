import { render } from '@testing-library/react';

import type { QueueItem } from '@nuclearplayer/model';

import { NuclearJamQueue } from './NuclearJamQueue';

const labels = {
  upNext: 'Up next',
  title: 'Queue is empty',
  subtitle: 'Add tracks in Nuclear to see them here',
};

const makeItem = (id: string, title: string): QueueItem => ({
  id,
  status: 'success',
  addedAtIso: '2024-01-01T00:00:00.000Z',
  track: {
    title,
    artists: [{ name: 'Radiohead', roles: ['main'] }],
    source: { provider: 'test', id },
  },
});

const items = [
  makeItem('a', 'Everything In Its Right Place'),
  makeItem('b', 'Kid A'),
  makeItem('c', 'The National Anthem'),
];

describe('NuclearJamQueue', () => {
  it('(Snapshot) renders the queue with items', () => {
    const { container } = render(
      <NuclearJamQueue items={items} currentItemId="b" labels={labels} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the empty state when there are no items', () => {
    const { container } = render(
      <NuclearJamQueue items={[]} labels={labels} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('scrolls the new current item into view when it changes', () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');
    const { rerender } = render(
      <NuclearJamQueue items={items} currentItemId="a" labels={labels} />,
    );

    rerender(
      <NuclearJamQueue items={items} currentItemId="c" labels={labels} />,
    );

    expect(scrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
      behavior: 'smooth',
    });
  });
});
