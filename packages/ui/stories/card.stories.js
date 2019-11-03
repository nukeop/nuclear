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
  .add('With rectangular album cover', () => (
    <div
      className='bg'
      style={{display: 'flex', flexFlow: 'row wrap', width: '100%'}}
    >
      <Card
        header='Title'
        content='Content'
        image='https://i.imgur.com/koC6Otx.jpg'
      />
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
  )).add('Row of cards with long content', () => (
    <div
      className='bg'
      style={{display: 'flex', flexFlow: 'row wrap', width: '100%'}}
    >
      {
        _.map(_.range(5), () => <Card
          header=' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse interdum est at massa vestibulum lacinia. Aenean enim orci, hendrerit nec feugiat at, ultricies eu neque. Praesent placerat maximus arcu vitae aliquet. Quisque eget sagittis enim. Integer porttitor sapien eget diam molestie, ut interdum tortor ullamcorper. Etiam ut lacus eget lorem faucibus egestas aliquet ac neque. Nullam faucibus, eros vel convallis vestibulum, leo orci fermentum urna, et rutrum lorem magna non velit. Aliquam fringilla, tortor non interdum ultricies, leo velit accumsan tortor, et venenatis libero leo non dui. Vivamus tristique, odio id auctor eleifend, urna risus vehicula lacus, quis auctor leo est a metus. Praesent vel lobortis est. '
          content=' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse interdum est at massa vestibulum lacinia. Aenean enim orci, hendrerit nec feugiat at, ultricies eu neque. Praesent placerat maximus arcu vitae aliquet. Quisque eget sagittis enim. Integer porttitor sapien eget diam molestie, ut interdum tortor ullamcorper. Etiam ut lacus eget lorem faucibus egestas aliquet ac neque. Nullam faucibus, eros vel convallis vestibulum, leo orci fermentum urna, et rutrum lorem magna non velit. Aliquam fringilla, tortor non interdum ultricies, leo velit accumsan tortor, et venenatis libero leo non dui. Vivamus tristique, odio id auctor eleifend, urna risus vehicula lacus, quis auctor leo est a metus. Praesent vel lobortis est. '
          small
        />)
      }
    </div>
  ));
