import React, { useCallback } from 'react';
import _ from 'lodash';
import {
  Button,
  Icon,
  Segment
} from 'semantic-ui-react';
import { remote } from 'electron';
import { useTranslation } from 'react-i18next';

import { setStringOption } from '../../../actions/settings';
import styles from './styles.scss';

type DownloadsHeaderProps = {
  directory: string;
  setStringOption: typeof setStringOption;
};

const DownloadsHeader: React.FC<DownloadsHeaderProps> = ({
  directory,
  setStringOption
}) => {
  const { t } = useTranslation('settings');
  const setDirectory = useCallback(async () => {
    const dialogResult = await remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (!dialogResult.canceled && !_.isEmpty(dialogResult.filePaths)) {
      setStringOption(
        'downloads.dir',
        _.head(dialogResult.filePaths)
      );
    }
  }, [setStringOption]);

  return (
    <Segment className={styles.downloads_header}>
      <span className={styles.label}>
        {t('saving-in')}
        <span className={styles.directory}>
          {_.isEmpty(directory) ? remote.app.getPath('downloads') : directory}
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
