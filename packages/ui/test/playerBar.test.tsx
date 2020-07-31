import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

import { makeSnapshotTest } from './helpers';
import { PlayerBar } from '../lib';

makeSnapshotTest(
  PlayerBar, 
  { 
    renderTrackDuration: true,
    timePlayed: '-3:14',
    timeToEnd: '2:43',
    fill: 66,
    track: 'Test song',
    artist: 'Test artist',
    cover: 'https://i.imgur.com/4euOws2.jpg',
    volume: 60,
    queue: { queueItems: [] },
    playOptions: [
      { icon: ('repeat' as SemanticICONS), enabled: false, name: 'Repeat' },
      { icon: ('magic' as SemanticICONS), name: 'Autoradio' },
      { icon: ('random' as SemanticICONS), enabled: false, name: 'Shuffle' }
    ],
    isMuted: false
  }, 
  '(Snapshot) Player bar'
);