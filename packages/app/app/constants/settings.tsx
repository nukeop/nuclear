import { Setting, SettingType } from '@nuclear/core';
import { rendererSettings } from '@nuclear/core/src/settings/renderer';
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
  ...rendererSettings
];
