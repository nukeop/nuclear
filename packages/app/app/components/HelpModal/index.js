import React, { useState, useCallback } from 'react';
import electron from 'electron';
import { Header, Image, Modal } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import HelpButton from '../HelpButton';
import { agplDisclaimer } from './const';

import logoImg from '../../../resources/media/logo_full_light.png';
import styles from './styles.scss';

const handleAuthorClick = () => {
  electron.shell.openExternal('https://github.com/nukeop');
};

const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const { t } = useTranslation('help');

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      basic
      centered
      dimmer='blurring'
      trigger={<HelpButton onClick={handleOpen} />}
      className={styles.help_modal}
    >
      <Modal.Header>{t('about')}</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='medium' src={logoImg} />
        <Modal.Description>
          <Header inverted>
            {t('header')}
          </Header>
          <p>
            Copyright © <a href='#' onClick={handleAuthorClick}>nukeop</a> 2019,
            {t('released')}
          </p>
          <p>
            {t('thanks')}
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Content>
        <Modal.Description>{agplDisclaimer}</Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default HelpModal;
