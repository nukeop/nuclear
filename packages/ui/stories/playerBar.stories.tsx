import React from 'react';

import { PlayerBar } from '..';

export default {
  title: 'Player bar'
};

export const DefaultStyle = () => <div 
className='bg'
style={{
display: 'flex',
flexFlow: 'column'
}}
>
  <span style={{flex: '1 1 auto'}} />
  <PlayerBar
  fill={66}
  track='Test song'
  artist='Test artist'
  volume={60}
  seek={() => {}}
  queue={{ queueItems: [] }}
  playOptions={[
    {icon: 'repeat', enabled: false},
    {icon: 'magic'},
    {icon: 'random', enabled: false}
  ]}
  />
</div>;