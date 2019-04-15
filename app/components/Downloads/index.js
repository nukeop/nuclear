import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Header from '../Header';
import DownloadsList from './DownloadsList';

import styles from './styles.scss';

const EmptyState = () => {
  return (
    <div className={styles.empty_state}>
      <FontAwesome name='download'/>
      <h2>
          Downloads are empty.
      </h2>
      <div>
        Add something to your download queue and you'll see it here!
      </div>
    </div>
  );
};

const Downloads = props => {
  return (
    <div className={styles.downloads_container}>
      
      {
        props.downloads.length === 0 &&
          <EmptyState />
      }
      {
        props.downloads.length > 0 &&
        <React.Fragment>
          <Header>
                      Downloads
          </Header>
          <DownloadsList
            items={ props.downloads }
          />
        </React.Fragment>
      }
    </div>
  );
};

Downloads.propTypes = {
  downloads: PropTypes.array
};

export default Downloads;
