import { render } from '@testing-library/react';

import type { QueueItem } from '@nuclearplayer/model';

import { NuclearJamQueueItem } from './NuclearJamQueueItem';

const makeItem = (overrides: Partial<QueueItem['track']> = {}): QueueItem => ({
  id: '1',
  status: 'success',
  addedAtIso: '2024-01-01T00:00:00.000Z',
  track: {
    title: 'Idioteque',
    artists: [{ name: 'Radiohead', roles: ['main'] }],
    artwork: {
      items: [
        {
          url: 'https://example.com/kid-a.jpg',
          purpose: 'thumbnail',
          width: 48,
          height: 48,
        },
      ],
    },
    durationMs: 251000,
    source: { provider: 'test', id: 'track-1' },
    ...overrides,
  },
});

describe('NuclearJamQueueItem', () => {
  it('(Snapshot) renders a current item with cover art', () => {
    const { container } = render(
      <NuclearJamQueueItem item={makeItem()} isCurrent={true} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders a non-current item without artwork', () => {
    const { container } = render(
      <NuclearJamQueueItem
        item={makeItem({ artwork: undefined })}
        isCurrent={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
