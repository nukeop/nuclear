import React from 'react';

import { Card } from '../..';
import _ from 'lodash';

export default {
  title: 'Components/Card'
};

export const BasicBlank = () => (
  <div className='bg'>
    <Card
      header='Title'
      content='Content'
    />
  </div>
);

export const WithAlbumCover = () => (
  <div className='bg'>
    <Card
      header='Title'
      content='Content'
      image='https://i.imgur.com/4euOws2.jpg'
    />
  </div>
);

export const WithRectangularAlbumCover = () => (
  <div
    className='bg'
    style={{ display: 'flex', flexFlow: 'row wrap', width: '100%' }}
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
);

export const RowOfCards = () => (
  <div
    className='bg'
    style={{ display: 'flex', flexFlow: 'row wrap', width: '100%' }}
  >
    {
      _.map(_.range(5), () => <Card
        header='Title'
        content='Content'
      />)
    }
  </div>
);

  
export const RowOfCardsWithLongContent = () => (
  <div
    className='bg'
    style={{ display: 'flex', flexFlow: 'row wrap', width: '100%' }}
  >
    {
      _.map(_.range(5), () => <Card
        header=' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse interdum est at massa vestibulum lacinia. Aenean enim orci, hendrerit nec feugiat at, ultricies eu neque. Praesent placerat maximus arcu vitae aliquet. Quisque eget sagittis enim. Integer porttitor sapien eget diam molestie, ut interdum tortor ullamcorper. Etiam ut lacus eget lorem faucibus egestas aliquet ac neque. Nullam faucibus, eros vel convallis vestibulum, leo orci fermentum urna, et rutrum lorem magna non velit. Aliquam fringilla, tortor non interdum ultricies, leo velit accumsan tortor, et venenatis libero leo non dui. Vivamus tristique, odio id auctor eleifend, urna risus vehicula lacus, quis auctor leo est a metus. Praesent vel lobortis est. '
        content=' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse interdum est at massa vestibulum lacinia. Aenean enim orci, hendrerit nec feugiat at, ultricies eu neque. Praesent placerat maximus arcu vitae aliquet. Quisque eget sagittis enim. Integer porttitor sapien eget diam molestie, ut interdum tortor ullamcorper. Etiam ut lacus eget lorem faucibus egestas aliquet ac neque. Nullam faucibus, eros vel convallis vestibulum, leo orci fermentum urna, et rutrum lorem magna non velit. Aliquam fringilla, tortor non interdum ultricies, leo velit accumsan tortor, et venenatis libero leo non dui. Vivamus tristique, odio id auctor eleifend, urna risus vehicula lacus, quis auctor leo est a metus. Praesent vel lobortis est. '
      />)
    }
  </div>
);

export const CardWithAMenu = () => (
  <div
    className='bg'
    style={{ display: 'flex', flexFlow: 'row wrap', width: '100%' }}
  >
    <Card
      header='Card with a menu'
      content='Test'
      withMenu
      animated={false}
      menuEntries={[
        {
          type: 'header', props: {
            children: 'Test header'
          }
        },
        { type: 'divider' },
        {
          type: 'item', props: {
            children: 'test item',
            onClick: () => alert('item clicked')
          }
        }
      ]}
    />
  </div>
);
