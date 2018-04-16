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

  sortPlugins(musicSources, musicSourceOrder) {
    let result = musicSources;
    if (musicSourceOrder) {
      result = _.sortBy(musicSources, source => {
        if(_.includes(musicSourceOrder, source.name)) {
          return _.indexOf(musicSourceOrder, source.name);
        } else {
          return 99;
        }
      });
    }
    return result;
  }

  movePlugin(index, dir) {
    let order = this.sortPlugins(this.props.plugins.musicSources, this.props.musicSourceOrder);
    order = _.map(order, source => source.name);
    let temp = order[index + dir];
    order[index + dir] = order[index];
    order[index] = temp;
    this.props.actions.saveMusicSourceOrder(order);
  }

  render() {
    let {
      plugins,
      musicSourceOrder
    } = this.props;

    let musicSources = plugins.musicSources;
    musicSources = this.sortPlugins(plugins.musicSources, musicSourceOrder);

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
                musicSources.map((source, index) => {
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
