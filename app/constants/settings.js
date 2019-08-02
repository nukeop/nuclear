import React from 'react';
import settingType from '../../common/settingsEnum';
import settingsBase from '../../common/settings';

import HttpApiUrl from '../containers/HttpApiUrl';

export default [
  {
    name: 'api.url',
    category: 'http',
    type: settingType.NODE,
    prettyName: 'api-url',
    node: <HttpApiUrl />
  },
  ...settingsBase
];
