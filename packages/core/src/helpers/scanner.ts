import {LocalTrack} from '@nuclear/scanner';
import { NuclearMeta } from '../types';

export const scannerTrackToNuclearMeta = (track: LocalTrack): NuclearMeta => {
  return {
    ...track,
    name: track.title,
    lastScanned: +Date.now()
  };
};
