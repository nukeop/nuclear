import { FC } from 'react';

import {
  NuclearJamConnecting,
  NuclearJamConnectingLabels,
} from './NuclearJamConnecting';
import { NuclearJamContent, NuclearJamContentProps } from './NuclearJamContent';
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
  NuclearJamLyrics,
  NuclearJamLyricsLabels,
  NuclearJamLyricsProps,
  NuclearJamLyricsState,
} from './NuclearJamLyrics';
import {
  NuclearJamLyricsToolbar,
  NuclearJamLyricsToolbarLabels,
  NuclearJamLyricsToolbarProps,
} from './NuclearJamLyricsToolbar';
import {
  NuclearJamLyricsTopBar,
  NuclearJamLyricsTopBarLabels,
  NuclearJamLyricsTopBarProps,
} from './NuclearJamLyricsTopBar';
import {
  NuclearJamNowPlaying,
  NuclearJamNowPlayingLabels,
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
  NuclearJamSearchDrawer,
  NuclearJamSearchDrawerProps,
} from './NuclearJamSearchDrawer';
import {
  NuclearJamSearchDrawerEmpty,
  NuclearJamSearchDrawerEmptyLabels,
} from './NuclearJamSearchDrawerEmpty';
import {
  NuclearJamSearchDrawerError,
  NuclearJamSearchDrawerErrorLabels,
} from './NuclearJamSearchDrawerError';
import { NuclearJamSearchDrawerResults } from './NuclearJamSearchDrawerResults';
import {
  NuclearJamSearchResultTrack,
  NuclearJamSearchResultTrackProps,
} from './NuclearJamSearchResultTrack';
import { NuclearJamSearchResultTrackSkeleton } from './NuclearJamSearchResultTrackSkeleton';

type NuclearJamSearchResultTrackComponent =
  typeof NuclearJamSearchResultTrack & {
    Skeleton: typeof NuclearJamSearchResultTrackSkeleton;
  };

const SearchResultTrack =
  NuclearJamSearchResultTrack as NuclearJamSearchResultTrackComponent;
SearchResultTrack.Skeleton = NuclearJamSearchResultTrackSkeleton;

type NuclearJamSearchDrawerComponent = typeof NuclearJamSearchDrawer & {
  Empty: typeof NuclearJamSearchDrawerEmpty;
  Error: typeof NuclearJamSearchDrawerError;
  Results: typeof NuclearJamSearchDrawerResults;
};

const SearchDrawer = NuclearJamSearchDrawer as NuclearJamSearchDrawerComponent;
SearchDrawer.Empty = NuclearJamSearchDrawerEmpty;
SearchDrawer.Error = NuclearJamSearchDrawerError;
SearchDrawer.Results = NuclearJamSearchDrawerResults;

type NuclearJamComponent = FC<NuclearJamProps> & {
  Connecting: typeof NuclearJamConnecting;
  Error: typeof NuclearJamError;
  Header: typeof NuclearJamHeader;
  Content: typeof NuclearJamContent;
  NowPlaying: typeof NuclearJamNowPlaying;
  Controls: typeof NuclearJamControls;
  Queue: typeof NuclearJamQueue;
  SearchBar: typeof NuclearJamSearchBar;
  SearchDrawer: NuclearJamSearchDrawerComponent;
  SearchResultTrack: NuclearJamSearchResultTrackComponent;
  Lyrics: typeof NuclearJamLyrics;
  LyricsTopBar: typeof NuclearJamLyricsTopBar;
  LyricsToolbar: typeof NuclearJamLyricsToolbar;
};

export const NuclearJam = NuclearJamRoot as NuclearJamComponent;
NuclearJam.Connecting = NuclearJamConnecting;
NuclearJam.Error = NuclearJamError;
NuclearJam.Header = NuclearJamHeader;
NuclearJam.Content = NuclearJamContent;
NuclearJam.NowPlaying = NuclearJamNowPlaying;
NuclearJam.Controls = NuclearJamControls;
NuclearJam.Queue = NuclearJamQueue;
NuclearJam.SearchBar = NuclearJamSearchBar;
NuclearJam.SearchDrawer = SearchDrawer;
NuclearJam.SearchResultTrack = SearchResultTrack;
NuclearJam.Lyrics = NuclearJamLyrics;
NuclearJam.LyricsTopBar = NuclearJamLyricsTopBar;
NuclearJam.LyricsToolbar = NuclearJamLyricsToolbar;

export type {
  NuclearJamProps,
  NuclearJamHeaderProps,
  NuclearJamContentProps,
  NuclearJamNowPlayingLabels,
  NuclearJamNowPlayingProps,
  NuclearJamControlsProps,
  NuclearJamConnectingLabels,
  NuclearJamErrorLabels,
  NuclearJamEmptyQueueLabels,
  NuclearJamQueueLabels,
  NuclearJamQueueProps,
  NuclearJamSearchBarLabels,
  NuclearJamSearchBarProps,
  NuclearJamSearchDrawerProps,
  NuclearJamSearchDrawerEmptyLabels,
  NuclearJamSearchDrawerErrorLabels,
  NuclearJamSearchResultTrackProps,
  NuclearJamLyricsLabels,
  NuclearJamLyricsProps,
  NuclearJamLyricsState,
  NuclearJamLyricsTopBarLabels,
  NuclearJamLyricsTopBarProps,
  NuclearJamLyricsToolbarLabels,
  NuclearJamLyricsToolbarProps,
  ConnectionStatus,
  ConnectionStatusLabels,
};
