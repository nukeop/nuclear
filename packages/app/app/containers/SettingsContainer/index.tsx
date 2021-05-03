import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ScrobblingActions from '../../actions/scrobbling';
import * as ImportFavActions from '../../actions/importfavs';
import * as SettingsActions from '../../actions/settings';
import * as MastodonActions from '../../actions/mastodon';
import options from '../../constants/settings';
import Settings from '../../components/Settings';
import { scrobblingSelector } from '../../selectors/scrobbling';
import { importfavsSelector } from '../../selectors/importfavs';
import { settingsSelector } from '../../selectors/settings';
import { mastodonSelector } from '../../selectors/mastodon';
import { useMastodonPost } from '../../hooks/useMastodonPost';

const SettingsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const scrobbling = useSelector(scrobblingSelector);
  const importfavs = useSelector(importfavsSelector);
  const mastodon = useSelector(mastodonSelector);
  const settings = useSelector(settingsSelector);

  const actions = bindActionCreators({
    ...ScrobblingActions,
    ...ImportFavActions,
    ...SettingsActions
  }, dispatch);

  const registerNuclear = (instanceUrl: string) => dispatch(MastodonActions.registerNuclearThunk(instanceUrl));
  const getAccessToken = (authorizationCode: string) => dispatch(MastodonActions.getAccessTokenThunk(
    mastodon.appData?.data.instanceUrl,
    mastodon.appData?.data.client_id,
    mastodon.appData?.data.client_secret,
    authorizationCode
  ));
  const logOut = () => dispatch(MastodonActions.logOutThunk());
  const mastodonPost = useMastodonPost(
    settings.mastodonInstance,
    settings.mastodonAccessToken
  );

  return (
    <Settings
      actions={actions}
      mastodonActions={{
        registerNuclear,
        getAccessToken,
        logOut,
        mastodonPost
      }}
      scrobbling={scrobbling}
      importfavs={importfavs}
      mastodon={mastodon}
      settings={settings}
      options={options}
    />
  );
};

export default SettingsContainer;
