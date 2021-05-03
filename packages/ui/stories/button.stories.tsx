import React from 'react';
import { Button } from '../lib';

export default {
  title: 'Button'
};

export const Buttons = () => <div className='bg column'>
  <div className='row'>
    <Button basic>Test button</Button>
    <Button>Test button</Button>
    <Button color='green'>Test button</Button>
    <Button color='blue'>Test button</Button>
    <Button color='pink'>Test button</Button>
    <Button color='red'>Test button</Button>
  </div>
  <div className='row'>
    <Button basic rounded>Test button</Button>
    <Button rounded>Test button</Button>
    <Button color='green' rounded>Test button</Button>
    <Button color='blue' rounded>Test button</Button>
    <Button color='pink' rounded>Test button</Button>
    <Button color='red' rounded>Test button</Button>
  </div>
  <div className='row'>
    <Button basic icon='play' />
  </div>
</div>;
