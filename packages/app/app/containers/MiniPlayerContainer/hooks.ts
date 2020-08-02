import _ from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import settingsConst from '../../constants/settings';
import * as settingsActions from '../../actions/settings';
import { settingsSelector } from '../../selectors/settings';

export const useMiniPlayerSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);

  const isMiniPlayerEnabled = _.get(settings, 'miniPlayer');
  const toggleMiniPlayer = useCallback(
    () => dispatch(settingsActions.toggleOption(
      _.find(settingsConst, { name: 'miniPlayer' }),
      settings
    )),
    [dispatch, settings]
  );

  return {
    isMiniPlayerEnabled,
    toggleMiniPlayer
  };
};
