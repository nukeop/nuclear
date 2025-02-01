import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputDialog, PopupButton } from '@nuclear/ui';

import Header from '../../Header';
import styles from './styles.scss';
import { Icon, Popup } from 'semantic-ui-react';

import SpotifyPlaylistImporter from '../../../containers/SpotifyPlaylistImporter/SpotifyPlaylistImporter';

type PlaylistsHeaderProps = {
  onImportFromFile: React.MouseEventHandler;
  onCreate: (name: string) => void;
}

const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({
  onImportFromFile,
  onCreate
}) => {
  const { t } = useTranslation('playlists');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const onOpen = () => setIsPopupOpen(true);

  const onChildClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className={styles.playlists_header_container}>
      <Header>
        {t('header')}
        <Popup
          on='click'
          trigger={
            <Button
              data-testid='playlists-header-add-button'
              color='pink'
              circular
              className={styles.playlists_header_add_button}
            >
              <Icon name='plus' />
              {t('header-add-button')}
            </Button>
          }
          className={styles.add_playlist_popup}
          open={isPopupOpen}
          onOpen={onOpen}
        >
          <div className={styles.playlist_header_buttons}>
            <InputDialog
              header={<h4>{t('create-playlist-dialog-title')}</h4>}
              placeholder={t('dialog-placeholder')}
              acceptLabel={t('dialog-accept')}
              cancelLabel={t('dialog-cancel')}
              onAccept={onCreate}
              onClose={onChildClose}
              testIdPrefix='create-playlist'
              trigger={
                <PopupButton
                  data-testid='create-new'
                  ariaLabel={t('create-button')}
                  icon='plus'
                  label={t('create-button')}
                />
              }
              initialString={t('new-playlist')}
            />
            <SpotifyPlaylistImporter
              trigger={
                <PopupButton
                  data-testid='import-from-url'
                  icon='spotify'
                  label={t('import-url-button')}
                  ariaLabel={t('import-url-button')}
                />
              }
              onClose={onChildClose}
            />
            <PopupButton
              onClick={onImportFromFile}
              ariaLabel={t('import-button')}
              icon='file text'
              label={t('import-button')}
            />
          </div>
        </Popup>

      </Header>
      <span />
    </div>
  );
};

export default PlaylistsHeader;
