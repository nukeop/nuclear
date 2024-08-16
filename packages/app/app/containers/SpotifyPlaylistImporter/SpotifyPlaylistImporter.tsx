import React, { useState, useCallback } from 'react';
import { Input, Modal } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { URL } from 'url';

import { Button } from '@nuclear/ui';

type SpotifyPlaylistImporterProps = {
  trigger: React.ReactNode;
  onClose: () => void;
}

const SpotifyPlaylistImporter: React.FC<SpotifyPlaylistImporterProps> = ({ 
  trigger,
  onClose: onCloseProp
}) => {
  const { t } = useTranslation('playlists');
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);
  const [inputString, setInputString] = useState('');

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setInputString('');
    onCloseProp();
  }, []);
  const handleChange = useCallback(e => {
    try {
      const playlistUrl = new URL(e.target.value);
      playlistUrl.search = '';
      setInputString(playlistUrl.toString());
    } catch (error) {
      setInputString(e.target.value);
    }
  }, []);

  const onClick = useCallback(() => {
    const playlistId = inputString.split('/').pop();
    return history.push(`/playlists/spotify/${playlistId}`);
  }, [inputString, history]);

  return (
    <Modal
      basic
      closeIcon
      dimmer='blurring'
      trigger={trigger}
      onClose={handleClose}
      onOpen={handleOpen}
      open={isOpen}
    >
      <Modal.Content>
        <h4>{t('input-playlist-url')}</h4>
        <Input
          fluid
          inverted
          ref={input => {
            input && input.focus();
          }}
          placeholder={t('spotify-import-placeholder')}
          onChange={handleChange}
          value={inputString}
          data-testid='spotify-playlist-importer-input'
        />
      </Modal.Content>
      <Modal.Actions>
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
        >
          {t('dialog-import')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default SpotifyPlaylistImporter;
