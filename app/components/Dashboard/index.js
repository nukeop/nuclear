import React from 'react';
import { Tab } from 'semantic-ui-react';

import BestNewMusicTab from './BestNewMusicTab';
import ChartsTab from './ChartsTab';
import GenresTab from './GenresTab';
import NewsTab from './NewsTab';

import styles from './styles.scss';

class Dashboard extends React.Component {
  panes () {
    return [
      {
        menuItem: 'Best new music',
        render: () => (
          <BestNewMusicTab
            dashboardData={this.props.dashboardData}
            artistInfoSearchByName={this.props.artistInfoSearchByName}
            albumInfoSearchByName={this.props.albumInfoSearchByName}
            history={this.props.history}
            addToQueue={this.props.addToQueue}
            selectSong={this.props.selectSong}
            clearQueue={this.props.clearQueue}
            startPlayback={this.props.startPlayback}
            musicSources={this.props.musicSources}
          />
        )
      },
      {
        menuItem: 'Top Tracks',
        render: () => (
          <ChartsTab
            topTracks={this.props.dashboardData.topTracks}
            addToQueue={this.props.addToQueue}
            selectSong={this.props.selectSong}
            clearQueue={this.props.clearQueue}
            startPlayback={this.props.startPlayback}
            musicSources={this.props.musicSources}
          />
        )
      },
      {
        menuItem: 'Genres',
        render: () => (
          <GenresTab
            genres={this.props.dashboardData.topTags}
            history={this.props.history}
          />
        )
      },
      /* {
        menuItem: 'Events',
        render: () => {
          return null;
        },
      },*/
      {
        menuItem: 'News',
        render: () => <NewsTab news={this.props.dashboardData.news} />
      }
    ];
  }

  componentDidMount () {
    this.props.loadBestNewTracks();
    this.props.loadBestNewAlbums();
    this.props.loadNuclearNews();
    this.props.loadTopTags();
    this.props.loadTopTracks();
  }

  render () {
    return (
      <div className={styles.dashboard}>
        <Tab
          menu={{ secondary: true, pointing: true }}
          panes={this.panes()}
          className={styles.dashboard_tabs}
        />
      </div>
    );
  }
}

export default Dashboard;
