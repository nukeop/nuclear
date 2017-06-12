import React from 'react';

import styles from './styles.css';

class MainLayout extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div className={styles.main_layout_container + ' ' + this.props.className}>
        {this.props.children}
      </div>
    );
  }
}

export default MainLayout;
