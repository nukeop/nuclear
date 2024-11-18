export type Track = {
  uuid?: string;
  loading?: boolean;
  error?: boolean | {
    message: string;
    details: string
  };
  local?: boolean;
  artist: { name: string } | string;
  name?: string;
  title?: string;
  album?: string;
  duration?: number | string;
  position?: number | string;
  discNumber?: number | string;
  playcount?: number | string;
  thumbnail?: string;
  image?: { '#text'?: string }[];
  streams?: TrackStream[];
};

export type Album = {
  artist?: string;
  title: string;
  tracks?: Track[];
  image?: { '#text'?: string }[];
};

export type TrackStream = {
  source: string;
  id: string;
  duration?: number;
  title?: string;
  thumbnail?: string;
  stream?: string;
};

export type SearchProviderOption = {
  key: string;
  text: string;
  value: string;
}

export type TrackItem = {
  artist: string;
  name: string;
  thumbnail?: string;
  local?: boolean;
  uuid?: string;
  streams?: TrackStream[];
}

export type Download = {
  status: DownloadStatus;
  completion: number;
  track: TrackItem;
}
export enum DownloadStatus {
  WAITING = 'Waiting',
  STARTED = 'Started',
  PAUSED = 'Paused',
  FINISHED = 'Finished',
  ERROR = 'Error'
}

export type Notification = {
  id?:string
  title?: string;
  details?: string;
  error?: boolean;
  warning?: boolean;
  info?: boolean;
  success?: boolean;
  onClick?:() => void
  icon?:  Node | React.ReactElement<{
    src: string;
  }>
}
