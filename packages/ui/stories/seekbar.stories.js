import React from 'react';
import { storiesOf } from '@storybook/react';

import { Seekbar } from '..';

storiesOf('Seekbar', module)
  .add('Basic', () => {
    return (
      <div>
        Seekbars filled to various levels.
        <br /><br />
        60%:
        <Seekbar fill='60%' />
        <br />
        70%:
        <Seekbar fill='70%' />
        <br />
        80%:
        <Seekbar fill='80%' />
        <br />
        30%:
        <Seekbar fill='30%' />
        <br />
        10%:
        <Seekbar fill='10%' />
        <br />
      </div>
    );
  });
