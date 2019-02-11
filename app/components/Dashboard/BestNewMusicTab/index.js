import React from 'react';
import { Tab } from 'semantic-ui-react';

import BestNewList from './BestNewList';
import styles from './styles.scss';

class BestNewMusicTab extends React.Component {
  constructor(props) {
    super(props);
  }

  isLoading () {
    return this.props.dashboardData.bestNewAlbums.length < 1 || this.props.dashboardData.bestNewTracks.length < 1;
  }

  render () {
    let {
      dashboardData,
      artistInfoSearchByName,
      history,
      albumInfoSearchByName
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
              albumInfoSearchByName={albumInfoSearchByName}
              history={history}
              addToQueue={this.props.addToQueue}
              selectSong={this.props.selectSong}
              clearQueue={this.props.clearQueue}
              startPlayback={this.props.startPlayback}
              musicSources={this.props.musicSources}
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
              addToQueue={this.props.addToQueue}
              selectSong={this.props.selectSong}
              clearQueue={this.props.clearQueue}
              startPlayback={this.props.startPlayback}
              musicSources={this.props.musicSources}
            />
          </div>
        </div>
      </Tab.Pane>
    );
  }
}

export default BestNewMusicTab;
