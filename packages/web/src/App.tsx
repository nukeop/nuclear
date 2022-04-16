import React from 'react';
import { PlayerBar } from '@nuclear/ui';

import { MainContentLayout } from './components/layouts/MainContentLayout';
import { Navbar } from './components/Navbar';

function App() {
  return (<MainContentLayout>
    <Navbar />
    <div
      style={{flex: '1 1 auto'}}
    >Middle</div>
    <PlayerBar 
      fill={50}
      seek={() => {}}
      queue={{
        queueItems: [],
        currentSong: 0
      }}
      segmentPopupMessage='Non-music'
      track=''
      artist=''
      onTrackClick={() => {}}
      onArtistClick={() => {}}
      addToFavorites={() => {}}
      removeFromFavorites={() => {}}
      volume={100}
      updateVolume={() => {}}
      toggleMute={() => {}}
      isMuted={false}
      playOptions={[]}
    />
  </MainContentLayout>);
}

export default App;
