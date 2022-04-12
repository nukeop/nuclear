import React, { useState, useCallback } from 'react';
import { Icon, Input, Modal } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { WebviewTag } from 'electron';
import { URL } from 'url';

import { Button } from '@nuclear/ui';

import { useSpotifyPlaylistImporterProps } from './hooks';

const SpotifyPlaylistImporter: React.FC= () => {
  const { t } = useTranslation('playlists');
  const { onAccept } = useSpotifyPlaylistImporterProps(t);

  const [isOpen, setIsOpen] = useState(false);
  const [displayView, setDisplay] = useState(false);
  const [inputString, setInputString] = useState('');
  const [hasError, setError] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setInputString('');
    setDisplay(false);
  }, []);
  const handleChange = useCallback(e => {
    try {
      const playlistUrl = new URL(e.target.value);
      playlistUrl.search = '';
      setInputString(playlistUrl.toString());
      setError(false);
    } catch (error) {
      setError(true);
      setInputString(e.target.value);
    }
  }, []);

  const onClick = useCallback(() => {
    setDisplay(true);
  }, []);
  
  const webviewRef = useCallback((w: WebviewTag) => {
    if (w !== null) {
      onAccept(w, handleClose);
    }
  }, [handleClose, onAccept]);

  return (
    <Modal
      basic
      closeIcon
      dimmer='blurring'
      trigger={
        <Button
          basic
          data-testid='import-from-url'
        >
          <Icon name='file text' />
          {t('import-url-button')}
        </Button>
      }
      onClose={handleClose}
      onOpen={handleOpen}
      open={isOpen}
    >
      <Modal.Content>
        {!displayView && <h4>Input playlist url:</h4>}
        {!displayView && <Input
          fluid
          inverted
          ref={input => {
            input && input.focus();
          }}
          placeholder={t('spotify-import-placeholder')}
          onChange={handleChange}
          value={inputString}
          error={hasError}
          data-testid='spotify-playlist-importer-input'
        />}
        {displayView && <webview
          ref={webviewRef}
          src={inputString}
          data-testid='spotify-playlist-importer-webview'
          webpreferences='nodeIntegration=yes,javascript=yes,contextIsolation=no'
          useragent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.175 Safari/537.36'
          style={{ width: '500px', height: '500px' }}
        />}
      </Modal.Content>
      <Modal.Actions>
        {!displayView && <>
          <Button
            basic
            inverted
            color='red'
            onClick={handleClose}
            data-testid='spotify-playlist-importer-cancel'
          >
            {t('dialog-cancel')}
          </Button>
          <Button
            color='green'
            onClick={onClick}
            data-testid='spotify-playlist-importer-accept'
            disabled={hasError}
          >
            {t('dialog-accept')}
          </Button>
        </>
        }
      </Modal.Actions>
    </Modal>
  );
};

export default SpotifyPlaylistImporter;
