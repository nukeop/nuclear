import React from 'react';
import { storiesOf } from '@storybook/react';

import { Loader } from '..';

storiesOf('Loader', module)
  .add('Default', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        width: '100%',
        padding: '1em',
        boxSizing: 'border-box'
      }}>
        <Loader />
      </div>
    );
  })
  .add('Circle', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        width: '100%',
        padding: '1em',
        boxSizing: 'border-box'
      }}>
        <Loader type='circle'/>
      </div>
    );
  })
  .add('Small', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        width: '100%',
        padding: '1em',
        boxSizing: 'border-box'
      }}>
        <Loader type='small'/>
      </div>
    );
  })
  .add('Small overflowing its box', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '4em',
        width: '4em',
        padding: '1em',
        boxSizing: 'border-box'
      }}>
        <div
          style={{
            height: '1em',
            width: '1em'
          }}
        >
          <Loader type='small'/>
        </div>
      </div>
    );
  });
