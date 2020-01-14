import React, { useState, useCallback } from 'react';
import electron from 'electron';
import { Header, Image, Modal, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { githubContribInfo } from '../../actions/githubContrib';
import Contributors from './Contributors';

import HelpButton from '../HelpButton';
import { agplDisclaimer } from './const';

import logoImg from '../../../resources/media/logo_full_light.png';
import mastadonImg from '../../../resources/media/mastadon.png';
import styles from './styles.scss';

const handleAuthorClick = () => {
  electron.shell.openExternal('https://github.com/nukeop');
};

const handleTwitterClick = () => {
  electron.shell.openExternal('https://twitter.com/nuclear_player');
};

const handleGithubClick = (link=undefined) => {
  // By default open the nuclear repo unless specified
  electron.shell.openExternal(link || 'https://github.com/nukeop/nuclear');
};

const handleMastadonClick = () => {
  electron.shell.openExternal('https://mstdn.io/@nuclear');
};

const HelpModal = (props) => {
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
      trigger={<HelpButton onClick={() => handleOpen()} />}
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
            Copyright © <a href='#' onClick={handleAuthorClick}>nukeop</a>
            {' 2019, '}
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
      <Modal.Content>
        <div className={styles.social_icons}>
          <div className={styles.icon}>
            <Icon link size={'big'} name='twitter' onClick={handleTwitterClick}/>
          </div>
          <div className={styles.mastadon}>
            <Image src={mastadonImg} onClick={handleMastadonClick} />
          </div>
          <div className={styles.icon}>
            <Icon link size={'big'} name='github' onClick={handleGithubClick}/>
          </div>
        </div>
      </Modal.Content>
      <Modal.Content>
        <div className={styles.contributors}>
          <Header className={styles.contributors_header}>Our top 10 Contributors</Header>
          <Contributors handleGithubClick={handleGithubClick} {...props.githubContrib} />
        </div>
      </Modal.Content>
    </Modal>
  );
};

function mapStateToProps(state) {
  return {
    githubContrib: state.githubContrib
  };
}

export default withRouter(connect(mapStateToProps, {githubContribInfo})(HelpModal));
