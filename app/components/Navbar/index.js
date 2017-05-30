import React from 'react';

import styles from './styles.css';

class Navbar extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}

export default Navbar;
