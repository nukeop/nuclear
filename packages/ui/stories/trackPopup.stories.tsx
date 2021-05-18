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
    withAddToDownloads={false}
    withAddToFavorites={false}
    withAddToPlaylist={false}
    withAddToQueue={false}
    withPlayNow={false}
    {...track}
  />
</div>;

export const WithAllButtons = () => <div className='bg'>
  <TrackPopup
    trigger={<Button>Click here</Button>}
    playlists={[
      { name: 'playlist 1'},
      { name: 'playlist 2'},
      { name: 'another playlist'}
    ]}
    {...track}
  />
</div>;
