import React from 'react';
import FontAwesome from 'react-fontawesome';
import { List, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import Header from '../Header';
import styles from './styles.scss';

class PluginsView extends React.Component {
  constructor(props) {
    super(props);
  }

  movePlugin(index, dir) {
    let newPlugins = _.cloneDeep(this.props.plugins);
    let temp = newPlugins.musicSources[index+dir];
    newPlugins.musicSources[index+dir] = newPlugins.musicSources[index];
    newPlugins.musicSources[index] = temp;
    this.props.actions.replacePlugins(newPlugins);
  }

  render() {
    let {
      plugins
    } = this.props;
    return (
      <div className={styles.plugins_view_container}>
        <Header>
          Plugins
        </Header>
        <div className={styles.plugin_settings}>
          <Header>
            Music sources
          </Header>
          <Segment inverted>
            <List celled inverted>
              {
                plugins.musicSources.map((source, index) => {
                  return (
                    <List.Item>
                      <div className={styles.plugin_index}>
                        {index + 1}.
                      </div>
                      <List.Content>
                        <List.Header>{source.name}</List.Header>
                        {source.description}
                      </List.Content>
                      <div className={styles.plugin_buttons}>
                        {
                          index > 0 &&
                          <a className='link_button' disabled href='#' onClick={() => this.movePlugin(index, -1)}><FontAwesome name='angle-up'/></a>
                        }
                        {
                          index < plugins.musicSources.length - 1 &&
                          <a className='link_button' href='#' onClick={() => this.movePlugin(index, 1)}><FontAwesome name='angle-down'/></a>
                        }
                      </div>
                    </List.Item>
                  );
                })
              }
            </List>
          </Segment>
        </div>
      </div>
    );
  }
}

export default PluginsView;
