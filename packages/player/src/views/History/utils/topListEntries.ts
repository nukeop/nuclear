import type { TopListEntry } from '@nuclearplayer/ui';

import type {
  TopAlbum,
  TopArtist,
  TopTrack,
} from '../../../services/tauri/bindings';

export const artistEntries = (artists: TopArtist[]): TopListEntry[] =>
  artists.map((artist) => ({
    id: artist.name,
    label: artist.name,
    imageUrl: artist.artworkUrl,
    value: artist.msPlayed,
  }));

export const albumEntries = (albums: TopAlbum[]): TopListEntry[] =>
  albums.map((album) => ({
    id: `${album.artist} - ${album.title}`,
    label: album.title,
    sublabel: album.artist,
    imageUrl: album.artworkUrl,
    value: album.msPlayed,
  }));

export const trackEntries = (tracks: TopTrack[]): TopListEntry[] =>
  tracks.map((track) => ({
    id: `${track.artists.join(', ')} - ${track.title}`,
    label: track.title,
    sublabel: track.artists.join(', '),
    imageUrl: track.artworkUrl,
    value: track.msPlayed,
  }));
