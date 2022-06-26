import React from 'react';

import { ResizeHandle } from '../..';

export default {
  title: 'Components/Resize Handle',
  component: ResizeHandle,
  parameters: {
    percy: {
      skip: true
    }
  }
};

export const Vertical = () => <div className='bg'>
  <ResizeHandle vertical />
</div>;

export const Horizontal = () => <div className='bg'>
  <ResizeHandle />
</div>;
