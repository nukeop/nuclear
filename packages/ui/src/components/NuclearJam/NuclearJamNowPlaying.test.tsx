import { render, screen } from '@testing-library/react';

import { NuclearJamNowPlaying } from './NuclearJamNowPlaying';

const labels = { lyrics: 'Show lyrics' };

describe('NuclearJamNowPlaying', () => {
  it('(Snapshot) renders with cover art', () => {
    const { container } = render(
      <NuclearJamNowPlaying
        labels={labels}
        title="Placeholder Song"
        artist="Test Artist"
        coverUrl="https://example.com/cover.jpg"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders with a lyrics button', () => {
    const { container } = render(
      <NuclearJamNowPlaying
        labels={labels}
        title="Placeholder Song"
        artist="Test Artist"
        onLyricsClick={vi.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('omits the artist when none is given', () => {
    render(<NuclearJamNowPlaying labels={labels} title="Placeholder Song" />);

    expect(screen.queryByTestId('now-playing-artist')).not.toBeInTheDocument();
  });

  it('shows a placeholder when there is no cover art', () => {
    render(<NuclearJamNowPlaying labels={labels} title="Placeholder Song" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
