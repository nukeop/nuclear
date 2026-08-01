import { render } from '@testing-library/react';

import { TopList } from './TopList';
import type { TopListEntry } from './types';

const artists: TopListEntry[] = [
  {
    id: 'maus',
    label: 'John Maus',
    imageUrl: 'https://example.com/maus.jpg',
    value: 7_200_000,
  },
  {
    id: 'pink',
    label: 'Ariel Pink',
    value: 3_600_000,
  },
  {
    id: 'swans',
    label: 'Swans',
    imageUrl: 'https://example.com/swans.jpg',
    value: 1_800_000,
  },
];

const albums: TopListEntry[] = [
  {
    id: 'before-today',
    label: 'Before Today',
    sublabel: 'Ariel Pink',
    imageUrl: 'https://example.com/before-today.jpg',
    value: 5_400_000,
  },
  {
    id: 'hot-rats',
    label: 'Hot Rats',
    sublabel: 'Frank Zappa',
    value: 2_700_000,
  },
];

describe('TopList', () => {
  it('(Snapshot) renders a list of artists', () => {
    const { container } = render(
      <TopList
        title="Top artists"
        entries={artists}
        formatValue={(value) => `${value / 60_000}m`}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders a list of albums with their artists', () => {
    const { container } = render(
      <TopList
        title="Top albums"
        entries={albums}
        formatValue={(value) => `${value / 60_000}m`}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
