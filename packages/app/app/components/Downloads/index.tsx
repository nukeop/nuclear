import React from 'react';
import FontAwesome from 'react-fontawesome';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import DownloadsList from './DownloadsList';
import DownloadsHeader from './DownloadsHeader';
import styles from './styles.scss';
import { setStringOption } from '../../actions/settings';
import { Download } from '@nuclear/ui/lib/types';

const EmptyState: React.FC = () => {
  const { t } = useTranslation('downloads');

  return (
    <div className={styles.empty_state}>
      <FontAwesome name='download' />
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

type DownloadsProps = {
  downloads: Download[];
  downloadsDir: string;
  setStringOption: typeof setStringOption;
  clearFinishedTracks: React.MouseEventHandler;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  removeDownload: (id: string) => void;
}

const Downloads: React.FC<DownloadsProps> = ({
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

export default Downloads;
