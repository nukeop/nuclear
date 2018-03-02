import React from 'react';
import { Menu } from 'semantic-ui-react';
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
          <Menu vertical inverted>
            {
              _.map(plugins, (category, key) => {
                return (
                  <Menu.Item>
                    <Menu.Header>{key}</Menu.Header>
                    <Menu.Menu>
                      {
                        category.map(plugin => {
                          return (
                            <Menu.Item>
                              {plugin.name}
                            </Menu.Item>
                          );
                        })
                      }
                    </Menu.Menu>
                  </Menu.Item>
                );
              })
            }
          </Menu>
          <div className={styles.plugin_well}>
            Plugin settings
          </div>
        </div>

      </div>
    );
  }
}

export default PluginsView;
