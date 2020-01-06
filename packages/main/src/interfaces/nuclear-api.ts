/* eslint-disable @typescript-eslint/no-explicit-any */
import { NuclearMeta } from '@nuclear/core';

interface NuclearApi {
  play(): any;
  pause(): any;
  listen(): any;
  
  shuffle?: any;
  onRaise?(): any;
  onQuit?(): any;
  onShuffle?(): any;
  onLoop?(): any;
  onPlay?(): any;
  onPause?(): any;
  onStop?(): any;
  onPlayPause?(): any;
  onVolume?(data: number): any;
  onNext?(): any;
  onPrevious?(): any;
  onSeek?(seek: number): any;
  onSelectTrack?(trackId: string): any;
  sendMetadata?(track: NuclearMeta): any;
  addTrack?(track: NuclearMeta): any;
  removeTrack?(uuid: string): any;
  clearTrackList?(): any;
  setVolume?(volume: number): any;
  setLoopStatus?(data: boolean): any;
}

export default NuclearApi;
