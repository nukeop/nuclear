import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputDialog, PopupButton } from '@nuclear/ui';

import Header from '../../Header';
import styles from './styles.scss';
import { Icon, Popup } from 'semantic-ui-react';

import SpotifyPlaylistImporter from '../../../containers/SpotifyPlaylistImporter/SpotifyPlaylistImporter';
import {noop} from 'lodash';

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
      {showText && <Header>
        {t('header')}
        <Popup
          on='click'
          hideOnScroll
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
        >
          <div className={styles.playlist_header_buttons}>
            <InputDialog
              header={t('create-playlist-dialog-title')}
              placeholder={t('dialog-placeholder')}
              acceptLabel={t('dialog-accept')}
              cancelLabel={t('dialog-cancel')}
              onAccept={onCreate}
              testIdPrefix='create-playlist'
              trigger={
                <PopupButton
                  onClick={noop}
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
                  onClick={noop}
                  data-testid='import-from-url'
                  icon='spotify'
                  label={t('import-url-button')}
                  ariaLabel={t('import-url-button')}
                />
              }
            />
            <PopupButton
              onClick={onImportFromFile}
              ariaLabel={t('import-button')}
              icon='file text'
              label={t('import-button')}
            />
          </div>
        </Popup>
      
      </Header>}
      {!showText && <span />}
      

    </div>
  );
};

export default PlaylistsHeader;
