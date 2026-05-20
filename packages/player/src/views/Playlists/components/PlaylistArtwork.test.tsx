import { render } from '@testing-library/react';

import { PlaylistArtwork } from './PlaylistArtwork';

vi.mock('motion/react', async () => {
  const actual = await vi.importActual('motion/react');
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

describe('PlaylistArtwork', () => {
  it('(Snapshot) renders mosaic when 4+ thumbnails provided', () => {
    const { container } = render(
      <PlaylistArtwork
        name="Test Playlist"
        thumbnails={[
          'https://example.com/1.jpg',
          'https://example.com/2.jpg',
          'https://example.com/3.jpg',
          'https://example.com/4.jpg',
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders single image when fewer than 4 thumbnails', () => {
    const { container } = render(
      <PlaylistArtwork
        name="Test Playlist"
        thumbnails={['https://example.com/1.jpg']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders placeholder when no thumbnails', () => {
    const { container } = render(
      <PlaylistArtwork name="Test Playlist" thumbnails={[]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders placeholder when thumbnails undefined', () => {
    const { container } = render(<PlaylistArtwork name="Test Playlist" />);
    expect(container).toMatchSnapshot();
  });
});
