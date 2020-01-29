import { SettingType } from '@nuclear/core';
import { Range } from '@nuclear/ui';
import React from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import { Button, Input, Radio, Segment, Dropdown } from 'semantic-ui-react';
import cx from 'classnames';
import _ from 'lodash';
import {
  Divider,
  Icon
} from 'semantic-ui-react';
import i18n from '@nuclear/i18n';

import Header from '../Header';
import Spacer from '../Spacer';
import SocialIntegration from './SocialIntegration';
import GithubSettings from './GithubSettings';

import styles from './styles.scss';
import { withTranslation } from 'react-i18next';
import { ImportFmFavorites, fetchAllFmFavorites } from '../../actions/importfavs';
import * as FavoritesActions from '../../../app/actions/favorites';

const volumeSliderColors = {
  fillColor: { r: 248, g: 248, b: 242, a: 1 },
  trackColor: { r: 68, g: 71, b: 90, a: 1 },
  thumbColor: { r: 248, g: 248, b: 242, a: 1 }
};
@withTranslation('settings')
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

  setDirectoryOption(option) {
    let dialogResult = remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (!_.isNil(dialogResult)) {
      this.props.actions.setStringOption(
        option.name,
        _.head(dialogResult)
      );
    }
  }

  renderLastFmSocialIntegration () {
    return (
      <SocialIntegration
        logo={
          <Icon.Group size='big'>
            <Icon name='square' className={styles.social_icon_bg}/>
            <Icon name='lastfm square' className={styles.lastfm_icon}/>
          </Icon.Group>
        }
        title={this.props.t('lastfm-title')}
        description={this.props.t('lastfm-description')}
      >
        {this.renderLastFmLoginButtons()}
        {this.renderLastFmOptionRadio()}
        {this.renderLastFmImportFavButton()}
      </SocialIntegration>
    );
  }
  renderLastFmImportFavButton(){
    let {
      lastFmName,
      lastFmSessionKey,
      lastFmFavImportStatus,
      lastFmFavImportMessage
    } = this.props.scrobbling;

    let {
      FmFavImport,
      FmFavUpdateMsg
    } = this.props.actions;

    return ( lastFmName && lastFmSessionKey && (
      <div className={styles.settings_social_item}>
        <span>
          {this.props.t('fmfav-msg')}
        </span>
        <Spacer />
        <span>
          <strong>{lastFmFavImportMessage}</strong>
        </span>
        <Spacer />
        {(
          <Button disabled={!lastFmFavImportStatus} loading={!lastFmFavImportStatus} onClick={() => {
            FmFavImport();
            ImportFmFavorites()
              .then((resp) => {
                if (!resp.ok){
                  FmFavUpdateMsg('Error Fetching Tracks from Last.fm');
                  FmFavImport();
                  throw new Error('Error Fetching Tracks from Last.fm: ' + resp.statusText);
                }
                return resp.json(); 
              })
              .then(req => {
                let totalLovedTracks = req.lovedtracks['@attr'].total;
                FmFavUpdateMsg('Found: ' + totalLovedTracks + ' tracks. Importing...');
                fetchAllFmFavorites(totalLovedTracks)
                  .then((resp) => {
                    if (!resp.ok){
                      FmFavUpdateMsg('Error fetching ALL favorites from Last.fm');
                      FmFavImport();
                      throw new Error('Error fetching ALL favorites from Last.fm: ' + resp.statusText);
                    }
                    return resp.json();
                  })
                  .then((req) => {
                    let counter = 0;
                    req.lovedtracks.track.forEach(favtrack => {
                      FavoritesActions.addFavoriteTrack(favtrack);
                      counter += 1;
                    });
                    FmFavUpdateMsg('Imported ' + counter + '/' + req.lovedtracks['@attr'].total);
                    FmFavImport();
                  })
                  .catch((error) => {
                    FmFavUpdateMsg('Error fetching all favorites');
                    FmFavImport();
                    throw new Error('Error fetching all favorites: ' + error);
                  });
              })
              .catch((error) => {
                FmFavUpdateMsg('Error Fetching number of favorites');
                FmFavImport();
                throw new Error('Error Fetching number of favorites: ' + error);
              });
          }} color='green'>
            {this.props.t('fmfav-btn')}
          </Button>
        )}
      </div>
    )
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
          {this.props.t('user')} <strong>{lastFmName ? lastFmName : this.props.t('notlogged')}</strong>
        </span>
        <Spacer />
        {!lastFmSessionKey && (
          <Button onClick={lastFmConnectAction} color='red'>
            {this.props.t('lastfm-connect')}
          </Button>
        )}
        {!lastFmSessionKey && (
          <Button
            onClick={() => lastFmLoginAction(lastFmAuthToken)}
            color='red'
          >
            {this.props.t('login')}
          </Button>
        )}
        {
          lastFmSessionKey &&
            <Button onClick={lastFmLogOut} inverted>
              {this.props.t('logout')}
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
        <label>{this.props.t('lastfm-enable')}</label>
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
      github,
      t
    } = this.props;

    return (
      <SocialIntegration
        logo={
          <Icon.Group size='big'>
            <Icon name='square' className={styles.social_icon_bg} />
            <Icon color='black' name='github square' />
          </Icon.Group>
        }
        title={t('github-title')}
        description={t('github-description')}
      >
        <GithubSettings
          logIn={actions.githubOauth}
          logOut={actions.githubLogOut}
          loading={_.get(github, 'loading')}
          username={_.get(github, 'login')}
        />
      </SocialIntegration>
    );
  }

  renderSocialSettings () {
    return (
      <div className={styles.settings_section}>
        <Header>{this.props.t('social')}</Header>
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

  renderNodeOption(option) {
    return option.node;
  }

  renderListOption({ placeholder, options }) {
    return (
      <Dropdown
        basic
        search
        selection
        className={styles.list_option}
        placeholder={placeholder}
        value={i18n.language}
        options={options}
        onChange={(e, { value }) => i18n.changeLanguage(value)}
      />
    );
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

  renderDirectoryOption(option) {
    return (<span
      className={styles.directory_option}>
      <span
        className={styles.directory_content}>
        { this.getOptionValue(option) }
      </span>
      <Button
        icon
        inverted
        labelPosition='left'
        onClick={() => this.setDirectoryOption(option)}>
        <Icon name={option.buttonIcon} />
        {this.props.t(option.buttonText)}
      </Button>
    </span>);
  }

  renderSliderOption (option) {
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
        type={typeof option.min === 'number' && typeof option.max === 'number' ? 'number' : 'text'}
        min={option.min}
        max={option.max}
        fluid
        value={value || option.default}
        error={!this.validateNumberInput(value)}
        onChange={
          e => !!e.target.value && this.validateNumberInput(value) && this.props.actions.setNumberOption(option.name, _.parseInt(e.target.value))
        }
      />);
    }
  }

  renderOption (settings, option, key) {
    return (
      <div
        key={key}
        className={
          cx(
            styles.settings_item,
            option.type
          )
        }>
        <span className={styles.settings_item_text}>
          <label className={styles.settings_item_name}>
            {this.props.t(option.prettyName)}
          </label>
          {
            !_.isNil(option.description) &&
              <p className={styles.settings_item_description}>
                {this.props.t(option.description)}
              </p>
          }
        </span>
        <Spacer />
        {
          option.type === SettingType.BOOLEAN &&
          this.renderRadioOption(option, settings)
        }
        {
          option.type === SettingType.STRING &&
          this.renderStringOption(option)
        }
        {
          option.type === SettingType.NUMBER &&
          this.renderNumberOption(option)
        }
        {
          option.type === SettingType.LIST &&
          this.renderListOption(option)
        }
        {
          option.type === SettingType.NODE &&
            this.renderNodeOption(option)
        }
        {
          option.type === SettingType.DIRECTORY &&
          this.renderDirectoryOption(option)
        }
      </div>
    );
  }

  render () {
    let { options, settings, t } = this.props;
    let optionsGroups = _.groupBy(options, 'category');

    return (
      <div className={styles.settings_container}>
        {this.renderSocialSettings()}
        {_.map(optionsGroups, (group, i) => {
          return (
            <div key={i} className={styles.settings_section}>
              <Header>{t(i)}</Header>
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
