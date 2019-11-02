import React from 'react';
import { storiesOf } from '@storybook/react';

import { Card } from '..';

storiesOf('Cards', module)
  .add('Basic blank', () => (
    <div className='bg'>
      <Card
        header='Title'
        content='Content'
      />
    </div>
  ))
  .add('With album cover', () => (
    <div className='bg'>
      <Card
        header='Title'
        content='Content'
        image='https://i.imgur.com/4euOws2.jpg'
      />
    </div>
  ))
  .add('Row of cards', () => (
    <div
      className='bg'
      style={{display: 'flex', flexFlow: 'row wrap', width: '100%'}}
    >
      {
        _.map(_.range(5), () => <Card
          header='Title'
          content='Content'
        />)
      }
    </div>
  ))
  .add('Row of small cards', () => (
    <div
      className='bg'
      style={{display: 'flex', flexFlow: 'row wrap', width: '100%'}}
    >
      {
        _.map(_.range(5), () => <Card
          header='Title'
          content='Content'
          small
        />)
      }
    </div>
  ));
