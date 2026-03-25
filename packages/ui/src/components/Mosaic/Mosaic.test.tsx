import { render } from '@testing-library/react';

import { Mosaic } from '.';

vi.mock('motion/react', async () => {
  const actual = await vi.importActual('motion/react');
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
