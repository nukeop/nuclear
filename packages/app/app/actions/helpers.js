import uuidv4 from 'uuid/v4';
import _ from 'lodash';

export const safeAddUuid = track => {
  const clonedTrack = _.cloneDeep(track);
  if(!_.has(track, 'uuid')) {
    clonedTrack.uuid = uuidv4();
  }
  return clonedTrack;
};
