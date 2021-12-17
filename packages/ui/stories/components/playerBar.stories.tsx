import React from 'react';

import { PlayerBar } from '../..';
// eslint-disable-next-line node/no-missing-import
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

export default {
  title: 'Components/Player bar'
};

export const DefaultStyle = () => <div
  className='bg'
  style={{
    display: 'flex',
    flexFlow: 'column'
  }}
>
  <span style={{ flex: '1 1 auto' }} />
  <PlayerBar
    renderTrackDuration
    timePlayed={194}
    timeToEnd={163}
    fill={66}
    track='Test song'
    artist='Test artist'
    volume={60}
    seek={() => { }}
    queue={{ queueItems: [] }}
    playOptions={[
      { icon: ('repeat' as SemanticICONS), enabled: false, name: 'Repeat' },
      { icon: ('magic' as SemanticICONS), name: 'Autoradio' },
      { icon: ('random' as SemanticICONS), enabled: false, name: 'Shuffle' }
    ]}
    onTrackClick={() => {}}
    onArtistClick={() => {}}
    addToFavorites={() => {}}
    removeFromFavorites={() => {}}
    updateVolume={() => {}}
    toggleMute={() => {}}
    isMuted={false}
  />
</div>;
