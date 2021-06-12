import React from 'react';
import { ButtonProps, Icon } from 'semantic-ui-react';

import { Button } from '../lib';

export default {
  title: 'Button'
};

const propsList: ButtonProps[] = [
  { basic: true },
  {},
  { color: 'green' },
  { color: 'blue' },
  { color: 'purple' },
  { color: 'pink' },
  { color: 'orange' },
  { color: 'red' }
];

export const Buttons = () => <div className='bg column'>
  <h3>Regular</h3>
  <div className='row'>
    {propsList.map((props, i) => <Button key={i} {...props}>Test button</Button>)}
  </div>
  <h3>Round</h3>
  <div className='row'>
    {propsList.map((props, i) => <Button key={i} {...props} circular>Test button</Button>)}
  </div>
  <h3>Regular icon buttons</h3>
  <div className='row'>
    {propsList.map((props, i) => <Button key={i} {...props} icon='play' />)}
  </div>
  <h3>Round icon buttons</h3>
  <div className='row'>
    {propsList.map((props, i) => <Button key={i} {...props} circular icon='file' />)}
  </div>
  <h3>Regular buttons with icons and text</h3>
  <div className='row'>
    {propsList.map((props, i) => <Button key={i} {...props} >
      <Icon name='file text' />
      Test button
    </Button>)}
  </div>
  <h3>Round buttons with icons and text</h3>
  <div className='row'>
    {propsList.map((props, i) => <Button key={i} {...props} circular>
      <Icon name='star' />
      Test button
    </Button>)}
  </div>
</div>;
