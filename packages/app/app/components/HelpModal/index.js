import React, { useState, useCallback } from 'react';
import electron from 'electron';
import cx from 'classnames';
import { Header, Image, Modal, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';

import { githubContribInfo } from '../../actions/githubContrib';
import Contributors from './Contributors';

import HelpButton from '../HelpButton';
import { agplDisclaimer } from './const';

import logoImg from '../../../resources/media/logo_full_light.png';
import mastodonImg from '../../../resources/media/mastodon.svg';
import styles from './styles.scss';

const HelpModal = ({
  handleAuthorClick,
  handleGithubClick,
  handleTwitterClick,
  handleMastodonClick,
  handleDiscordClick,
  githubContrib
}) => {
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
            <Icon link size='big' name='twitter' onClick={handleTwitterClick} />
          <div
          className={cx(styles.mastodon, styles.icon)} 
          onClick={handleMastodonClick}
          dangerouslySetInnerHTML={{ __html: mastodonImg }}
          />
            <Icon link size='big' name='discord' onClick={handleDiscordClick} />
            <Icon link size='big' name='github' onClick={handleGithubClick} />
        </div>
      </Modal.Content>
      <Modal.Content>
        <div className={styles.contributors}>
          <Header className={styles.contributors_header}>Our top 10 Contributors</Header>
          <Contributors handleGithubClick={handleGithubClick} {...githubContrib} />
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

export default compose(
  withRouter,
  connect(mapStateToProps, {githubContribInfo}),
  withHandlers({
    handleMastodonClick: () => () => electron.shell.openExternal('https://mstdn.io/@nuclear'),
    handleGithubClick: () => link => electron.shell.openExternal(_.defaultTo(link, 'https://github.com/nukeop/nuclear')),
    handleTwitterClick: () => () => electron.shell.openExternal('https://twitter.com/nuclear_player'),
    handleAuthorClick: () => () => electron.shell.openExternal('https://github.com/nukeop'),
    handleDiscordClick: () => () => electron.shell.openExternal('https://discord.gg/JqPjKxE')
  })
  )(HelpModal);
