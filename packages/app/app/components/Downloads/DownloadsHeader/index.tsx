import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Icon,
  Segment
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { ipcRenderer } from 'electron';

import { setStringOption } from '../../../actions/settings';
import styles from './styles.scss';
import { IpcEvents } from '@nuclear/core';

type DownloadsHeaderProps = {
  directory: string;
  setStringOption: typeof setStringOption;
};

const DownloadsHeader: React.FC<DownloadsHeaderProps> = ({
  directory,
  setStringOption
}) => {
  const { t } = useTranslation('settings');
  const [downloadsDir, setDownloadsDir] = useState<string>('');
  
  const setDirectory = useCallback(async () => {
    const selectedPath = await ipcRenderer.invoke(IpcEvents.OPEN_PATH_PICKER, {
      title: t('downloads-dir-button'),
      properties: ['openDirectory']
    });
    
    if (selectedPath) {
      setStringOption('downloads.dir', selectedPath[0]);
      setDownloadsDir(selectedPath[0]);
    }
  }, [setStringOption, t]);

  useEffect(() => {
    ipcRenderer.invoke(IpcEvents.DOWNLOAD_GET_PATH).then((storedDownloadsDir) => {
      setDownloadsDir(_.isEmpty(directory) ? storedDownloadsDir : directory);
    });
  }, []);

  return (
    <Segment className={styles.downloads_header}>
      <span className={styles.label}>
        {t('saving-in')}
        <span className={styles.directory}>
          {downloadsDir}
        </span>
      </span>
      <Button
        icon
        inverted
        labelPosition='left'
        onClick={setDirectory}
      >
        <Icon name='folder open' />
        {t('downloads-dir-button')}
      </Button>
    </Segment>
  );
};

export default DownloadsHeader;
