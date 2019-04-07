import React from 'react';
import { Tab } from 'semantic-ui-react';

import BestNewMusicTab from './BestNewMusicTab';
import ChartsTab from './ChartsTab';
import GenresTab from './GenresTab';
import NewsTab from './NewsTab';

import styles from './styles.scss';

class Dashboard extends React.Component {
  
  
  panes () {
    const {
      actions,
      dashboardData,
      history,
      musicSources,
      settings
    } = this.props;

    const {
      artistInfoSearchByName,
      albumInfoSearchByName,
      addToQueue,
      selectSong,
      clearQueue,
      startPlayback,
      addFavoriteTrack,
      info
    } = actions;
    
    return [
      {
        menuItem: 'Best new music',
        render: () => (
          <BestNewMusicTab
            dashboardData={dashboardData}
            artistInfoSearchByName={artistInfoSearchByName}
            albumInfoSearchByName={albumInfoSearchByName}
            history={history}
            addToQueue={addToQueue}
            selectSong={selectSong}
            clearQueue={clearQueue}
            startPlayback={startPlayback}
            musicSources={musicSources}
          />
        )
      },
      {
        menuItem: 'Top Tracks',
        render: () => (
          <ChartsTab
            topTracks={dashboardData.topTracks}
          />
        )
      },
      {
        menuItem: 'Genres',
        render: () => (
          <GenresTab
            genres={dashboardData.topTags}
            history={history}
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
        render: () => <NewsTab news={dashboardData.news} />
      }
    ];
  }

  componentDidMount () {
    this.props.actions.loadBestNewTracks();
    this.props.actions.loadBestNewAlbums();
    this.props.actions.loadNuclearNews();
    this.props.actions.loadTopTags();
    this.props.actions.loadTopTracks();
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
