import { SemanticICONS } from 'semantic-ui-react';

import { makeSnapshotTest } from './helpers';
import { MiniPlayer } from '../lib';

makeSnapshotTest(
  MiniPlayer,
  {
    cover: 'https://i.imgur.com/4euOws2.jpg',
    track: 'Test song',
    artist: 'Test artist',

    fill: 66,
    seek: () => { },
    queue: { queueItems: [] },

    timePlayed: 194,
    timeToEnd: 163,

    onDisableMiniPlayer: () => { },
    addToFavorites: () => { },
    removeFromFavorites: () => { },
    playOptions: [
      { icon: ('repeat' as SemanticICONS), enabled: false, name: 'Repeat' },
      { icon: ('magic' as SemanticICONS), name: 'Autoradio' },
      { icon: ('random' as SemanticICONS), enabled: false, name: 'Shuffle' }
    ]
  },
  '(Snapshot) Mini player'
);
