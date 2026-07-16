import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { HistoryRow } from './HistoryRow';
import type { HistoryRowLabels } from './types';

const labels: HistoryRowLabels = {
  favorite: 'Add to favorites',
  unfavorite: 'Remove from favorites',
  addToQueue: 'Add to queue',
};

const noop = () => {};

describe('HistoryRow', () => {
  it('(Snapshot) renders with artwork and all actions', () => {
    const { container } = render(
      <HistoryRow
        title="Paranoid Android"
        artist="Radiohead"
        time="11:55 AM"
        artworkUrl="https://example.com/ok-computer.jpg"
        labels={labels}
        onToggleFavorite={noop}
        onAddToQueue={noop}
        onPlayNow={noop}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders a placeholder when artwork is missing', () => {
    const { container } = render(
      <HistoryRow
        title="Paranoid Android"
        artist="Radiohead"
        time="11:55 AM"
        labels={labels}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('shows title, artist, time, and artwork', () => {
    render(
      <HistoryRow
        title="Paranoid Android"
        artist="Radiohead"
        time="11:55 AM"
        artworkUrl="https://example.com/ok-computer.jpg"
        labels={labels}
      />,
    );

    expect(screen.getByTestId('history-row-title')).toHaveTextContent(
      'Paranoid Android',
    );
    expect(screen.getByTestId('history-row-artist')).toHaveTextContent(
      'Radiohead',
    );
    expect(screen.getByTestId('history-row-played-at')).toHaveTextContent(
      '11:55 AM',
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://example.com/ok-computer.jpg',
    );
  });

  it('plays on title click and calls the matching callback for each action button', async () => {
    const onToggleFavorite = vi.fn();
    const onAddToQueue = vi.fn();
    const onPlayNow = vi.fn();
    render(
      <HistoryRow
        title="Paranoid Android"
        artist="Radiohead"
        time="11:55 AM"
        labels={labels}
        onToggleFavorite={onToggleFavorite}
        onAddToQueue={onAddToQueue}
        onPlayNow={onPlayNow}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Paranoid Android' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Add to favorites' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add to queue' }));

    expect(onPlayNow).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onAddToQueue).toHaveBeenCalledTimes(1);
  });

  it('labels the favorite button as removal when the track is a favorite', () => {
    render(
      <HistoryRow
        title="Paranoid Android"
        artist="Radiohead"
        time="11:55 AM"
        labels={labels}
        isFavorite
        onToggleFavorite={noop}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Remove from favorites' }),
    ).toBeInTheDocument();
  });
});
