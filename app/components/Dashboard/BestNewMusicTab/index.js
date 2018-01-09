import React from 'react';
import {Dimmer, Loader, Tab} from 'semantic-ui-react';

import BestNewList from './BestNewList';
import styles from './styles.scss';

class BestNewMusicTab extends React.Component {
  constructor(props) {
    super(props);
  }

  isLoading() {
    return this.props.dashboardData.bestNewAlbums.length < 1 || this.props.dashboardData.bestNewTracks.length < 1;
  }

  render() {
    return (
      <Tab.Pane loading={this.isLoading()} attached={false} className={styles.best_new_music_tab_pane}>
	<div className={styles.best_new_music_tab_container}>
	  <BestNewList
	     data={this.props.dashboardData.bestNewAlbums}
	     />
	</div>
      </Tab.Pane>
    );
  }
}

export default BestNewMusicTab;
