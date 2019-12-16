import React from 'react';
import { storiesOf } from '@storybook/react';

import {Cover, Seekbar, Loader} from '..';
import './styles.scss';

storiesOf('Cover', module)
  .add('Basic', () => (
    <Cover cover='https://i.imgur.com/4euOws2.jpg'/>
  ));

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
