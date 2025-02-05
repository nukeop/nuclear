import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Radio, Segment } from 'semantic-ui-react';
import { Button } from '@nuclear/ui';

import ImportFavsReducer from '../../../reducers/importfavs';
import ScrobblingReducer from '../../../reducers/scrobbling';
import Spacer from '../../Spacer';
import SocialIntegration from '../SocialIntegration';

import styles from '../styles.scss';

type LastFmSocialIntegrationProps = {
  actions: {
    fetchAllFmFavorites: React.MouseEventHandler;
    enableScrobbling: Function;
    disableScrobbling: Function;
    lastFmConnectAction: React.MouseEventHandler;
    lastFmLoginAction: (authToken: string) => void;
    lastFmLogOut: React.MouseEventHandler;
  };
  scrobbling: ReturnType<typeof ScrobblingReducer>;
  importfavs: ReturnType<typeof ImportFavsReducer>;
}

export const LastFmSocialIntegration: React.FC<LastFmSocialIntegrationProps> = ({
  actions: {
    lastFmConnectAction,
    lastFmLoginAction,
    lastFmLogOut,
    enableScrobbling,
    disableScrobbling,
    fetchAllFmFavorites
  },
  scrobbling: {
    lastFmName,
    lastFmAuthToken,
    lastFmSessionKey,
    lastFmScrobblingEnabled
  },
  importfavs: {
    lastFmFavImportMessage,
    lastFmFavImportStatus
  }
}) => {
  const {t} = useTranslation('settings');
  const toggleScrobbling = (
    lastFmScrobblingEnabled,
    enableScrobbling,
    disableScrobbling
  ) => {
    lastFmScrobblingEnabled ? disableScrobbling() : enableScrobbling();
  };
  return <Segment>
    <SocialIntegration
      logo={<Icon.Group size='big'>
        <Icon name='square' className={styles.social_icon_bg} />
        <Icon name='lastfm square' className={styles.lastfm_icon} />
      </Icon.Group>}
      title={t('lastfm-title')}
      description={t('lastfm-description')}
    >
      <div className={styles.settings_social_item}>
        <span>
          {t('user')} <strong>{lastFmName ? lastFmName : t('notlogged')}</strong>
        </span>
        <Spacer />
        {!lastFmSessionKey && (
          <Button 
            onClick={lastFmConnectAction} 
            color='red'>
            {t('lastfm-connect')}
          </Button>
        )}
        {!lastFmSessionKey && (
          <Button
            onClick={() => lastFmLoginAction(lastFmAuthToken)}
            color='red'
          >
            {t('login')}
          </Button>
        )}
        {lastFmSessionKey &&
          <Button onClick={lastFmLogOut}>
            {t('logout')}
          </Button>}
      </div>
      <div className={styles.settings_social_item}>
        <label>{t('lastfm-enable')}</label>
        <Spacer />
        <Radio
          toggle
          checked={lastFmScrobblingEnabled}
          onChange={() => toggleScrobbling(
            lastFmScrobblingEnabled,
            enableScrobbling,
            disableScrobbling
          )} />
      </div>
      <div className={styles.settings_social_item}>
        <span>
          {t('fmfav-msg')}
        </span>
        <Spacer />
        <span> {(lastFmFavImportMessage && (
          <strong>{lastFmFavImportMessage}</strong>
        ))}
        </span>
        <Spacer />
        <Button 
          disabled={!lastFmFavImportStatus} 
          loading={!lastFmFavImportStatus} 
          onClick={fetchAllFmFavorites} 
          color='green'>
          {t('fmfav-btn')}
        </Button>
      </div>
    </SocialIntegration>
  </Segment>;
};
