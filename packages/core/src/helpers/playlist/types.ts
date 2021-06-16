export class Playlist {
  name: string;
  id: string;
  tracks: PlaylistTrack[];
}

export class PlaylistTrack {
  artist: string;
  name: string;
  album?: string;
  thumbnail?: string;
  duration: number;
  uuid: string;
  streams: PlaylistTrackStream[];
}

export class PlaylistTrackStream {
  source: string;
  id: string;
  duration?: number;
  title?: string;
  thumbnail?: string;
}
