import { FC } from 'react';

import {
  NuclearJamConnecting,
  NuclearJamConnectingLabels,
} from './NuclearJamConnecting';
import {
  NuclearJamControls,
  NuclearJamControlsProps,
} from './NuclearJamControls';
import { NuclearJamEmptyQueueLabels } from './NuclearJamEmptyQueue';
import { NuclearJamError, NuclearJamErrorLabels } from './NuclearJamError';
import {
  ConnectionStatus,
  ConnectionStatusLabels,
  NuclearJamHeader,
  NuclearJamHeaderProps,
} from './NuclearJamHeader';
import {
  NuclearJamNowPlaying,
  NuclearJamNowPlayingProps,
} from './NuclearJamNowPlaying';
import {
  NuclearJamQueue,
  NuclearJamQueueLabels,
  NuclearJamQueueProps,
} from './NuclearJamQueue';
import { NuclearJamProps, NuclearJamRoot } from './NuclearJamRoot';
import {
  NuclearJamSearchBar,
  NuclearJamSearchBarLabels,
  NuclearJamSearchBarProps,
} from './NuclearJamSearchBar';
import {
  NuclearJamSearchResultTrack,
  NuclearJamSearchResultTrackProps,
} from './NuclearJamSearchResultTrack';

type NuclearJamComponent = FC<NuclearJamProps> & {
  Connecting: typeof NuclearJamConnecting;
  Error: typeof NuclearJamError;
  Header: typeof NuclearJamHeader;
  NowPlaying: typeof NuclearJamNowPlaying;
  Controls: typeof NuclearJamControls;
  Queue: typeof NuclearJamQueue;
  SearchBar: typeof NuclearJamSearchBar;
  SearchResultTrack: typeof NuclearJamSearchResultTrack;
};

export const NuclearJam = NuclearJamRoot as NuclearJamComponent;
NuclearJam.Connecting = NuclearJamConnecting;
NuclearJam.Error = NuclearJamError;
NuclearJam.Header = NuclearJamHeader;
NuclearJam.NowPlaying = NuclearJamNowPlaying;
NuclearJam.Controls = NuclearJamControls;
NuclearJam.Queue = NuclearJamQueue;
NuclearJam.SearchBar = NuclearJamSearchBar;
NuclearJam.SearchResultTrack = NuclearJamSearchResultTrack;

export type {
  NuclearJamProps,
  NuclearJamHeaderProps,
  NuclearJamNowPlayingProps,
  NuclearJamControlsProps,
  NuclearJamConnectingLabels,
  NuclearJamErrorLabels,
  NuclearJamEmptyQueueLabels,
  NuclearJamQueueLabels,
  NuclearJamQueueProps,
  NuclearJamSearchBarLabels,
  NuclearJamSearchBarProps,
  NuclearJamSearchResultTrackProps,
  ConnectionStatus,
  ConnectionStatusLabels,
};
