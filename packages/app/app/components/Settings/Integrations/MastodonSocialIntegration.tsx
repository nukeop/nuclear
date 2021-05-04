import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, InputOnChangeData, Segment } from 'semantic-ui-react';
import { Button } from '@nuclear/ui';

import SocialIntegration from '../SocialIntegration';
import { RootState } from '../../../reducers';
import MastodonLogo from '../../../../resources/media/mastodon_logo_full.svg';
import styles from '../styles.scss';
import Spacer from '../../Spacer';
import { useCallback } from 'react';

type MastodonSocialIntegrationProps = {
  registerNuclear: (instanceUrl: string) => void;
  getAccessToken: (authorizationCode: string) => void;
  logOut: React.MouseEventHandler;
  setStringOption: Function;
  mastodon: RootState['mastodon'];
  settings: RootState['settings'];
};

export const MastodonSocialIntegration: React.FC<MastodonSocialIntegrationProps> = ({
  registerNuclear,
  getAccessToken,
  logOut,
  setStringOption,
  mastodon,
  settings
}) => {
  const { t } = useTranslation('settings');
  const onUpdateInstanceUrl = useCallback(
    (_, data: InputOnChangeData) => setStringOption('mastodonInstance', data.value),
    [setStringOption]
  );
  const onUpdateAuthorizationCode = useCallback(
    (_, data: InputOnChangeData) => setStringOption('mastodonAuthorizationCode', data.value),
    [setStringOption]
  );
  const onUpdatePostFormat = useCallback(
    (_, data: InputOnChangeData) => setStringOption('mastodonPostFormat', data.value),
    [setStringOption]
  );
  return <Segment>
    <SocialIntegration
      logo={<span
        className={styles.mastodon_logo}
        dangerouslySetInnerHTML={{ __html: MastodonLogo }}
      />}
      title={t('mastodon-title')}
      description={t('mastodon-description')}
    >
      {
        !(settings.mastodonAccessToken || mastodon.appData?.isReady) &&
        <div className={styles.settings_social_item}>
          <span className={styles.settings_item_text}>
            <label className={styles.settings_item_name}>
              {t('mastodon-instance-label')}
            </label>
          </span>
          <Spacer />
          <Input
            value={settings.mastodonInstance}
            onChange={onUpdateInstanceUrl}
          />
          <Button
            loading={mastodon.appData?.isLoading}
            onClick={() => registerNuclear(settings.mastodonInstance)}
          >{t('mastodon-authorize')}</Button>
        </div>
      }
      {
        mastodon.appData?.isReady && !mastodon.appData?.hasError &&
        !settings.mastodonAccessToken &&
        <>
          <div className={styles.settings_social_item}>
            <span>
              {t('mastodon-awaiting-authorization', { instanceUrl: settings.mastodonInstance })}
            </span>
            <Spacer />
            <Button onClick={logOut}>
              {t('logout')}
            </Button>
          </div>
          <div className={styles.settings_social_item}>
            <span className={styles.settings_item_text}>
              <label className={styles.settings_item_name}>
                {t('mastodon-authorization-token-label')}
              </label>
            </span>
            <Spacer />
            <Input
              value={settings.mastodonAuthorizationCode}
              onChange={onUpdateAuthorizationCode}
            />
            <Button
              loading={mastodon.tokenData?.isLoading}
              onClick={() => getAccessToken(settings.mastodonAuthorizationCode)}
            >{t('mastodon-authorize')}</Button>
          </div>
        </>
      }
      {
        settings.mastodonAccessToken &&
        <>
          <div className={styles.settings_social_item}>
            <span>
              {t('mastodon-authorized')} <strong>{settings.mastodonInstance}</strong>
            </span>
            <Spacer />
            <Button onClick={logOut}>
              {t('logout')}
            </Button>
          </div>
          <div className={styles.settings_social_item}>
            <span className={styles.settings_item_text}>
              <label className={styles.settings_item_name}>
                {t('mastodon-post-format-label')}
              </label>
            </span>
            <Spacer />
            <Input
              value={settings.mastodonPostFormat}
              onChange={onUpdatePostFormat}
            />
          </div>
          <div className={styles.settings_item_description}>
            {t('mastodon-post-format-description', {
              artist: '{{artist}}',
              title: '{{title}}'
            })}
          </div>
        </>
      }
    </SocialIntegration>
  </Segment >;
};
