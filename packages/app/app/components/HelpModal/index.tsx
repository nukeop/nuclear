import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import Contributors, { ContributorState } from './Contributors';

import HelpButton from '../HelpButton';
import { agplDisclaimer } from './const';

import logoImg from '../../../resources/media/logo_full_light.png';
import mastodonImg from '../../../resources/media/mastodon.svg';
import styles from './styles.scss';

export type HelpModalProps = {
  githubContrib: ContributorState;
  handleOpenExternalLink: (link:string) => void;
  handleMastodonClick: () => void;
  handleGithubClick: () => void;
  handleTwitterClick: () => void;
  handleAuthorClick: () => void;
  handleDiscordClick: () => void;
  handleReportIssueClick: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({
  githubContrib,
  handleOpenExternalLink,
  handleMastodonClick,
  handleGithubClick,
  handleTwitterClick,
  handleAuthorClick,
  handleDiscordClick,
  handleReportIssueClick
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
      trigger={<HelpButton onClick={handleOpen} />}
      className={styles.help_modal}
    >
      <Modal.Header>{t('about')}</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='medium' src={logoImg} />
        <Modal.Description>
          <Header inverted>{t('header')}</Header>
          <p>
            Copyright ©{' '}
            <a
              href='#'
              data-testid='author-link'
              onClick={handleAuthorClick}
            >
              nukeop
            </a>
            {` ${new Date().getFullYear()}, `}
            {t('released')}
          </p>
          <p>{t('thanks')}</p>
          <Button
            data-testid='issue-link'
            inverted
            onClick={handleReportIssueClick}
            content={t('report')}
          />
        </Modal.Description>
      </Modal.Content>
      <Modal.Content>
        <Modal.Description>{agplDisclaimer}</Modal.Description>
      </Modal.Content>
      <Modal.Content>
        <div className={styles.social_icons}>
          <Icon
            data-testid='twitter-link'
            link
            size='big'
            name='twitter'
            onClick={handleTwitterClick}
          />
          <div
            data-testid='mastodon-link'
            className={cx(styles.mastodon, styles.icon)}
            onClick={handleMastodonClick}
            dangerouslySetInnerHTML={{ __html: mastodonImg }}
          />
          <Icon
            data-testid='discord-link'
            link
            size='big'
            name='discord'
            onClick={handleDiscordClick}
          />
          <Icon
            data-testid='github-link'
            link
            size='big'
            name='github'
            onClick={handleGithubClick}
          />
        </div>
      </Modal.Content>
      <Modal.Content>
        <div className={styles.contributors}>
          <Header className={styles.contributors_header}>
            {t('contributors')}
          </Header>
          <Contributors
            {...githubContrib}
            handleOpenExternalLink={handleOpenExternalLink}
          />
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default HelpModal;
