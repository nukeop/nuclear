import React from 'react';

import './app.global.css';
import styles from './styles.css';

import VerticalPanel from './components/VerticalPanel';

class App extends React.Component {
  render() {
    console.log(styles);
    return (
      <div className={styles.app_container}>
        <div className={styles.panel_container}>
          <VerticalPanel />
          <VerticalPanel />
          <VerticalPanel />
        </div>
      </div>
    );
  }
}

export default App;
