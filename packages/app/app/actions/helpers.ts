import { v4 } from 'uuid';
import _ from 'lodash';
import { createAction } from 'redux-actions';
import { PlaylistTrack, Track } from '@nuclear/core';
import { TrackItem } from '@nuclear/ui/lib/types';

type ActionsBasicType = {
  [k: string]: (...payload: any) => any;
}

export type ActionsType <actions extends ActionsBasicType> = {
  [k in keyof actions]: ReturnType<actions[k]>
}

export type PayloadType <actions extends ActionsType<ActionsBasicType>> = actions[keyof actions]['payload']

export const VoidAction = (actionName: string) => createAction(actionName, () => {});

export const safeAddUuid = track => {
  const clonedTrack = _.cloneDeep(track);
  if (_.isNil(track.uuid) || track.uuid.length === 0) {
    clonedTrack.uuid = v4();
  }

  return clonedTrack;
};

export function rewriteTrackArtists<T extends PlaylistTrack | Track | TrackItem>(track: T): T {
  const clonedTrack = _.cloneDeep(track);

  // @ts-expect-error For backwards compatibility we're trying to parse an invalid field
  if (clonedTrack.artists || !clonedTrack.artist) {
    return clonedTrack;
  }

  // @ts-expect-error For backwards compatibility we're trying to parse an invalid field
  clonedTrack.artists = _.isString(clonedTrack.artist) ? [clonedTrack.artist] : [clonedTrack.artist.name];
  // @ts-expect-error For backwards compatibility we're trying to parse an invalid field
  clonedTrack.artists = clonedTrack.artists.concat(clonedTrack.extraArtists?.map(artist));

  return clonedTrack;
}
