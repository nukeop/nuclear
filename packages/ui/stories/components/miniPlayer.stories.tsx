import React from 'react';
import { SemanticICONS } from 'semantic-ui-react';

import { MiniPlayer } from '../..';

export default {
  title: 'Components/Mini player'
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

  onDisableMiniPlayer={() => {}}
  addToFavorites={() => {}}
  removeFromFavorites={() => {}}
  playOptions={[
    { icon: ('repeat' as SemanticICONS), enabled: false, name: 'Repeat' },
    { icon: ('magic' as SemanticICONS), name: 'Autoradio' },
    { icon: ('random' as SemanticICONS), enabled: false, name: 'Shuffle' }
  ]}
/>;
