import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Header from '../Header';
import DownloadsList from './DownloadsList';

import styles from './styles.scss';
import { useTranslation } from 'react-i18next';

const EmptyState = () => {
  const { t } = useTranslation('downloads');

  return (
    <div className={styles.empty_state}>
      <FontAwesome name='download' />
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

const Downloads = props => {
  const { downloads, clearFinishedTracks } = props;
  const { t } = useTranslation('downloads');

  return (
    <div className={styles.downloads_container}>
      {downloads.length === 0 && <EmptyState />}
      {downloads.length > 0 && (
        <React.Fragment>
          <Header>{t('downloads')}</Header>
          <DownloadsList
            items={downloads}
            clearFinishedTracks={clearFinishedTracks}
          />
        </React.Fragment>
      )}
    </div>
  );
};

Downloads.propTypes = {
  downloads: PropTypes.array,
  clearFinishedTracks: PropTypes.func
};

Downloads.defaultProps = {
  downloads: [],
  clearFinishedTracks: () => {}
};

export default Downloads;
