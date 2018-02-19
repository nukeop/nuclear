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
    let {
      dashboardData,
      artistInfoSearchByName,
      history
    } = this.props;
    return (
      <Tab.Pane loading={this.isLoading()} attached={false} className={styles.best_new_music_tab_pane}>
        <div className={styles.best_new_music_tab_container}>
          <h2>
            Best new albums
          </h2>
          <div className={styles.best_new_music_section_container}>
            <BestNewList
              data={dashboardData.bestNewAlbums}
              artistInfoSearchByName={artistInfoSearchByName}
              history={history}
            />
          </div>
          <h2>
            Best new tracks
          </h2>
          <div className={styles.best_new_music_section_container}>
            <BestNewList
              data={dashboardData.bestNewTracks}
              artistInfoSearchByName={artistInfoSearchByName}
              history={history}
            />
          </div>
        </div>
      </Tab.Pane>
    );
  }
}

export default BestNewMusicTab;
