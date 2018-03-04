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
                plugins.musicSources.map(source => {
                  return (
                    <List.Item>
                      <List.Content>
                        <List.Header>{source.name}</List.Header>
                        {source.description}
                      </List.Content>
                      <div className={styles.plugin_buttons}>
                        <a className='link_button' href='#'><FontAwesome name='angle-up'/></a>
                        <a className='link_button' href='#'><FontAwesome name='angle-down'/></a>
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
