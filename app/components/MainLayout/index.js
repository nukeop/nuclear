import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.css';




class MainLayout extends React.Component {
  render() {
    return (
      <div className={styles.main_layout_container + ' ' + this.props.className}>
        {this.props.children}
      </div>
    );
  }
}

export default MainLayout;
