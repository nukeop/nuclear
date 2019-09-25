import React from 'react';
import { storiesOf } from '@storybook/react';

import Cover from '../lib/components/Cover';

storiesOf('Cover', module)
  .add('Basic', () => (
    <Cover cover='https://i.imgur.com/4euOws2.jpg'/>
  ));
