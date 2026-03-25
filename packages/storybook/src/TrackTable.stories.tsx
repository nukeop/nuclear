import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Track } from '@nuclearplayer/model';
import { TrackTable, TrackTableProps } from '@nuclearplayer/ui';

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

const tracks: Track[] = [
  {
    trackNumber: 1,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'Why Does it Hurt When I Pee?',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: "Joe's Garage",
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '1' },
    },
    source: { provider: 'local', id: '1' },
    durationMs: 78 * 1000,
  },
  {
    trackNumber: 2,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'The Return of the Son of Monster Magnet',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: 'Freak Out!',
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '1' },
    },
    source: { provider: 'local', id: '2' },
    durationMs: 45 * 1000,
  },
  {
    trackNumber: 3,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'Waka/Jawaka',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: 'Waka/Jawaka',
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '1' },
    },
    source: { provider: 'local', id: '3' },
    durationMs: 217 * 1000,
  },
];

export const Basic: Story = {
  args: {
    tracks,
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
