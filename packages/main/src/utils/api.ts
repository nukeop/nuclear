/* eslint-disable @typescript-eslint/no-explicit-any */
import { NuclearMeta } from '@nuclear/common';
import { Event } from 'electron';

interface NuclearApi {
  shuffle?: any;
  rendererWindow: Event['sender'];
  onRaise?(): any;
  onQuit?(): any;
  onShuffle?(): any;
  onLoop?(): any;
  onPlay(): any;
  onPause(): any;
  onStop?(): any;
  onPlayPause?(): any;
  onVolume?(data: number): any;
  onNext?(): any;
  onPrevious?(): any;
  onSelectTrack?(trackId: string): any;

  setMetadata?(track: NuclearMeta): any;
  addTrack?(track: NuclearMeta): any;
  removeTrack?(uuid: string): any;
  play(): any;
  pause(): any;
  setVolume?(volume: number): any;
  setLoopStatus?(data: boolean): any;
  listen(): any;
}

// eslint-disable-next-line no-undef
export default NuclearApi;
