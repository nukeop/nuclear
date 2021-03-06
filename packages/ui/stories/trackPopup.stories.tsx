import React from 'react';
import { Button } from 'semantic-ui-react';

import { TrackPopup } from '..';

export default {
  title: 'Track popup'
};

const track = {
  artist: 'Test',
  title: 'Test title',
  thumb: 'https://i.imgur.com/4euOws2.jpg'
};

export const WithNoButtons = () => <div className='bg'>
  <TrackPopup
    trigger={<Button>Click here</Button>}
    {...track}
  />
</div>;

export const WithAllButtons = () => <div className='bg'>
  <TrackPopup
    trigger={<Button>Click here</Button>}
    {...track}
    withAddToQueue
    withPlayNow
    withAddToFavorites
    withAddToDownloads
  />
</div>;
