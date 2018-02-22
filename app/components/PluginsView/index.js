import React from 'react';

import Header from '../Header';
import styles from './styles.scss';

class PluginsView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {

    } = this.props;
    return (
      <div className={styles.plugins_view_container}>
        <Header>
          Plugins
        </Header>
      </div>
    );
  }
}

export default PluginsView;
