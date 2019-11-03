import React from 'react';
import { storiesOf } from '@storybook/react';

import { AlbumGrid } from '..';

storiesOf('Album grid', module)
  .add('Basic', () => (
    <div className='bg'>
      <AlbumGrid
        albums={[
          { title: 'test' },
          { title: 'test' },
          { title: 'test' },
          { title: 'test' }
        ]}
      />
    </div>
  ));
