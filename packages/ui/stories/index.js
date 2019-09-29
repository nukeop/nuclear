import React from 'react';
import { storiesOf } from '@storybook/react';

import {Cover} from '@nuclear/ui';

storiesOf('Cover', module)
  .add('Basic', () => (
    <Cover cover='https://i.imgur.com/4euOws2.jpg'/>
  ));
