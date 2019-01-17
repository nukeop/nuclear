import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Button, Input, Radio } from 'semantic-ui-react';
import _ from 'lodash';

import Header from '../Header';
import Spacer from '../Spacer';
import settingsEnum from '../../constants/settingsEnum';

import styles from './styles.scss';

class Settings extends React.Component {
  toggleScrobbling(
    lastFmScrobblingEnabled,
    enableScrobbling,
    disableScrobbling
  ) {
    lastFmScrobblingEnabled ? disableScrobbling() : enableScrobbling();
  }

  isChecked(option) {
    return this.props.settings[option.name] !== undefined
      ? this.props.settings[option.name]
      : option.default;
  }

  getOptionValue(option) {
    return this.props.settings[option.name];
  }

  renderLastFmTitle() {
    return (
      <div className={styles.settings_item}>
        <label>
          <span className={styles.settings_logo}>
            <span className="fa-stack fa-lg">
              <FontAwesome name="square" stack="1x" />
              <FontAwesome
                name="lastfm-square"
                stack="1x"
                className={styles.lastfm_icon}
              />
            </span>
          </span>
          <span>Last.fm integration</span>
        </label>
      </div>
    );
  }

  renderLastFmLoginButtons() {
    let {
      lastFmAuthToken,
      lastFmName,
      lastFmSessionKey,
    } = this.props.scrobbling;
    const { lastFmConnectAction, lastFmLoginAction } = this.props.actions;
    return (
      <div className={styles.settings_item}>
        <span>
          User: <strong>{lastFmName ? lastFmName : 'Not logged in'}</strong>
        </span>
        <Spacer />
        {!lastFmSessionKey && (
          <Button onClick={lastFmConnectAction} color="red">
            Connect with Last.fm
          </Button>
        )}
        {!lastFmSessionKey && (
          <Button
            onClick={() => lastFmLoginAction(lastFmAuthToken)}
            color="red"
          >
            Log in
          </Button>
        )}
      </div>
    );
  }

  renderLastFmOptionRadio() {
    let { lastFmScrobblingEnabled } = this.props.scrobbling;
    const { enableScrobbling, disableScrobbling } = this.props.actions;
    return (
      <div className={styles.settings_item}>
        <label>Enable scrobbling to last.fm</label>
        <Spacer />
        <Radio
          toggle
          checked={lastFmScrobblingEnabled}
          onChange={() =>
            this.toggleScrobbling(
              lastFmScrobblingEnabled,
              enableScrobbling,
              disableScrobbling
            )
          }
        />
      </div>
    );
  }

  renderSocialSettings() {
    return (
      <div className={styles.settings_section}>
        <Header>Social</Header>
        <hr />
        {this.renderLastFmTitle()}

        <div className={styles.settings_item}>
          <p>
            In order to enable scrobbling, you first have to connect and
            authorize nuclear on Last.fm, then click log in.
          </p>
        </div>

        {this.renderLastFmLoginButtons()}
        {this.renderLastFmOptionRadio()}
      </div>
    );
  }

  renderOption(settings, option, key) {
    return (
      <div key={key} className={styles.settings_item}>
        <label>{option.prettyName}</label>
        <Spacer />
        {
          option.type === settingsEnum.BOOLEAN &&
          <Radio
            toggle
            onChange={() => this.props.actions.toggleOption(option, settings)}
            checked={this.isChecked(option)}
          />
        }
            {
              option.type === settingsEnum.STRING &&
                <Input
                    value={this.getOptionValue(option)}
                    onChange={
                      e =>this.props.actions.setStringOption(option.name, e.target.value)
                    } 
                />
            }
      </div>
    );
  }

  render() {
    let { options, settings } = this.props;
    let optionsGroups = _.groupBy(options, 'category');

    return (
      <div className={styles.settings_container}>
        {this.renderSocialSettings()}
        {_.map(optionsGroups, (group, i) => {
          return (
            <div key={i} className={styles.settings_section}>
              <Header>{i}</Header>
              <hr />
              {_.map(group, (option, j) =>
                this.renderOption(settings, option, j)
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Settings;
