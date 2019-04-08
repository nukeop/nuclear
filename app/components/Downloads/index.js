import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';

import DownloadsList from './DownloadsList';

import styles from './styles.scss';

const Downloads = props => {
  return (
    <div className={styles.downloads_container}>
      <Header>
        Downloads
      </Header>
      <DownloadsList
        items={ props.downloads }
      />
    </div>
  );
};

Downloads.propTypes = {
  downloads: PropTypes.array
};

export default Downloads;
