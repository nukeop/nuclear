import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@nuclear/ui';

import Header from '../../Header';
import styles from './styles.scss';
import { Icon } from 'semantic-ui-react';
import InputDialog from '../../InputDialog';
import PlayListDialog from '../../PlayListDialog';

import extractPlaylist from '@nuclear/core/src/helpers/playlist/spotify';

type PlaylistsHeaderProps = {
  showText: boolean;
  onImportFromFile: React.MouseEventHandler;
  onImportFromUrl: (data: string) => void,
  onCreate: (name: string) => void;
}

const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({
  showText,
  onImportFromFile,
  onImportFromUrl,
  onCreate
}) => {
  const { t } = useTranslation('playlists');

  return (
    <div className={styles.header_container}>
      {showText && <Header>{t('header')}</Header>}
      {!showText && <span />}

      <div>
        <InputDialog
          header={<h4>Input playlist name:</h4>}
          placeholder={t('dialog-placeholder')}
          accept={t('dialog-accept')}
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
        <PlayListDialog header={<h4>Input playlist url:</h4>}
          placeholder={t('dialog-placeholder')}
          accept={t('dialog-accept')}
          onAccept={(w, handleClose) => {
            if (w !== null) {
              w.addEventListener('dom-ready', () => {
                w.addEventListener('ipc-message', event => {
                  onImportFromUrl(event.channel);
                  handleClose();
                });
                setTimeout(() => {
                  w.executeJavaScript(`(function() {
                    const ipcRenderer = window.require('electron').ipcRenderer;
                    (${extractPlaylist.toString()})()
                    }
                    )()`.replace('electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"]', 'ipcRenderer'));
                }, 1500);
              });
            }
          }}
          testIdPrefix='import-playlist-by-url'
          trigger={// //
            <Button
              basic
              data-testid='import-from-url'
            >
              <Icon name='file text' />
              {t('import-url-button')}
            </Button>
          }
          initialString={t('new-playlist')} />
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
