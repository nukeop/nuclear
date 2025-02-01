import React, { SyntheticEvent } from 'react';
import { Dropdown, DropdownProps, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import Header from '../Header';
import UserPluginsSection from './UserPluginsSection';
import styles from './styles.scss';
import { useDropdownOptions } from '../../hooks/useDropdownOptions';
import { PluginsState } from '../../reducers/plugins';
import { useDispatch } from 'react-redux';
import * as pluginActions from '../../actions/plugins';

type PluginsViewProps = {
  plugins: PluginsState['plugins'];
  userPlugins: PluginsState['userPlugins'];

  selectedMusicSource: string;
  selectedLyricsProvider: string;
  selectedMetaProvider: string;
}

const PluginsView: React.FC<PluginsViewProps> = ({
  plugins,
  userPlugins,
  
  selectedMusicSource,
  selectedLyricsProvider,
  selectedMetaProvider
}) => {
  const { t } = useTranslation('plugins');
  const dispatch = useDispatch();

  const [lyricsProvidersDropdownOptions,
    lyricsProvidersDefaultOption] = useDropdownOptions({
    options: plugins.lyricsProviders,
    defaultValue: selectedLyricsProvider
  });

  const [metaProvidersDropdownOptions, metaProvidersDefaultOption] = useDropdownOptions({
    options: plugins.metaProviders,
    defaultValue: selectedMetaProvider
  });

  const [streamProvidersDropdownOptions, streamProvidersDefaultOption] = useDropdownOptions({
    options: plugins.streamProviders,
    defaultValue: selectedMusicSource
  });

  const [selectStreamProvider, selectMetaProvider, selectLyricsProvider] = [
    pluginActions.selectStreamProvider,
    pluginActions.selectMetaProvider,
    pluginActions.selectLyricsProvider
  ].map(action => (event: SyntheticEvent, data: DropdownProps) => dispatch(action(data.value)));

  const [loadUserPlugin, deleteUserPlugin] = [
    pluginActions.loadUserPlugin,
    pluginActions.deleteUserPlugin
  ].map(action => (path: string) => dispatch(action(path)));

  return (
    <div className={styles.plugins_view_container}>
      <section className={styles.plugin_settings_section}>
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
            onChange={selectStreamProvider} />
        </Segment>
      </section>

      <section className={styles.plugin_settings_section}>
        <Header>{t('meta-providers')}</Header>
        <hr />
        <Segment>
          <label>
            {t('select-meta-provider')}
          </label>
          <Dropdown
            selection
            options={metaProvidersDropdownOptions}
            defaultValue={metaProvidersDefaultOption.value}
            onChange={selectMetaProvider} />
        </Segment>
      </section>

      <section className={styles.plugin_settings_section}>
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
            onChange={selectLyricsProvider} />
        </Segment>
      </section>

      <section className={styles.plugin_settings_section}>
        <Header>{t('user-plugins')}</Header>
        <hr />
        <UserPluginsSection
          loadUserPlugin={loadUserPlugin}
          deleteUserPlugin={deleteUserPlugin}
          userPlugins={userPlugins} />
      </section>
    </div>
  );
};

export default PluginsView;
