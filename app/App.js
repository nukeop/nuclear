import React from 'react';

import './app.global.css';
import styles from './styles.css';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import VerticalPanel from './components/VerticalPanel';
import Spacer from './components/Spacer';

import SearchBox from './components/SearchBox';

import Cover from './components/Cover';
import PlayerControls from './components/PlayerControls';
import PlayQueue from './components/PlayQueue';
import Seekbar from './components/Seekbar';
import TrackInfo from './components/TrackInfo';
import WindowControls from './components/WindowControls';

import { queueData } from './mocks/queueMock';

class App extends React.Component {
  render() {
    return (
      <div className={styles.app_container}>
        <Navbar className={styles.navbar}>
          <SearchBox />
          <Spacer />
          <Spacer />
          <WindowControls />
        </Navbar>
        <div className={styles.panel_container}>
          <VerticalPanel className={styles.left_panel}/>
          <VerticalPanel className={styles.center_panel}/>
          <VerticalPanel className={styles.right_panel}>
            <PlayQueue items={queueData}/>
          </VerticalPanel>
        </div>
        <Footer className={styles.footer}>
          <Seekbar fill="30%"/>
          <div className={styles.footer_horizontal}>
            <div className={styles.track_info_wrapper}>
              <Cover cover="http://cdn.theobelisk.net/obelisk/wp-content/uploads/2012/01/vol4cover.jpg"/>
              <TrackInfo track="Supernaut" artist="Black Sabbath" />
            </div>
            <PlayerControls />
            <Spacer />
          </div>
        </Footer>

      </div>
    );
  }
}

export default App;
