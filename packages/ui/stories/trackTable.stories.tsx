// tslint:disable: jsx-no-plain-text-elements
import React from 'react';

import { TrackTable } from '..';


export default {
  title: 'Components/TrackTable',
  component: TrackTable
};

export const Empty = () => <div>
  <TrackTable
    tracks={[]}
    positionHeader='Position'
    thumbnailHeader='Thumbnail'
    artistHeader='Artist'
    titleHeader='Title'
  />
</div>;

export const ExampleData = () => <div>
  <TrackTable
    tracks={[
      {
        position: 0, 
        thumbnail: 'https://i.imgur.com/4euOws2.jpg', 
        artist: 'Test Artist',
        title: 'Test Title'
      }
    ]}
    positionHeader='Position'
    thumbnailHeader='Thumbnail'
    artistHeader='Artist'
    titleHeader='Title'
  />
</div>;
