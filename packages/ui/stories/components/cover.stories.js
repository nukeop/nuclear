import React from 'react';

import { Cover } from '../..';

export default {
  title: 'Components/Cover'
};

export const Basic = () => (
  <Cover cover='https://i.imgur.com/4euOws2.jpg' />
);

export const NoImage = () => (
  <Cover />
);
