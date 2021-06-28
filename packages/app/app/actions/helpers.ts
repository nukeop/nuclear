import { v4 } from 'uuid';
import _ from 'lodash';
import { createAction } from 'redux-actions';

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
