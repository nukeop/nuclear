import React from 'react';

import { PopupButton } from '../..';

export default {
  title: 'Components/Popup button'
};

export const Basic = () => (
  <div className='bg'>
    <PopupButton
      onClick={() => alert('Button clicked')}
      ariaLabel={'test'}
      icon='alarm'
      label={'Test button'}
    />
  </div>
);
