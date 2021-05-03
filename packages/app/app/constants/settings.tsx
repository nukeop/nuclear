import { Setting, SettingType, settingsConfig } from '@nuclear/core';
import React from 'react';

import HttpApiUrl from '../containers/HttpApiUrl';

export default [
  {
    name: 'api.url',
    category: 'http',
    type: SettingType.NODE,
    prettyName: 'api-url',
    node: <HttpApiUrl />
  } as Setting,
  ...settingsConfig
];
