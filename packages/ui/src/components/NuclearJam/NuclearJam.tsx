import { FC } from 'react';

import {
  NuclearJamControls,
  NuclearJamControlsProps,
} from './NuclearJamControls';
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
  Header: typeof NuclearJamHeader;
  NowPlaying: typeof NuclearJamNowPlaying;
  Controls: typeof NuclearJamControls;
  Queue: typeof NuclearJamQueue;
};

export const NuclearJam = NuclearJamRoot as NuclearJamComponent;
NuclearJam.Header = NuclearJamHeader;
NuclearJam.NowPlaying = NuclearJamNowPlaying;
NuclearJam.Controls = NuclearJamControls;
NuclearJam.Queue = NuclearJamQueue;

export type {
  NuclearJamProps,
  NuclearJamHeaderProps,
  NuclearJamNowPlayingProps,
  NuclearJamControlsProps,
  NuclearJamQueueProps,
  ConnectionStatus,
};
