import React from 'react';

import styles from './styles.css';

class MainLayout extends React.Component {
  render() {
    return (
      <div className={styles.main_layout_container + ' ' + this.props.className}>
        {React.cloneElement(this.props.children, {
          unifiedSearchResults: this.props.unifiedSearchResults
        })}
      </div>
    );
  }
}

export default MainLayout;
