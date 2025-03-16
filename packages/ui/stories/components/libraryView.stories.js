import React from 'react';

import { LibraryListTypeToggle } from '../..';

export default {
  title: 'Components/Library list type toggle'
};

export const Basic = () => (
  <div className='bg'>
    <LibraryListTypeToggle toggleListType={alert}/>
  </div>
);
