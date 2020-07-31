import React, { useState } from 'react';

import { PlayerButton } from '..';

export default {
  title: 'Player button'
}

export const PlayButton = () => {
  const [icon, setIcon] = useState('play');
  const onClick = () => {
    if (icon === 'play') {
      setIcon('pause');
    } else {
      setIcon('play');
    }
  }

  return <div
    className='bg'
    style={{
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'center'
    }}
  >
    <PlayerButton
      icon={icon}
      onClick={onClick}
    />
  </div>;
}

export const PlayerControls = () => <div className='bg'>
   <PlayerButton
      icon='step backward'
      size='large'
    />
  <PlayerButton
      icon='play'
    />
     <PlayerButton
      icon='step forward'
      size='large'
    />
</div>