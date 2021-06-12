import React from 'react';

import { Checkbox } from '..';

export default {
  title: 'Checkbox'
};

export const CheckboxStates = () => <div className='bg row'>
  <Checkbox />
  <Checkbox indeterminate />
  <Checkbox checked />
</div>;
