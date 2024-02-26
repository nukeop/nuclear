import React, { useEffect } from 'react';
import { ipcRenderer, remote } from 'electron';
import { Button, Input, Radio, Segment, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { SettingType } from '@nuclear/core';
import { Dropdown, Range, TrackTable } from '@nuclear/ui';
import i18n from '@nuclear/i18n';
import Header from '../Header';
import Spacer from '../Spacer';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { LastFmSocialIntegration } from './Integrations/LastFmSocialIntegration';
import { MastodonSocialIntegration } from './Integrations/MastodonSocialIntegration';
import { RootState } from '../../reducers';
import { playlistsSelectors } from '../../selectors/playlists';
import { useSelector } from 'react-redux';
import { blacklistSelector } from '../../selectors/blacklist';
import * as BlacklistActions from '../../actions/blacklist';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

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
  mastodonActions: {
    registerNuclear: (instanceUrl: string) => void;
    getAccessToken: (authorizationCode: string) => void;
    logOut: React.MouseEventHandler;
    mastodonPost: (content: string) => void;
  };
  scrobbling: RootState['scrobbling'];
  importfavs: RootState['importfavs'];
  mastodon: RootState['mastodon'];
  settings: RootState['settings'];
  options: object;
  blacklistActions: object;
}

const Settings: React.FC<SettingsProps> = ({
  actions,
  mastodonActions,
  scrobbling,
  importfavs,
  mastodon,
  settings,
  options,
  blacklistActions
}) => {
  const dispatch = useDispatch();
  const blacklisted = useSelector(blacklistSelector);

  useEffect(() => {
    dispatch(BlacklistActions.readBlacklist());
  }, [dispatch]);

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
      placeholder={t(placeholder)}
      value={i18n.language}
      options={options}
      onChange={(e, { value }) => {
        i18n.changeLanguage(value as string);
        ipcRenderer.send('tray-menu-translations-update', {
          'play': i18n.t('command-palette:actions.play'),
          'pause': i18n.t('command-palette:actions.pause'),
          'next': i18n.t('command-palette:actions.next'),
          'previous': i18n.t('command-palette:actions.previous'),
          'quit': i18n.t('command-palette:actions.quit')
        });
      }}
    />
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

  const trackTableTranslation = useTranslation('track-table').t;
  const trackTableStrings = {
    addSelectedTracksToQueue: trackTableTranslation('add-selected-tracks-to-queue'),
    addSelectedTracksToDownloads: trackTableTranslation('add-selected-tracks-to-downloads'),
    addSelectedTracksToFavorites: trackTableTranslation('add-selected-tracks-to-favorites'),
    playSelectedTracksNow: trackTableTranslation('play-selected-tracks-now'),
    tracksSelectedLabelSingular: trackTableTranslation('tracks-selected-label-singular'),
    tracksSelectedLabelPlural: trackTableTranslation('tracks-selected-label-plural')
  };
  const playlists = useSelector(playlistsSelectors.localPlaylists);
  const popupTranstation = useTranslation('track-popup').t;
  const popupStrings = {
    textAddToQueue: popupTranstation('add-to-queue'),
    textPlayNow: popupTranstation('play-now'),
    textPlayNext: popupTranstation('play-next'),
    textAddToFavorites: popupTranstation('add-to-favorite'),
    textAddToPlaylist: popupTranstation('add-to-playlist'),
    textCreatePlaylist: popupTranstation('create-playlist'),
    textAddToDownloads: popupTranstation('download'),
    textAddToBlacklist: popupTranstation('blacklist'),
    createPlaylistDialog: {
      title: popupTranstation('create-playlist-dialog-title'),
      placeholder: popupTranstation('create-playlist-dialog-placeholder'),
      accept: popupTranstation('create-playlist-dialog-accept'),
      cancel: popupTranstation('create-playlist-dialog-cancel')
    }
  };
  const renderTableOption = () => (
    <TrackTable
      tracks={blacklisted}
      positionHeader={<Icon name='hashtag' />}
      thumbnailHeader={<Icon name='image' />}
      artistHeader={t('artist')}
      titleHeader={t('title')}
      albumHeader={t('album')}
      durationHeader={t('duration')}
      strings={trackTableStrings}
      playlists={playlists.data}
      popupActionStrings={popupStrings}
      isTrackFavorite={null}
      onDelete={blacklistActions}
      displayPosition={false}
      displayThumbnail={false}
      displayAlbum={false}
      displayDuration={false}
      displayFavorite={false}
      displayCustom={false}
      selectable={false}
      displayButtons={false}
    />
  );

  const renderSliderOption = (option) => (
    <div className={styles.slider_container}>
      <label>{t('less')}</label>
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
      <label>{t('more')}</label>
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
      {option.type === SettingType.TABLE &&
        renderTableOption()}   
    </div>
  );

  const optionsGroups = _.groupBy(options, 'category');
  const { t } = useTranslation('settings');

  return (
    <div className={styles.settings_container}>
      <div className={styles.settings_section}>
        <Header>{t('social')}</Header>
        <hr />
        <LastFmSocialIntegration
          actions={actions}
          scrobbling={scrobbling}
          importfavs={importfavs}
        />
        <MastodonSocialIntegration
          registerNuclear={mastodonActions.registerNuclear}
          getAccessToken={mastodonActions.getAccessToken}
          setStringOption={actions.setStringOption}
          logOut={mastodonActions.logOut}
          settings={settings}
          mastodon={mastodon}
        />
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

function mapStateToProps(state) {
  return {
    blacklist: state.blacklist
  };
}

function mapDispatchToProps(dispatch) {
  return {
    blacklistActions: bindActionCreators(BlacklistActions.removeBlacklistedTrack, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
