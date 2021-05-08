import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@nuclear/ui';

import Header from '../../Header';
import styles from './styles.scss';
import { Icon } from 'semantic-ui-react';

type PlaylistsHeaderProps = {
  showText: boolean;
  handleImportFromFile: React.MouseEventHandler;
}

const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({ showText, handleImportFromFile }) => {
  const { t } = useTranslation('playlists');

  return (
    <div className={styles.header_container}>
      {showText && <Header>{t('header')}</Header>}
      {!showText && <span />}

      <Button
        basic
        onClick={handleImportFromFile}
        data-testid='import-from-file'
      >
        <Icon name='file text' />
        {t('import-button')}
      </Button>

    </div>
  );
};

export default PlaylistsHeader;
