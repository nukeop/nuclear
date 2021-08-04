import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@nuclear/ui';

import Header from '../../Header';
import styles from './styles.scss';
import { Icon } from 'semantic-ui-react';
import InputDialog from '../../InputDialog';

type PlaylistsHeaderProps = {
  showText: boolean;
  handleImportFromFile: React.MouseEventHandler;
  createNew: (name: string) => void;
}

const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({ showText, handleImportFromFile, createNew }) => {
  const { t } = useTranslation('playlists');

  const handleAddPlaylist = (name) => {
    createNew(name);
  };

  return (
    <div className={styles.header_container}>
      {showText && <Header>{t('header')}</Header>}
      {!showText && <span />}

      <div>
        <InputDialog
          header={<h4>Input playlist name:</h4>}
          placeholder={t('dialog-placeholder')}
          accept={t('dialog-accept')}
          onAccept={handleAddPlaylist}
          testIdPrefix='create-playlist'
          trigger={
            <Button
              basic
              data-testid='create-new'
            >
              <Icon name='plus' />
              {t('create-button')}
            </Button>
          }
          initialString={t('new-playlist')}
        />
        <Button
          basic
          onClick={handleImportFromFile}
          data-testid='import-from-file'
        >
          <Icon name='file text' />
          {t('import-button')}
        </Button>
      </div>

    </div>
  );
};

export default PlaylistsHeader;
