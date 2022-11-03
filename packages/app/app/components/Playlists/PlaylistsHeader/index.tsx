import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputDialog } from '@nuclear/ui';

import Header from '../../Header';
import styles from './styles.scss';
import { Icon } from 'semantic-ui-react';

import SpotifyPlaylistImporter from '../../../containers/SpotifyPlaylistImporter/SpotifyPlaylistImporter';

type PlaylistsHeaderProps = {
  showText: boolean;
  onImportFromFile: React.MouseEventHandler;
  onCreate: (name: string) => void;
}

const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({
  showText,
  onImportFromFile,
  onCreate
}) => {
  const { t } = useTranslation('playlists');

  return (
    <div className={styles.playlists_header_container}>
      {showText && <Header>{t('header')}</Header>}
      {!showText && <span />}

      <div className={styles.playlist_header_buttons}>
        <InputDialog
          header={<h4>Input playlist name:</h4>}
          placeholder={t('dialog-placeholder')}
          acceptLabel={t('dialog-accept')}
          cancelLabel={t('dialog-cancel')}
          onAccept={onCreate}
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
        <SpotifyPlaylistImporter />
        <Button
          basic
          onClick={onImportFromFile}
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
