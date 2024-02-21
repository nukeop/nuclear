import _, { flow, omit, unionWith } from 'lodash';
import { store, Track } from '@nuclear/core';
import { areTracksEqualByName, getTrackItem } from '@nuclear/ui';

import { safeAddUuid } from './helpers';
import { createStandardAction } from 'typesafe-actions';

export const READ_BLACKLISTED = 'READ_BLACKLISTED';
export const BLACKLIST_TRACK = 'BLACKLIST_TRACK';
export const REMOVE_BLACKLISTED_TRACK = 'REMOVE_BLACKLISTED_TRACK';

export function addToBlacklist(track){
  const clonedTrack = flow(safeAddUuid, getTrackItem)(track);
  
  let blacklist = store.get('blacklist');
  const filteredTracks = blacklist.filter(t => !areTracksEqualByName(t, track));
  blacklist = [...filteredTracks, omit(clonedTrack, 'streams')];
  
  store.set('blacklist', blacklist);
  
  return {
    type: BLACKLIST_TRACK,
    payload: blacklist 
  };
}
