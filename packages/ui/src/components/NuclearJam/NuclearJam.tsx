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
  NuclearJamHeader,
  NuclearJamHeaderProps,
} from './NuclearJamHeader';
import {
  NuclearJamNowPlaying,
  NuclearJamNowPlayingProps,
} from './NuclearJamNowPlaying';
import { NuclearJamQueue, NuclearJamQueueProps } from './NuclearJamQueue';
import { NuclearJamProps, NuclearJamRoot } from './NuclearJamRoot';

type NuclearJamComponent = FC<NuclearJamProps> & {
  Connecting: typeof NuclearJamConnecting;
  Error: typeof NuclearJamError;
  Header: typeof NuclearJamHeader;
  NowPlaying: typeof NuclearJamNowPlaying;
  Controls: typeof NuclearJamControls;
  Queue: typeof NuclearJamQueue;
};

export const NuclearJam = NuclearJamRoot as NuclearJamComponent;
NuclearJam.Connecting = NuclearJamConnecting;
NuclearJam.Error = NuclearJamError;
NuclearJam.Header = NuclearJamHeader;
NuclearJam.NowPlaying = NuclearJamNowPlaying;
NuclearJam.Controls = NuclearJamControls;
NuclearJam.Queue = NuclearJamQueue;

export type {
  NuclearJamProps,
  NuclearJamHeaderProps,
  NuclearJamNowPlayingProps,
  NuclearJamControlsProps,
  NuclearJamConnectingLabels,
  NuclearJamErrorLabels,
  NuclearJamEmptyQueueLabels,
  NuclearJamQueueProps,
  ConnectionStatus,
};
