import { SettingType, settingsConfig } from '@nuclear/common';
import React from 'react';

import HttpApiUrl from '../containers/HttpApiUrl';

export default [
  {
    name: 'api.url',
    category: 'http',
    type: SettingType.NODE,
    prettyName: 'api-url',
    node: <HttpApiUrl />
  },
  ...settingsConfig
];
