import React from 'react';

import { MiniPlayer } from '..';

export default {
  title: 'Mini player'
};

export const Example = () => <MiniPlayer
  cover='https://i.imgur.com/4euOws2.jpg'
  track='Test song'
  artist='Test artist'

  fill={66}
  seek={() => { }}
  queue={{ queueItems: [] }}

  timePlayed='-3:14'
  timeToEnd='2:43'
/>;