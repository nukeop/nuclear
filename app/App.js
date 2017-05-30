import React from 'react';

import './app.global.css';
import styles from './styles.css';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import VerticalPanel from './components/VerticalPanel';

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
        <Footer className={styles.footer}/>
      </div>
    );
  }
}

export default App;
