import uuidv4 from 'uuid/v4';
import _ from 'lodash';

export const safeAddUuid = item => {
  const clonedItem = _.cloneDeep(item);
  if (!_.has(item, 'uuid')) {
    clonedItem.uuid = uuidv4();
  }
  return clonedItem;
};
