import React from 'react';

import './app.global.css';
import styles from './styles.css';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import VerticalPanel from './components/VerticalPanel';
import Spacer from './components/Spacer';

import Cover from './components/Cover';
import PlayerControls from './components/PlayerControls';
import Seekbar from './components/Seekbar';

class App extends React.Component {
  render() {
    return (
      <div className={styles.app_container}>
        <Navbar className={styles.navbar}/>
        <div className={styles.panel_container}>
          <VerticalPanel className={styles.left_panel}/>
          <VerticalPanel className={styles.center_panel}/>
          <VerticalPanel className={styles.right_panel}/>
        </div>
        <Footer className={styles.footer}>
          <Seekbar fill="30%"/>
          <div className={styles.footer_wrapper}>
            <Cover cover="http://cdn.theobelisk.net/obelisk/wp-content/uploads/2012/01/vol4cover.jpg"/>
            <Spacer />
            <PlayerControls />
            <Spacer />
          </div>
        </Footer>

      </div>
    );
  }
}

export default App;
