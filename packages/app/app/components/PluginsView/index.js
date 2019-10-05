import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Segment } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { compose, withHandlers } from 'recompose';
import _ from 'lodash';

import Header from '../Header';
import {withDropdownOptions} from '../../hoc/withDropdownOptions';
import styles from './styles.scss';

const PluginsView = ({
  plugins,
  defaultLyricsProvider,

  selectDefaultMusicSource,
  streamProvidersDropdownOptions,
  streamProvidersDefaultOption,

  selectDefaultLyricsProvider,
  lyricsProvidersDropdownOptions,
  lyricsProvidersDefaultOption,
  t
}) => (
  <div className={styles.plugins_view_container}>
    <div className={styles.plugin_settings_section}>
      <Header>{t('stream-providers')}</Header>
      <hr />
      <Segment>
        <label>
          {t('placeholder')}
        </label>
        <Dropdown
          selection
          options={streamProvidersDropdownOptions}
          defaultValue={streamProvidersDefaultOption.value}
          onChange={selectDefaultMusicSource}
        />
      </Segment>
    </div>

    <div className={styles.plugin_settings_section}>
      <Header>{t('meta-providers')}</Header>
      <hr />
    </div>

    <div className={styles.plugin_settings_section}>
      <Header>{t('lyrics-providers')}</Header>
      <hr />
      <Segment>
        <label>
          {t('select-lyrics-provider')}
        </label>
        <Dropdown
          selection
          options={lyricsProvidersDropdownOptions}
          defaultValue={lyricsProvidersDefaultOption.value}
          onChange={selectDefaultLyricsProvider}
        />
      </Segment>
    </div>

    <div className={styles.plugin_settings_section}>
      <Header>{t('user-plugins')}</Header>
      <hr />
    </div>
  </div>
);

PluginsView.propTypes = {
  actions: PropTypes.shape({
    selectDefaultMusicSource: PropTypes.func
  }),
  plugins: PropTypes.object,
  defaultMusicSource: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ])
};

export default compose(
  withHandlers({
    selectDefaultMusicSource: ({actions}) => (e, data) => actions.selectDefaultMusicSource(data.value),
    selectDefaultLyricsProvider: ({actions}) => (e, data) => actions.selectDefaultLyricsProvider(data.value)
  }),
  withDropdownOptions({
    options: props => props.plugins.streamProviders,
    defaultValue: props => props.defaultMusicSource,
    mappings: [
      'streamProvidersDropdownOptions',
      'streamProvidersDefaultOption'
    ]
  }),
  withDropdownOptions({
    options: props => props.plugins.lyricsProviders,
    defaultValue: props => props.defaultLyricsProvider,
    mappings: [
      'lyricsProvidersDropdownOptions',
      'lyricsProvidersDefaultOption'
    ]
  }),
  withTranslation('plugins')
)(PluginsView);
