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
  selectStreamProvider,
  streamProvidersDropdownOptions,
  streamProvidersDefaultOption,

  selectLyricsProvider,
  lyricsProvidersDropdownOptions,
  lyricsProvidersDefaultOption,

  selectMetaProvider,
  metaProvidersDropdownOptions,
  metaProvidersDefaultOption,
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
          onChange={selectStreamProvider}
        />
      </Segment>
    </div>

    <div className={styles.plugin_settings_section}>
      <Header>{t('meta-providers')}</Header>
      <hr />
      <Segment>
        <label>
          {t('select-lyrics-provider')}
        </label>
        <Dropdown
          selection
          options={metaProvidersDropdownOptions}
          defaultValue={metaProvidersDefaultOption.value}
          onChange={selectMetaProvider}
        />
      </Segment>
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
          onChange={selectLyricsProvider}
        />
      </Segment>
    </div>

    <div className={styles.plugin_settings_section}>
      <Header>{t('user-plugins')}</Header>
      <hr />
    </div>
  </div>
);

/* eslint-disable */
PluginsView.propTypes = {
  actions: PropTypes.shape({
    selectStreamProvider: PropTypes.func,
    selectLyricsProvider: PropTypes.func,
    selectMetaProvider: PropTypes.func
  }),
  plugins: PropTypes.object,
  defaultMusicSource: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ])
};
/* eslint-enable */

export default compose(
  withHandlers({
    selectMusicSource: ({actions}) => (e, data) => actions.selectDefaultMusicSource(data.value),
    selectLyricsProvider: ({actions}) => (e, data) => actions.selectDefaultLyricsProvider(data.value)
  }),
  withDropdownOptions({
    options: props => props.plugins.streamProviders,
    defaultValue: props => props.selectedMusicSource,
    mappings: [
      'streamProvidersDropdownOptions',
      'streamProvidersDefaultOption'
    ]
  }),
  withDropdownOptions({
    options: props => props.plugins.lyricsProviders,
    defaultValue: props => props.selectedLyricsProvider,
    mappings: [
      'lyricsProvidersDropdownOptions',
      'lyricsProvidersDefaultOption'
    ]
  }),
  withDropdownOptions({
    options: props => props.plugins.metaProviders,
    defaultValue: props => props.selectedMetaProvider,
    mappings: [
      'metaProvidersDropdownOptions',
      'metaProvidersDefaultOption'
    ]
  }),
  withTranslation('plugins')
)(PluginsView);
