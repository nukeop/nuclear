import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Icon } from 'semantic-ui-react';

import Spacer from '../../Spacer';
import OauthPopup from '../../OauthPopup';
import { getGithubOauthUrl } from '../../../rest/Github';

import settingsStyles from '../styles.scss';
import { useTranslation } from 'react-i18next';

const GithubSettings = ({ username, loading, logIn, logOut }) => {
  const { t } = useTranslation('settings');

  return (
    <div className={settingsStyles.settings_item}>
      <span>
        User: <strong>{_.defaultTo(username, t('notlogged'))}</strong>
      </span>
      <Spacer />
  
      {_.isNil(username) && (
        <OauthPopup
          url={getGithubOauthUrl()}
          onCode={code => logIn(code)}
          render={oauthProps => (
            <Button color='black' loading={loading} onClick={oauthProps.onClick}>
              <Icon name='github' />
              {t('github-connect')}
            </Button>
          )}
        />
      )}
      {!_.isNil(username) && (
        <Button inverted onClick={logOut}>
          {t('logout')}
        </Button>
      )}
    </div>
  );
};

GithubSettings.propTypes = {
  username: PropTypes.string,
  loading: PropTypes.bool,
  logIn: PropTypes.func,
  logOut: PropTypes.func
};

GithubSettings.defaultProps = {
  username: null,
  loading: false,
  logIn: () => {},
  logOut: () => {}
};

export default GithubSettings;
