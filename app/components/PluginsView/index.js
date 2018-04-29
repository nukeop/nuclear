import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Dropdown, List, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import Header from '../Header';
import styles from './styles.scss';

class PluginsView extends React.Component {
  constructor(props) {
    super(props);
  }

  selectDefaultMusicSource(e, data) {
    this.props.actions.selectDefaultMusicSource(data.value);
  }

  render() {
    let {
      actions,
      plugins,
      defaultMusicSource
    } = this.props;

    let dropdownOptions = plugins.musicSources.map(s => {
      return {
        text: s.name,
        value: s.sourceName
      };
    });

    let defaultOption = _.find(dropdownOptions, {value: defaultMusicSource});
    defaultOption = defaultOption || dropdownOptions[0];

    return (
      <div className={styles.plugins_view_container}>
        <Header>
          Plugins
        </Header>
        <div className={styles.plugin_settings}>
          <Header>
            Music sources
          </Header>

          <span>
            Select the default music source:
            {' '}
            <Dropdown
              inline
              options={dropdownOptions}
              defaultValue={defaultOption.value}
              onChange={this.selectDefaultMusicSource.bind(this)}
            />
          </span>
        </div>
      </div>
    );
  }
}

export default PluginsView;
