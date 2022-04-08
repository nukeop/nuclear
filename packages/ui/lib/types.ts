export type Track = {
  local?: boolean;
  album?: string;
  artist: { name: string } | string;
  duration?: number | string;
  position?: number | string;
  playcount?: number | string;
  title?: string;
  name?: string;
  thumbnail?: string;
  image?: { '#text'?: string }[];
  streams?: TrackStream[];
  uuid?: string;
};

export type Album = {
  artist?: { name: string };
  title: string;
  tracks?: Track[];
  image?: { '#text'?: string }[];
};

export type SelectedStream = {
  duration?: number,
  format?: string,
  id?: string,
  originalUrl?: string,
  source?: string,
  stream?: string,
  thumbnail?: string,
  title?: string,
  skipSegments?: {
    category?: string,
    endTime?: number,
    startTime?: number
  }[],
}

export { ContextPopupProps } from './components/ContextPopup';

export type TrackStream = {
  source: string;
  id: string;
  duration?: number;
  title?: string;
  thumbnail?: string;
  stream?: string;
};
