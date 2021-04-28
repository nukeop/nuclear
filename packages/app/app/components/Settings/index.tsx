import React from 'react';
import { remote } from 'electron';
import { Button, Input, Radio, Segment, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { SettingType } from '@nuclear/core';
import { Dropdown, Range } from '@nuclear/ui';
import i18n from '@nuclear/i18n';

import Header from '../Header';
import Spacer from '../Spacer';
import SocialIntegration from './SocialIntegration';

import styles from './styles.scss';
import ScrobblingReducer from '../../reducers/scrobbling';
import ImportFavsReducer from '../../reducers/importfavs';

const volumeSliderColors = {
  fillColor: { r: 248, g: 248, b: 242, a: 1 },
  trackColor: { r: 68, g: 71, b: 90, a: 1 },
  thumbColor: { r: 248, g: 248, b: 242, a: 1 }
};

export type SettingsProps = {
  actions: {
    setNumberOption: Function;
    setStringOption: Function;
    toggleOption: Function;
    fetchAllFmFavorites: React.MouseEventHandler;
    enableScrobbling: Function;
    disableScrobbling: Function;
    lastFmConnectAction: React.MouseEventHandler;
    lastFmLoginAction: React.MouseEventHandler;
    lastFmLogOut: React.MouseEventHandler;
  };
  scrobbling: ReturnType<typeof ScrobblingReducer>;
  importfavs: ReturnType<typeof ImportFavsReducer>;
  settings: object;
  options: object;
}

const Settings: React.FC<SettingsProps> = ({
  actions,
  scrobbling,
  importfavs,
  settings,
  options
}) => {
  const {
    lastFmName,
    lastFmAuthToken,
    lastFmSessionKey,
    lastFmScrobblingEnabled
  } = scrobbling;

  const {
    lastFmFavImportMessage,
    lastFmFavImportStatus
  } = importfavs;

  const {
    lastFmConnectAction,
    lastFmLoginAction,
    lastFmLogOut,
    enableScrobbling,
    disableScrobbling,
    fetchAllFmFavorites
  } = actions;

  const toggleScrobbling = (
    lastFmScrobblingEnabled,
    enableScrobbling,
    disableScrobbling
  ) => {
    lastFmScrobblingEnabled ? disableScrobbling() : enableScrobbling();
  };

  const isChecked = (option) => {
    return typeof settings[option.name] !== 'undefined'
      ? settings[option.name]
      : option.default;
  };

  const getOptionValue = (option) => {
    return settings[option.name];
  };

  const validateNumberInput = (value) => {
    const intValue = _.parseInt(value);
    return _.isNull(value) || !_.isNaN(intValue);
  };

  const setDirectoryOption = async (option) => {
    const dialogResult = await remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (!dialogResult.canceled && !_.isEmpty(dialogResult.filePaths)) {
      actions.setStringOption(
        option.name,
        _.head(dialogResult.filePaths)
      );
    }
  };

  const handleSliderChange = (value, option) => {
    actions.setNumberOption(option.name, _.parseInt(value));
  };

  const renderNodeOption = (option) => {
    return option.node;
  };

  const renderListOption = ({ placeholder, options }) => (
    <Dropdown
      search
      selection
      className={styles.list_option}
      placeholder={placeholder}
      value={i18n.language}
      options={options}
      onChange={(e, { value }) => i18n.changeLanguage(value)} />
  );

  const renderRadioOption = (option, settings) => (
    <Radio
      toggle
      onChange={() => actions.toggleOption(option, settings)}
      checked={isChecked(option)} />
  );

  const renderStringOption = (option) => (
    <Input
      fluid
      value={getOptionValue(option)}
      onChange={
        e => actions.setStringOption(option.name, e.target.value)} />
  );

  const renderDirectoryOption = (option) => (
    <span
      className={styles.directory_option}>
      <span
        className={styles.directory_content}>
        {getOptionValue(option)}
      </span>
      <Button
        icon
        inverted
        labelPosition='left'
        onClick={() => setDirectoryOption(option)}>
        <Icon name={option.buttonIcon} />
        {t(option.buttonText)}
      </Button>
    </span>
  );

  const renderSliderOption = (option) => (
    <div className={styles.slider_container}>
      <label>Less</label>
      <Range
        value={getOptionValue(option) || option.default}
        min={option.min}
        max={option.max}
        fillColor={volumeSliderColors.fillColor}
        trackColor={volumeSliderColors.trackColor}
        thumbColor={volumeSliderColors.thumbColor}
        height={4}
        width='auto'
        onChange={(e) => handleSliderChange(e, option)}
        thumbSize={21} />
      <label>More</label>
    </div>
  );

  const renderNumberOption = (option) => {
    if (typeof option.unit === 'string') {
      return renderSliderOption(option);
    } else {
      const value = getOptionValue(option);

      return (<Input
        type={typeof option.min === 'number' && typeof option.max === 'number' ? 'number' : 'text'}
        min={option.min}
        max={option.max}
        fluid
        value={value || option.default}
        error={!validateNumberInput(value)}
        onChange={
          e => !!e.target.value && validateNumberInput(value) && actions.setNumberOption(option.name, _.parseInt(e.target.value))
        }
      />);
    }
  };

  const renderOption = (settings, option, key) => (
    <div
      key={key}
      className={cx(
        styles.settings_item,
        option.type
      )}>
      <span className={styles.settings_item_text}>
        <label className={styles.settings_item_name}>
          {t(option.prettyName)}
        </label>
        {!_.isNil(option.description) &&
          <p className={styles.settings_item_description}>
            {t(option.description)}
          </p>}
      </span>
      <Spacer />
      {option.type === SettingType.BOOLEAN &&
        renderRadioOption(option, settings)}
      {option.type === SettingType.STRING &&
        renderStringOption(option)}
      {option.type === SettingType.NUMBER &&
        renderNumberOption(option)}
      {option.type === SettingType.LIST &&
        renderListOption(option)}
      {option.type === SettingType.NODE &&
        renderNodeOption(option)}
      {option.type === SettingType.DIRECTORY &&
        renderDirectoryOption(option)}
    </div>
  );

  const optionsGroups = _.groupBy(options, 'category');
  const { t } = useTranslation('settings');

  return (
    <div className={styles.settings_container}>
      <div className={styles.settings_section}>
        <Header>{t('social')}</Header>
        <hr />
        <Segment>
          <SocialIntegration
            logo={
              <Icon.Group size='big'>
                <Icon name='square' className={styles.social_icon_bg} />
                <Icon name='lastfm square' className={styles.lastfm_icon} />
              </Icon.Group>
            }
            title={t('lastfm-title')}
            description={t('lastfm-description')}
          >
            <div className={styles.settings_social_item}>
              <span>
                {t('user')} <strong>{lastFmName ? lastFmName : t('notlogged')}</strong>
              </span>
              <Spacer />
              {!lastFmSessionKey && (
                <Button onClick={lastFmConnectAction} color='red'>
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
              {
                lastFmSessionKey &&
                <Button onClick={lastFmLogOut} inverted>
                  {t('logout')}
                </Button>
              }
            </div>
            <div className={styles.settings_item}>
              <label>{t('lastfm-enable')}</label>
              <Spacer />
              <Radio
                toggle
                checked={lastFmScrobblingEnabled}
                onChange={() =>
                  toggleScrobbling(
                    lastFmScrobblingEnabled,
                    enableScrobbling,
                    disableScrobbling
                  )
                }
              />
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
              <Button disabled={!lastFmFavImportStatus} loading={!lastFmFavImportStatus} onClick={fetchAllFmFavorites} color='green'>
                {t('fmfav-btn')}
              </Button>
            </div>
          </SocialIntegration>
        </Segment>
      </div>
      {_.map(optionsGroups, (group, i) => {
        const show = option => {
          return !option.hide;
        };
        if (group.some(show)) {
          return (
            <div key={i} className={styles.settings_section}>
              <Header>{t(i)}</Header>
              <hr />
              <Segment>
                {_.map(group, (option, j) => {
                  if (show(option)) {
                    return renderOption(settings, option, j);
                  }
                })}
              </Segment>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Settings;
