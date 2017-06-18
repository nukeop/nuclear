import React from 'react';

import styles from './styles.css';

class Header extends React.Component {

  render() {
    return (
      <div className={styles.header_container}>
        {this.props.children}
      </div>
    );
  }
}

export default Header;
