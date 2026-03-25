import { render } from '@testing-library/react';
import { vi } from 'vitest';

import type { Track } from '@nuclearplayer/model';

import { TrackTable } from '.';

const TEST_ROW_HEIGHT = 42;
const TEST_MAX_VISIBLE = 20;
const TEST_CONTAINER_HEIGHT = 400;

vi.mock('@tanstack/react-virtual', () => {
  return {
    useVirtualizer: (opts: { count: number }) => {
      const count = Math.max(0, Number(opts?.count ?? 0));
      const len = Math.min(count, TEST_MAX_VISIBLE);
      return {
        getVirtualItems: () =>
          Array.from({ length: len }).map((_, i) => ({
            index: i,
            start: i * TEST_ROW_HEIGHT,
            end: (i + 1) * TEST_ROW_HEIGHT,
            key: i,
            size: TEST_ROW_HEIGHT,
          })),
        getTotalSize: () => count * TEST_ROW_HEIGHT,
      } as const;
    },
  } as const;
});

function makeTracks(count: number): Track[] {
  return Array.from({ length: count }).map((_, i) => ({
    trackNumber: i + 1,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: `Track ${i + 1}`,
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: 'Album',
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: 'a' } },
      ],
      source: { provider: 'local', id: 'a' },
    },
    source: { provider: 'local', id: `t-${i + 1}` },
    durationMs: ((i % 300) + 30) * 1000,
  }));
}

describe('TrackTable', () => {
  it('(Snapshot) Basic', async () => {
    const { asFragment, findByText } = render(
      <TrackTable
        tracks={makeTracks(3)}
        display={{
          displayPosition: true,
          displayThumbnail: true,
          displayArtist: true,
          displayAlbum: true,
          displayDuration: true,
        }}
      />,
    );
    await findByText('Track 1');
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) DragAndDrop', async () => {
    const { asFragment, findByText } = render(
      <TrackTable
        tracks={makeTracks(5)}
        features={{ reorderable: true }}
        display={{
          displayPosition: true,
          displayThumbnail: true,
          displayArtist: true,
          displayAlbum: true,
          displayDuration: true,
        }}
      />,
    );
    await findByText('Track 1');
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) Filtering', async () => {
    const { asFragment, findByPlaceholderText } = render(
      <TrackTable
        tracks={makeTracks(5)}
        features={{ filterable: true }}
        display={{
          displayPosition: true,
          displayThumbnail: true,
          displayArtist: true,
          displayAlbum: true,
          displayDuration: true,
        }}
      />,
    );
    await findByPlaceholderText('Filter tracks');
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) LargeDataset', async () => {
    const { asFragment, findByText } = render(
      <div style={{ height: TEST_CONTAINER_HEIGHT }}>
        <TrackTable
          tracks={makeTracks(500)}
          display={{
            displayPosition: true,
            displayThumbnail: true,
            displayArtist: true,
            displayAlbum: true,
            displayDuration: true,
          }}
        />
      </div>,
    );
    await findByText('Track 1');
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) Toolbar', async () => {
    const { asFragment, findByTestId } = render(
      <TrackTable
        tracks={makeTracks(3)}
        features={{ playAll: true, addAllToQueue: true, filterable: true }}
        display={{
          displayPosition: true,
          displayThumbnail: true,
          displayArtist: true,
          displayAlbum: true,
          displayDuration: true,
        }}
        actions={{ onPlayAll: vi.fn(), onAddAllToQueue: vi.fn() }}
      />,
    );
    await findByTestId('add-all-to-queue-button');
    expect(asFragment()).toMatchSnapshot();
  });
});
