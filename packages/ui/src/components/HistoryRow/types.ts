import { ComponentProps } from 'react';

export type HistoryRowLabels = {
  favorite: string;
  unfavorite: string;
  addToQueue: string;
};

export type HistoryRowClasses = {
  root?: string;
  thumbnail?: string;
  title?: string;
  artist?: string;
  time?: string;
};

export type HistoryRowProps = ComponentProps<'div'> & {
  title: string;
  artist: string;
  time: string;
  artworkUrl?: string | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToQueue?: () => void;
  onPlayNow?: () => void;
  labels: HistoryRowLabels;
  classes?: HistoryRowClasses;
};
