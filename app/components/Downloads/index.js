import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';

import styles from './styles.scss';

const Downloads = props => {
  return (
    <div className={styles.downloads_container}>
      <Header>
        Downloads
      </Header>
    </div>
  );
};

Downloads.propTypes = {

};

export default Downloads;
