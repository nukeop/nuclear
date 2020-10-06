import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Header from '../Header';
import DownloadsList from './DownloadsList';
import DownloadsHeader from './DownloadsHeader';

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

const Downloads = ({
  downloads,
  downloadsDir,
  clearFinishedTracks,
  setStringOption,
  resumeDownload,
  pauseDownload,
  removeDownload
}) => {
  const { t } = useTranslation('downloads');

  return (
    <div className={styles.downloads_container}>
      <DownloadsHeader
        directory={downloadsDir}
        setStringOption={setStringOption}
      />
      {downloads.length === 0 && <EmptyState />}
      {downloads.length > 0 && (
        <React.Fragment>
          <Header>{t('header')}</Header>
          <DownloadsList
            items={downloads}
            clearFinishedTracks={clearFinishedTracks}
            resumeDownload={resumeDownload}
            pauseDownload={pauseDownload}
            removeDownload={removeDownload}
          />
        </React.Fragment>
      )}
    </div>
  );
};

Downloads.propTypes = {
  downloads: PropTypes.array,
  downloadsDir: PropTypes.string,
  clearFinishedTracks: PropTypes.func,
  setStringOption: PropTypes.func,
  resumeDownload: PropTypes.func.isRequired,
  pauseDownload: PropTypes.func.isRequired
};

Downloads.defaultProps = {
  downloads: [],
  downloadsDir: '',
  clearFinishedTracks: () => {},
  setStringOption: () => {},
  pauseDownload: () => {},
  resumeDownload: () => {}
};

export default Downloads;
