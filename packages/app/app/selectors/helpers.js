import _ from 'lodash';

export const createStateSelectors = (subtreeKey, keys) => {
  return _.fromPairs(_.map(keys, key => [
    key,
    state => _.get(state, `${subtreeKey}.${key}`)
  ]));
};
