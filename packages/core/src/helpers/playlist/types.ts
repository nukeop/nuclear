export class Playlist {
  id: string;
  name: string;
  lastModified?: number;
  serverModified?: number;
  tracks: PlaylistTrack[];
}

export class PlaylistTrack {
  uuid: string;
  artist: string;
  name: string;
  album?: string;
  thumbnail?: string;
  duration?: number | string;
  streams: PlaylistTrackStream[];
}

export class PlaylistTrackStream {
  source: string;
  id: string;
  duration?: number;
  title?: string;
  thumbnail?: string;
}
