import { render } from '@testing-library/react';

import { PlaylistBuilder } from '../../../test/builders/PlaylistBuilder';
import { PlaylistArtwork } from './PlaylistArtwork';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

describe('PlaylistArtwork', () => {
  it('(Snapshot) renders custom artwork when playlist has its own', () => {
    const playlist = new PlaylistBuilder()
      .withArtwork('https://example.com/custom.jpg')
      .withTrackArtworks([
        'https://example.com/1.jpg',
        'https://example.com/2.jpg',
        'https://example.com/3.jpg',
        'https://example.com/4.jpg',
      ])
      .build();

    const { container } = render(<PlaylistArtwork playlist={playlist} />);
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders mosaic from track artwork', () => {
    const playlist = new PlaylistBuilder()
      .withTrackArtworks([
        'https://example.com/1.jpg',
        'https://example.com/2.jpg',
        'https://example.com/3.jpg',
        'https://example.com/4.jpg',
      ])
      .build();

    const { container } = render(<PlaylistArtwork playlist={playlist} />);
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders single image when fewer than 4 tracks have art', () => {
    const playlist = new PlaylistBuilder()
      .withTrackArtworks([
        'https://example.com/1.jpg',
        'https://example.com/2.jpg',
      ])
      .build();

    const { container } = render(<PlaylistArtwork playlist={playlist} />);
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders placeholder when no artwork available', () => {
    const playlist = new PlaylistBuilder()
      .withTrackNames(['Track A', 'Track B'])
      .build();

    const { container } = render(<PlaylistArtwork playlist={playlist} />);
    expect(container).toMatchSnapshot();
  });
});
