export type Track = {
  local?: boolean;
  album?: string;
  artist?: { name: string } | string;
  duration?: number | string;
  position?: number | string;
  playcount?: number | string;
  title?: string;
  name?: string;
  thumbnail?: string;
  streams?: TrackStream[];
  uuid?: string;
};

export { ContextPopupProps } from './components/ContextPopup';

export type TrackStream = {
  source: string;
  id: string;
  duration?: number;
  title?: string;
  thumbnail?: string;
  stream?: string;
};
