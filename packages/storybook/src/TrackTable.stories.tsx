import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Track } from '@nuclearplayer/model';
import { TrackTable, TrackTableProps } from '@nuclearplayer/ui';

import { labels, tracks } from './TrackTable.stories.data';

const meta: Meta<typeof TrackTable> = {
  title: 'Components/TrackTable',
  component: TrackTable,
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on.*' },
  },
};

export default meta;

type Story = StoryObj<Meta<typeof TrackTable>>;

export const Basic: Story = {
  args: {
    tracks,
    labels,
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => <TrackTable {...(args as TrackTableProps)} />,
};

export const DragAndDrop: Story = {
  args: {
    tracks,
    labels,
    features: {
      reorderable: true,
    },
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => {
    const [tracksState, setTracksState] = useState(args.tracks);
    return (
      <TrackTable
        {...args}
        tracks={tracksState}
        actions={{
          onReorder: (fromIndex: number, toIndex: number) => {
            setTracksState((prev) => {
              const next = [...prev];
              const [moved] = next.splice(fromIndex, 1);
              next.splice(toIndex, 0, moved);
              return next.map((t, idx) => ({ ...t, trackNumber: idx + 1 }));
            });
          },
        }}
      />
    );
  },
};

export const LargeDataset: Story = {
  args: {
    labels,
    tracks: Array.from({ length: 5000 }).map(
      (_, i) =>
        ({
          trackNumber: i + 1,
          artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
          title: `Virtualized Track ${i + 1}`,
          artists: [{ name: 'Frank Zappa', roles: [] }],
          album: {
            title: 'Huge Album',
            artists: [
              { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
            ],
            source: { provider: 'local', id: '1' },
          },
          source: { provider: 'local', id: `vt-${i + 1}` },
          durationMs: ((i % 320) + 30) * 1000,
        }) as Track,
    ),
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => (
    <div className="h-100">
      <TrackTable {...(args as TrackTableProps)} />
    </div>
  ),
};

export const Filtering: Story = {
  args: {
    tracks,
    labels,
    features: {
      filterable: true,
    },
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => (
    <div className="h-100 p-4">
      <TrackTable {...(args as TrackTableProps)} />
    </div>
  ),
};

export const WithFavorites: Story = {
  args: {
    tracks,
    labels,
    display: {
      displayFavorite: true,
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    return (
      <TrackTable
        {...(args as TrackTableProps)}
        actions={{
          onToggleFavorite: (track) => {
            setFavorites((prev) => {
              const next = new Set(prev);
              if (next.has(track.source.id)) {
                next.delete(track.source.id);
              } else {
                next.add(track.source.id);
              }
              return next;
            });
          },
        }}
        meta={{
          isTrackFavorite: (track) => favorites.has(track.source.id),
        }}
      />
    );
  },
};

export const LongTitle: Story = {
  args: {
    labels,
    tracks: [
      {
        trackNumber: 1,
        artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
        title:
          'Several Species of Small Furry Animals Gathered Together in a Cave and Grooving with a Pict (Remastered Extended Deluxe Anniversary Edition feat. The London Philharmonic Orchestra)',
        artists: [{ name: 'Pink Floyd', roles: [] }],
        album: {
          title: 'Ummagumma',
          artists: [
            {
              name: 'Pink Floyd',
              source: { provider: 'local', id: '1' },
            },
          ],
          source: { provider: 'local', id: '1' },
        },
        source: { provider: 'local', id: 'long-1' },
        durationMs: 305 * 1000,
      },
      ...tracks,
    ],
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => (
    <div className="w-[600px]">
      <TrackTable {...(args as TrackTableProps)} />
    </div>
  ),
};

export const WithDeleteButton: Story = {
  args: {
    tracks,
    labels,
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
      displayDeleteButton: true,
    },
  },
  render: (args) => {
    const [tracksState, setTracksState] = useState(args.tracks);

    return (
      <TrackTable
        {...(args as TrackTableProps)}
        tracks={tracksState}
        actions={{
          onRemove: (track) => {
            setTracksState((prev) =>
              prev.filter((t: Track) => t.source.id !== track.source.id),
            );
          },
        }}
      />
    );
  },
};

export const ToolbarButtons: Story = {
  args: {
    tracks,
    labels,
    features: {
      playAll: true,
      addAllToQueue: true,
      filterable: true,
    },
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
    actions: {
      onPlayAll: fn(),
      onAddAllToQueue: fn(),
    },
  },
  render: (args) => <TrackTable {...(args as TrackTableProps)} />,
};
