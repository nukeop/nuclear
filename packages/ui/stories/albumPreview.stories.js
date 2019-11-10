import React from 'react';
import { storiesOf } from '@storybook/react';

import { AlbumPreview } from '..';

storiesOf('Album preview', module)
  .add('Basic', () => (
    <div className='bg'>
      <AlbumPreview
        album={{
          name: 'test album',
          artist: {
            name: 'test artist'
          },
          image: [{'#text': 'https://i.imgur.com/4euOws2.jpg'}]
        }}
      />
    </div>
  ));
