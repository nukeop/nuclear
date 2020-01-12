import React from 'react';
import { storiesOf } from '@storybook/react';

import { Cover } from '..';

storiesOf('Cover', module)
  .add('Basic', () => (
    <Cover cover='https://i.imgur.com/4euOws2.jpg' />
  ))
  .add('No image', () => (
    <Cover />
  ));
