import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { PlayerBar } from '@nuclear/ui';

import { AppLayout } from './components/layouts/AppLayout';
import { NavbarContainer } from './containers/NavbarContainer';
import { SearchResultsContainer } from './containers/SearchResultsContainer';
import { PageLayout } from './components/layouts/PageLayout';

function App() {
  
  return (
    <HashRouter>
      <AppLayout>
        <NavbarContainer />
        <PageLayout>
          <Routes>
            <Route index />
            <Route path='/search/:query' element={<SearchResultsContainer />} />
          </Routes>
        </PageLayout>
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
      </AppLayout>
    </HashRouter>
  );
}

export default App;
