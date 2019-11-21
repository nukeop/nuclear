import React from 'react';
import { storiesOf } from '@storybook/react';

import { PopupButton } from '..';

storiesOf('Popup button', module)
  .add('Basic', () => (
    <div className='bg'>
      <PopupButton
        onClick={() => alert('Button clicked')}
        ariaLabel={'test'}
        icon='alarm'
        label={'Test button'}
      />
    </div>
  ));
