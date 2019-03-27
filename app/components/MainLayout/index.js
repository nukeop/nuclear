import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import styles from './styles.scss';

class MainLayout extends React.Component {
  render() {
    return (
      <div className={cx(styles.main_layout_container, this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}

export default MainLayout;
