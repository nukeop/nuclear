import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Icon
} from 'semantic-ui-react';

import Spacer from '../../Spacer';
import OauthPopup from '../../OauthPopup';
import { getGithubOauthUrl } from '../../../rest/Github';

import settingsStyles from '../styles.scss';

const GithubSettings = props => {
  const {
    username,
    loading,
    logIn,
    logOut
  } = props;
  
  return (
    <div className={ settingsStyles.settings_item } >
      <span>User: <strong>{ _.defaultTo(username, 'Not logged in') }</strong></span>
      <Spacer />
      
      {
        _.isNil(username) &&
          <OauthPopup
            url={ getGithubOauthUrl() }
            onCode={ code => logIn(code) } 
            render={ oauthProps =>
              <Button
                color='black'
                loading={ loading }
                onClick={ oauthProps.onClick }
              >
                <Icon name='github'/>
            Log in with Github
              </Button>
            } />
      }
      {
        !_.isNil(username) &&
          <Button
            inverted
            onClick={ logOut }
          >
              Log out
          </Button>
      }
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
