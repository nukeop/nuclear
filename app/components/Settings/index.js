import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Radio, Segment } from 'semantic-ui-react';
import Range from 'react-range-progress';
import cx from 'classnames';
import _ from 'lodash';
import {
  Divider,
  Icon
} from 'semantic-ui-react';

import Header from '../Header';
import Spacer from '../Spacer';
import SocialIntegration from './SocialIntegration';
import GithubSettings from './GithubSettings';
import settingsEnum from '../../constants/settingsEnum';

import styles from './styles.scss';

const volumeSliderColors = {
  fillColor: { r: 248, g: 248, b: 242, a: 1 },
  trackColor: { r: 68, g: 71, b: 90, a: 1 },
  thumbColor: { r: 248, g: 248, b: 242, a: 1 }
};

class Settings extends React.Component {
  toggleScrobbling (
    lastFmScrobblingEnabled,
    enableScrobbling,
    disableScrobbling
  ) {
    lastFmScrobblingEnabled ? disableScrobbling() : enableScrobbling();
  }

  isChecked (option) {
    return typeof this.props.settings[option.name] !== 'undefined'
      ? this.props.settings[option.name]
      : option.default;
  }

  getOptionValue (option) {
    return this.props.settings[option.name];
  }

  validateNumberInput (value) {
    const intValue = _.parseInt(value);
    return _.isNull(value) || !_.isNaN(intValue);
  }

  renderLastFmSocialIntegration () {
    return (
      <SocialIntegration
        logo={
          <Icon.Group size='big'>
            <Icon name='square' className={ styles.social_icon_bg }/>
            <Icon name='lastfm square' className={ styles.lastfm_icon }/>
          </Icon.Group>
        }
        title='Last.fm'
        description={
          'In order to enable scrobbling, you first have to'
                + ' connect and authorize Nuclear on Last.fm, then click log in.'
        }
      >
        {this.renderLastFmLoginButtons()}
        {this.renderLastFmOptionRadio()}
      </SocialIntegration>
    );
  }

  renderLastFmLoginButtons () {
    let {
      lastFmAuthToken,
      lastFmName,
      lastFmSessionKey
    } = this.props.scrobbling;
    
    const {
      lastFmConnectAction,
      lastFmLoginAction,
      lastFmLogOut
    } = this.props.actions;
    return (
      <div className={styles.settings_social_item}>
        <span>
          User: <strong>{lastFmName ? lastFmName : 'Not logged in'}</strong>
        </span>
        <Spacer />
        {!lastFmSessionKey && (
          <Button onClick={lastFmConnectAction} color='red'>
            Connect with Last.fm
          </Button>
        )}
        {!lastFmSessionKey && (
          <Button
            onClick={() => lastFmLoginAction(lastFmAuthToken)}
            color='red'
          >
            Log in
          </Button>
        )}
        {
          lastFmSessionKey &&
            <Button onClick={ lastFmLogOut } inverted>
              Log out
            </Button>
        }
      </div>
    );
  }

  renderLastFmOptionRadio() {
    let { lastFmScrobblingEnabled } = this.props.scrobbling;
    const { enableScrobbling, disableScrobbling } = this.props.actions;
    return (
      <div className={styles.settings_item}>
        <label>Enable scrobbling to Last.fm</label>
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

  renderGithubSocialIntegration() {
    const {
      actions,
      github
    } = this.props;
    
    return (
      <SocialIntegration
        logo={
          <Icon.Group size='big'>
            <Icon name='square' className={ styles.social_icon_bg } />
            <Icon color='black' name='github square' />
          </Icon.Group>
        }
        title='Github'
        description={
          'Log in via Github to be able to create and share your playlists online (upcoming feature).'
        }
      >
        <GithubSettings
          logIn={ actions.githubOauth }
          logOut={ actions.githubLogOut }
          loading={ _.get(github, 'loading') }
          username={ _.get(github, 'login') }
        />
      </SocialIntegration>
    );
  }

  renderSocialSettings () {
    return (
      <div className={styles.settings_section}>
        <Header>Social</Header>
        <hr />
        <Segment>
          { this.renderLastFmSocialIntegration() }
          <Divider />
          { this.renderGithubSocialIntegration() }
        </Segment>
      </div>
    );
  }

  handleSliderChange (value, option) {
    this.props.actions.setNumberOption(option.name, _.parseInt(value));
  }

  renderRadioOption (option, settings) {
    return (<Radio
      toggle
      onChange={() => this.props.actions.toggleOption(option, settings)}
      checked={this.isChecked(option)}
    />);
  }

  renderStringOption (option) {
    return (<Input
      fluid
      value={this.getOptionValue(option)}
      onChange={
        e => this.props.actions.setStringOption(option.name, e.target.value)
      }
    />);
  }

  renderSliderOption (option) {
    // Value : {this.getOptionValue(option) || option.default} {option.unit}
    return (
      <div className={styles.slider_container}>
        <label>Less</label>  
        <Range
          value={this.getOptionValue(option) || option.default}
          min={option.min}
          max={option.max}
          fillColor={volumeSliderColors.fillColor}
          trackColor={volumeSliderColors.trackColor}
          thumbColor={volumeSliderColors.thumbColor}
          height={4}
          width='auto'
          onChange={(e) => this.handleSliderChange(e, option)}
          thumbSize={21}
        />
        <label>More</label>
      </div>
    );
  }
  
  renderNumberOption (option) {
    if (typeof option.unit === 'string') {
      return this.renderSliderOption(option);
    } else {
      const value = this.getOptionValue(option);

      return (<Input
        type={typeof option.min === 'number' && typeof option.max === 'number' ? 'number' : 'text' }
        min={option.min}
        max={option.max}
        fluid
        value={ value || option.default}
        error={!this.validateNumberInput(value)}
        onChange={
          e => !!e.target.value && this.validateNumberInput(value) && this.props.actions.setNumberOption(option.name, _.parseInt(e.target.value))
        }
      />);
    }
  }
  renderOption (settings, option, key) {
    return (
      <div key={key} className={cx(styles.settings_item, option.type)}>
        <label>{option.prettyName}</label>
        <Spacer />
        {
          option.type === settingsEnum.BOOLEAN &&
          this.renderRadioOption(option, settings)
        }
        {
          option.type === settingsEnum.STRING &&
          this.renderStringOption(option)
        }
        {
          option.type === settingsEnum.NUMBER &&
          this.renderNumberOption(option)
        }
      </div>
    );
  }

  render () {
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
              <Segment>
                {_.map(group, (option, j) =>
                  this.renderOption(settings, option, j)
                )}
              </Segment>
            </div>
          );
        })}
      </div>
    );
  }
}

Settings.propTypes = {
  actions: PropTypes.object,
  github: PropTypes.object,
  scrobbling: PropTypes.object,
  settings: PropTypes.object,
  options: PropTypes.array
};

Settings.defaultProps = {
  actions: {},
  github: {},
  scrobbling: {},
  settings: {},
  options: []
};

export default Settings;
