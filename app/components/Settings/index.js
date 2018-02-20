import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Button, Radio } from 'semantic-ui-react';
import _ from 'lodash';

import Header from '../Header';
import Spacer from '../Spacer';

import styles from './styles.scss';

class Settings extends React.Component {
  toggleScrobbling(lastFmScrobblingEnabled, enableScrobbling, disableScrobbling) {
    lastFmScrobblingEnabled ? disableScrobbling(): enableScrobbling();
  }

  toggleOption(option, state) {
    state !== undefined
    ? this.props.actions.setBooleanOption(option.name, !state)
    : this.props.actions.setBooleanOption(option.name, !option.default);
  }

  isChecked(option) {
    return this.props.settings[option.name] !== undefined
    ? this.props.settings[option.name]
    : option.default;
  }

  render() {
    let {
      options,
      settings
    } = this.props;

    let {
      lastFmAuthToken,
      lastFmName,
      lastFmSessionKey,
      lastFmScrobblingEnabled
    } = this.props.scrobbling;

    const {
      lastFmConnectAction,
      lastFmLoginAction,
      enableScrobbling,
      disableScrobbling,
      setBooleanOption
    } = this.props.actions;

    let optionsGroups = _.groupBy(options, 'category');

    return (
      <div className={styles.settings_container}>
        <div className={styles.settings_section}>
          <Header>
            Social
          </Header>
          <hr />
          <div className={styles.settings_item}>
            <label>
              <span className={styles.settings_logo}>
                <span className='fa-stack fa-lg'>
                  <FontAwesome name="square" stack='1x'/>
                  <FontAwesome name="lastfm-square" stack='1x' className={styles.lastfm_icon} />
                </span>
              </span>
              <span>Last.fm integration</span>
            </label>
          </div>

          <div className={styles.settings_item}>
            <p>
              In order to enable scrobbling, you first have to connect and authorize nuclear on Last.fm, then click log in.
            </p>
          </div>

          <div className={styles.settings_item}>
            <span>User: <strong>{lastFmName ? lastFmName : 'Not logged in'}</strong></span>
            <Spacer />
            {
              !lastFmSessionKey &&
              <Button onClick={lastFmConnectAction} color='red'>Connect with Last.fm</Button>
            }
            {
              lastFmSessionKey &&
              <Button onClick={() => lastFmLoginAction(lastFmAuthToken)} color='red'>Log in</Button>
            }
          </div>

          <div className={styles.settings_item}>
            <label>Enable scrobbling to last.fm</label>
            <Spacer />
            <Radio
              toggle
              checked={lastFmScrobblingEnabled}
              onChange={() => this.toggleScrobbling(lastFmScrobblingEnabled, enableScrobbling, disableScrobbling)}
            />
          </div>
        </div>

        {
          _.map(optionsGroups, (group, i) => {
            return (
              <div key={i} className={styles.settings_section}>
                <Header>
                  {i}
                </Header>
                <hr />
                {
                  _.map(group, (option, j) => {
                    return (
                      <div key={j} className={styles.settings_item}>
                        <label>{option.prettyName}</label>
                        <Spacer />
                        <Radio
                          toggle
                          onChange={() => this.toggleOption(option, settings[option.name])}
                          checked={this.isChecked(option)}
                        />
                      </div>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>

    );
  }
}

export default Settings;
