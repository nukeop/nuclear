import { render } from '@testing-library/react';

import { Mosaic } from '.';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

describe('Mosaic', () => {
  it('(Snapshot) renders a 2x2 grid of images', () => {
    const { container } = render(
      <Mosaic
        urls={[
          'https://example.com/1.jpg',
          'https://example.com/2.jpg',
          'https://example.com/3.jpg',
          'https://example.com/4.jpg',
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
